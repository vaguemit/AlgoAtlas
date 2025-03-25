"use client"

import { useEffect, useRef, useState } from "react"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkle: number
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Skip during SSR
    if (typeof window === "undefined") return undefined

    // Mark component as mounted
    setIsMounted(true)

    // Use requestAnimationFrame to ensure the browser is ready
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
      const stars: Star[] = []
      const starCount = Math.min(Math.floor(window.innerWidth * 0.08), 200)

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          speed: 0.05 + Math.random() * 0.1,
          twinkle: Math.random() * 0.05,
        })
      }

      // Handle mouse movement
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        })
      }

      // Handle scroll
      const handleScroll = () => {
        setScrollPosition(window.scrollY / (document.body.scrollHeight - window.innerHeight))
      }

      // Add event listeners
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      window.addEventListener("scroll", handleScroll, { passive: true })
      window.addEventListener("resize", resizeCanvas, { passive: true })

      // Animation loop
      let animationFrameId: number

      const animate = () => {
        if (!canvas || !ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0D0D0D")
        gradient.addColorStop(0.5, "#2E0854")
        gradient.addColorStop(1, "#4B0082")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw and update stars
        stars.forEach((star) => {
          // Twinkle effect
          const twinkleOpacity = Math.sin(Date.now() * star.twinkle) * 0.3 + 0.7

          // Adjust star brightness based on mouse proximity
          const dx = star.x / canvas.width - mousePosition.x
          const dy = star.y / canvas.height - mousePosition.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const mouseInfluence = Math.max(0, 1 - distance * 2)

          // Draw star
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * (1 + mouseInfluence * 0.5), 0, Math.PI * 2)

          // Color based on position and scroll
          const hue = (star.y / canvas.height) * 60 + 240 + scrollPosition * 20
          ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${star.opacity * twinkleOpacity * (1 + mouseInfluence * 0.5)})`
          ctx.fill()

          // Move stars
          star.y += star.speed

          // Reset stars that go off screen
          if (star.y > canvas.height) {
            star.y = 0
            star.x = Math.random() * canvas.width
          }
        })

        // Add subtle glow effects based on mouse position
        const glowRadius = 200
        const glowX = mousePosition.x * canvas.width
        const glowY = mousePosition.y * canvas.height

        const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius)

        glow.addColorStop(0, "rgba(138, 43, 226, 0.2)")
        glow.addColorStop(1, "rgba(138, 43, 226, 0)")

        ctx.fillStyle = glow
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        animationFrameId = requestAnimationFrame(animate)
      }

      animate()

      // Cleanup function
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", resizeCanvas)
        cancelAnimationFrame(animationFrameId)
      }
    })

    // Clean up the initial requestAnimationFrame
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}

