"use client"

import { useEffect, useRef, useState } from "react"

interface Nebula {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  speed: number
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

      // Create nebulae - adjust colors to match GitHub's purple theme
      const nebulae: Nebula[] = []
      const nebulaCount = 8 // Increased number of nebulae for more cosmic effect
      
      for (let i = 0; i < nebulaCount; i++) {
        nebulae.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 300 + 200, // Larger nebulae
          color: `hsl(${270 + Math.random() * 40}, 80%, ${30 + Math.random() * 20}%)`, // More vibrant purple hues
          opacity: Math.random() * 0.08 + 0.04, // Higher opacity for more visibility
          speed: Math.random() * 0.08 - 0.04 // Slightly slower movement
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

        // Draw gradient background - Darker navy to purple gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0A0B1E") // Very dark navy blue at top
        gradient.addColorStop(0.4, "#0F0B2B") // Dark navy-purple transition
        gradient.addColorStop(0.7, "#1A0B38") // Deep purple
        gradient.addColorStop(1, "#2A1151") // Lighter violet at bottom

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw nebulae - darker but still visible
        nebulae.forEach((nebula) => {
          // Create radial gradient for nebula
          const nebulaGradient = ctx.createRadialGradient(
            nebula.x, nebula.y, 0,
            nebula.x, nebula.y, nebula.radius
          )
          
          // Use darker purples with moderate opacity
          nebulaGradient.addColorStop(0, `hsla(260, 70%, 20%, ${nebula.opacity * 0.4})`)
          nebulaGradient.addColorStop(0.6, `hsla(260, 70%, 15%, ${nebula.opacity * 0.2})`)
          nebulaGradient.addColorStop(1, 'hsla(260, 70%, 10%, 0)')
          
          ctx.fillStyle = nebulaGradient
          ctx.fillRect(nebula.x - nebula.radius, nebula.y - nebula.radius, 
                      nebula.radius * 2, nebula.radius * 2)
          
          // Move nebula slowly
          nebula.x += nebula.speed
          nebula.y += nebula.speed * 0.5
          
          // Reset nebula if it goes off screen
          if (nebula.x < -nebula.radius * 2 || nebula.x > canvas.width + nebula.radius * 2 ||
              nebula.y < -nebula.radius * 2 || nebula.y > canvas.height + nebula.radius * 2) {
            nebula.x = Math.random() * canvas.width
            nebula.y = Math.random() * canvas.height
            nebula.color = `hsl(${270 + Math.random() * 40}, 80%, ${30 + Math.random() * 20}%)`
          }
        })

        // Add subtle glow effects based on mouse position
        const glowRadius = 300 // Larger radius
        const glowX = mousePosition.x * canvas.width
        const glowY = mousePosition.y * canvas.height

        const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius)

        glow.addColorStop(0, "rgba(138, 43, 226, 0.15)") // Darker purple with lower opacity
        glow.addColorStop(0.6, "rgba(98, 30, 170, 0.1)")
        glow.addColorStop(1, "rgba(85, 26, 139, 0)")

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

