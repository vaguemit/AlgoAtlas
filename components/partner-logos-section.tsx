"use client"

import type React from "react"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

interface LogoItemProps {
  name: string
  logo: string // Changed from ReactNode to string for image path
}

const logos: LogoItemProps[] = [
  {
    name: "Codeforces",
    logo: "/logos/codeforces.png", // Add your logo file here
  },
  {
    name: "AtCoder",
    logo: "/logos/atcoder.png", // Add your logo file here
  },
  {
    name: "CodeChef",
    logo: "/logos/codechef.png", // Add your logo file here
  },
]

// Duplicate the logos array to create a seamless loop
const duplicatedLogos = [...logos, ...logos, ...logos, ...logos]

function LogoItem({ name, logo }: LogoItemProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-4 sm:p-6 mx-6 sm:mx-10 md:mx-16"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Logo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-70 hover:opacity-100 transition-opacity duration-300 relative">
        <Image
          src={logo}
          alt={`${name} logo`}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
        />
      </div>
      <span className="mt-2 text-sm sm:text-base text-white/70 font-medium">{name}</span>
    </motion.div>
  )
}

export function PartnerLogosSection() {
  const [mounted, setMounted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const controls = useAnimationControls()
  const containerRef = useRef<HTMLDivElement>(null)
  const isSmallScreen = useMediaQuery("(max-width: 640px)")
  const isMediumScreen = useMediaQuery("(max-width: 1024px)")

  // Calculate the total width of the carousel items based on screen size
  const getItemWidth = () => {
    if (isSmallScreen) return 120 // Smaller on mobile
    if (isMediumScreen) return 160 // Medium on tablets
    return 200 // Default for desktop
  }

  const itemWidth = getItemWidth()
  const totalWidth = duplicatedLogos.length * itemWidth

  // Animation duration based on the number of logos and screen size
  // Faster animation for all screen sizes
  const getAnimationDuration = () => {
    if (isSmallScreen) return duplicatedLogos.length * 2 // Reduced from 4
    if (isMediumScreen) return duplicatedLogos.length * 1.5 // Reduced from 3.5
    return duplicatedLogos.length * 1 // Reduced from 3
  }

  const animationDuration = getAnimationDuration()

  // Only run animations after component has mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isPaused) {
      // Only run animation on client side after mounting
      controls.start({
        x: [`0px`, `-${totalWidth / 4}px`],
        transition: {
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: animationDuration,
            ease: [0.4, 0, 0.2, 1], // Custom easing for smoother motion
            times: [0, 1], // Explicit timing
          },
        },
      })
    } else if (mounted && isPaused) {
      controls.stop()
    }

    return () => {
      if (mounted && typeof window !== "undefined") {
        controls.stop()
      }
    }
  }, [controls, totalWidth, animationDuration, mounted, isPaused])

  // Handle pause/resume on hover
  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2E0854]/80 to-[#4B0082]/80 pointer-events-none"></div>

      <div className="container mx-auto px-fluid-2 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-fluid-2xl sm:text-fluid-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Practice Across Top Platforms
          </h2>
          <p className="mt-3 text-fluid-base text-white/70 max-w-2xl mx-auto">
            AlgoAtlas helps you prepare for challenges on all major competitive programming platforms
          </p>
        </div>

        {/* Logo carousel */}
        <div
          className="relative w-full overflow-hidden"
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseEnter}
          onTouchEnd={handleMouseLeave}
        >
          {mounted && (
            <motion.div className="flex" animate={controls} initial={{ x: 0 }}>
              {duplicatedLogos.map((logo, index) => (
                <LogoItem key={`${logo.name}-${index}`} {...logo} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Gradient overlays for smooth fade effect at the edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-[#2E0854]/80 to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-[#2E0854]/80 to-transparent pointer-events-none z-10"></div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
    </section>
  )
}

