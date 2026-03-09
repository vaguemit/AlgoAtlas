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

      // Create nebulae - with reduced effects
      const nebulae: Nebula[] = []
      const nebulaCount = 6 // Reduced number of nebulae
      
      for (let i = 0; i < nebulaCount; i++) {
        // Calculate position to avoid top-left corner
        let x = Math.random() * canvas.width
        let y = Math.random() * canvas.height
        
        // If in top-left quadrant, move it to a different area
        if (x < canvas.width * 0.3 && y < canvas.height * 0.3) {
          x += canvas.width * 0.3
          y += canvas.height * 0.2
        }
        
        nebulae.push({
          x: x,
          y: y,
          radius: Math.random() * 200 + 150, // Smaller nebulae
          color: `hsl(${270 + Math.random() * 40}, 80%, ${30 + Math.random() * 20}%)`,
          opacity: Math.random() * 0.03 + 0.01, // Further reduced opacity
          speed: Math.random() * 0.06 - 0.03 // Slightly slower movement
        })
      }

      // Handle scroll
      const handleScroll = () => {
        setScrollPosition(window.scrollY / (document.body.scrollHeight - window.innerHeight))
      }

      // Add event listeners
      window.addEventListener("scroll", handleScroll, { passive: true })
      window.addEventListener("resize", resizeCanvas, { passive: true })

      // Animation loop
      let animationFrameId: number

      const animate = () => {
        if (!canvas || !ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Use a single solid background color instead of gradient
        ctx.fillStyle = "#0A0B1E" // Very dark navy blue
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw nebulae - darker and less visible
        nebulae.forEach((nebula) => {
          // Create radial gradient for nebula
          const nebulaGradient = ctx.createRadialGradient(
            nebula.x, nebula.y, 0,
            nebula.x, nebula.y, nebula.radius
          )
          
          // Use darker purples with lower opacity
          nebulaGradient.addColorStop(0, `hsla(260, 70%, 20%, ${nebula.opacity * 0.2})`)
          nebulaGradient.addColorStop(0.6, `hsla(260, 70%, 15%, ${nebula.opacity * 0.1})`)
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
            
            // When resetting, avoid top-left corner
            let newX = Math.random() * canvas.width
            let newY = Math.random() * canvas.height
            
            if (newX < canvas.width * 0.3 && newY < canvas.height * 0.3) {
              newX += canvas.width * 0.3
              newY += canvas.height * 0.2
            }
            
            nebula.x = newX
            nebula.y = newY
            nebula.color = `hsl(${270 + Math.random() * 40}, 80%, ${30 + Math.random() * 20}%)`
          }
        })

        animationFrameId = requestAnimationFrame(animate)
      }

      animate()

      // Cleanup function
      return () => {
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

