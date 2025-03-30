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

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  life: number
  maxLife: number
}

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
      
      // Create shooting stars
      const shootingStars: ShootingStar[] = []
      const maxShootingStars = 3
      
      // Create nebulae - adjust colors to match GitHub's purple theme
      const nebulae: Nebula[] = []
      const nebulaCount = 4 // Fewer nebulae for subtlety
      
      for (let i = 0; i < nebulaCount; i++) {
        nebulae.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 250 + 150,
          color: `hsl(${240 + Math.random() * 30}, 70%, 40%)`, // More purple-blue hues
          opacity: Math.random() * 0.03 + 0.01, // More subtle opacity
          speed: Math.random() * 0.1 - 0.05 // Slower movement
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

      // Create a new shooting star randomly
      const createShootingStar = () => {
        if (shootingStars.length < maxShootingStars && Math.random() < 0.01) {
          const angle = Math.random() * Math.PI * 0.5 - Math.PI * 0.25
          shootingStars.push({
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 80 + 50,
            speed: Math.random() * 15 + 10,
            angle: angle,
            opacity: Math.random() * 0.5 + 0.5,
            life: 0,
            maxLife: Math.random() * 100 + 50
          })
        }
      }

      // Animation loop
      let animationFrameId: number

      const animate = () => {
        if (!canvas || !ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0F0822") // Slightly brighter dark purple at the top
        gradient.addColorStop(0.2, "#14092D") // Richer purple tone
        gradient.addColorStop(0.7, "#110830") // Dark purple
        gradient.addColorStop(1, "#09061A") // Almost black at the bottom

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw nebulae - reduce count and make more subtle
        nebulae.forEach((nebula) => {
          // Create radial gradient for nebula
          const nebulaGradient = ctx.createRadialGradient(
            nebula.x, nebula.y, 0,
            nebula.x, nebula.y, nebula.radius
          )
          
          // Use more subtle purples with lower opacity
          nebulaGradient.addColorStop(0, `${nebula.color.replace(')', `,${nebula.opacity * 0.5})`).replace('hsl', 'hsla')}`)
          nebulaGradient.addColorStop(1, `${nebula.color.replace(')', `,0)`).replace('hsl', 'hsla')}`)
          
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
            nebula.color = `hsl(${240 + Math.random() * 30}, 70%, 40%)`
          }
        })

        // Draw and update stars - adjust stars to be more subtle
        stars.forEach((star) => {
          // Twinkle effect
          const twinkleOpacity = Math.sin(Date.now() * star.twinkle) * 0.2 + 0.7 // Reduced twinkle intensity

          // Adjust star brightness based on mouse proximity
          const dx = star.x / canvas.width - mousePosition.x
          const dy = star.y / canvas.height - mousePosition.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const mouseInfluence = Math.max(0, 1 - distance * 2)

          // Draw star
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * (1 + mouseInfluence * 0.5), 0, Math.PI * 2)

          // Color based on position and scroll - shift to more purple hues
          const hue = (star.y / canvas.height) * 30 + 250 + scrollPosition * 10
          ctx.fillStyle = `hsla(${hue}, 90%, 85%, ${star.opacity * twinkleOpacity * (1 + mouseInfluence * 0.4)})`
          ctx.fill()

          // Move stars
          star.y += star.speed

          // Reset stars that go off screen
          if (star.y > canvas.height) {
            star.y = 0
            star.x = Math.random() * canvas.width
          }
        })
        
        // Possibly create a new shooting star
        createShootingStar()
        
        // Draw and update shooting stars
        shootingStars.forEach((star, index) => {
          // Calculate end position
          const endX = star.x + Math.cos(star.angle) * star.length
          const endY = star.y + Math.sin(star.angle) * star.length
          
          // Create gradient for the shooting star
          const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          
          // Draw the shooting star
          ctx.beginPath()
          ctx.moveTo(star.x, star.y)
          ctx.lineTo(endX, endY)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.stroke()
          
          // Add a glow effect
          ctx.beginPath()
          ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, ' + star.opacity + ')'
          ctx.fill()
          
          // Move shooting star
          star.x += Math.cos(star.angle) * star.speed
          star.y += Math.sin(star.angle) * star.speed
          
          // Increment life
          star.life++
          
          // Remove if it's off screen or lived its life
          if (star.x < 0 || star.x > canvas.width || 
              star.y < 0 || star.y > canvas.height ||
              star.life > star.maxLife) {
            shootingStars.splice(index, 1)
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

