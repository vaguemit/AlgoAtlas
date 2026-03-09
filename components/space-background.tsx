"use client"

import { useEffect, useRef, useState } from "react"

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Only run client-side code after component has mounted
  useEffect(() => {
    // Set mounted state
    setIsMounted(true)

    // Skip the rest of the effect during SSR
    if (typeof window === "undefined") return undefined

    // Wait for next frame to ensure DOM is ready
    const frameId = requestAnimationFrame(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size
      const resizeCanvas = () => {
        if (!canvas) return
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      resizeCanvas()

      // Create stars
      const stars = []
      const starCount = window.innerWidth < 768 ? 100 : 200

      for (let i = 0; i < starCount; i++) {
        const radius = Math.random() * (window.innerWidth < 768 ? 0.8 : 1.2)
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: radius,
          color: `rgba(${155 + Math.random() * 100}, ${155 + Math.random() * 100}, ${255}, ${0.3 + Math.random() * 0.4})`,
          velocity: 0.03 + Math.random() * 0.08,
          twinkle: Math.random() * 0.05,
        })
      }

      // Create nebula clouds
      const nebulaCount = window.innerWidth < 768 ? 3 : 5
      const nebulae = []

      for (let i = 0; i < nebulaCount; i++) {
        const colors = [
          `rgba(147, 51, 234, ${0.02 + Math.random() * 0.03})`, // Purple
          `rgba(59, 130, 246, ${0.02 + Math.random() * 0.03})`, // Blue
          `rgba(236, 72, 153, ${0.01 + Math.random() * 0.02})`, // Pink
          `rgba(250, 204, 21, ${0.01 + Math.random() * 0.02})`, // Yellow
        ]

        nebulae.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: (window.innerWidth < 768 ? 70 : 100) + Math.random() * (window.innerWidth < 768 ? 100 : 200),
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      // Create floating symbols
      const symbols = ["{", "}", "[", "]", "<", ">", "(", ")", "+", "-", "*", "/"]
      const floatingSymbols = []

      for (let i = 0; i < (window.innerWidth < 768 ? 5 : 10); i++) {
        const colors = [
          "rgba(147, 51, 234, 0.4)", // Purple
          "rgba(59, 130, 246, 0.4)", // Blue
          "rgba(236, 72, 153, 0.3)", // Pink
          "rgba(250, 204, 21, 0.3)", // Yellow
        ]

        floatingSymbols.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 10 + Math.random() * 12,
          velocity: {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
          },
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
        })
      }

      // Animation loop
      let animationFrameId

      const animate = () => {
        if (!canvas || !ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw nebulae
        nebulae.forEach((nebula) => {
          const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius)
          gradient.addColorStop(0, nebula.color)
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

          ctx.beginPath()
          ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        })

        // Draw and update stars
        stars.forEach((star) => {
          // Twinkle effect
          const twinkleOpacity = Math.sin(Date.now() * star.twinkle) * 0.3 + 0.7
          const color = star.color.replace(/[\d.]+\)$/, `${twinkleOpacity})`)

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()

          // Move stars
          star.y += star.velocity

          // Reset stars that go off screen
          if (star.y > canvas.height) {
            star.y = 0
            star.x = Math.random() * canvas.width
          }
        })

        // Draw and update floating symbols
        floatingSymbols.forEach((symbol) => {
          ctx.save()
          ctx.translate(symbol.x, symbol.y)
          ctx.rotate(symbol.rotation)
          ctx.font = `${symbol.size}px monospace`
          ctx.fillStyle = symbol.color
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(symbol.symbol, 0, 0)
          ctx.restore()

          // Update position
          symbol.x += symbol.velocity.x
          symbol.y += symbol.velocity.y
          symbol.rotation += symbol.rotationSpeed

          // Bounce off edges
          if (symbol.x < 0 || symbol.x > canvas.width) {
            symbol.velocity.x *= -1
          }
          if (symbol.y < 0 || symbol.y > canvas.height) {
            symbol.velocity.y *= -1
          }
        })

        animationFrameId = requestAnimationFrame(animate)
      }

      animate()

      // Handle resize - using a safer approach without direct event listeners
      let resizeTimer
      const handleResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          resizeCanvas()
        }, 100)
      }

      // Only add event listener if window exists
      if (typeof window !== "undefined") {
        window.addEventListener("resize", handleResize)
      }

      // Cleanup function
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("resize", handleResize)
        }
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        clearTimeout(resizeTimer)
      }
    })

    // Clean up the initial requestAnimationFrame
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}

