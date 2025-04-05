"use client"

import type React from "react"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

interface LogoItemProps {
  name: string
  logo: string 
}

const logos: LogoItemProps[] = [
  {
    name: "Codeforces",
    logo: "/logos/codeforces.png",
  },
  {
    name: "AtCoder",
    logo: "/logos/atcoder.png",
  },
  {
    name: "CodeChef",
    logo: "/logos/codechef.png",
  },
]

// Duplicate the logos array to create a seamless loop
const duplicatedLogos = [...logos, ...logos, ...logos, ...logos]

function LogoItem({ name, logo }: LogoItemProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-2 sm:p-3 mx-4 sm:mx-6 md:mx-10"
      whileHover={{ scale: 1.12, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {/* Logo */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 relative group">
        <motion.div 
          className="absolute inset-0 -z-10 bg-transparent rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />
        <Image
          src={logo}
          alt={`${name} logo`}
          fill
          className="object-contain brightness-200 contrast-50 opacity-90 hover:opacity-100 transition-all duration-300 filter saturate-0"
          sizes="(max-width: 640px) 56px, (max-width: 1024px) 72px, 80px"
        />
      </div>
      <span className="mt-2 text-sm sm:text-base text-white/60 font-medium group-hover:text-white/90 transition-colors duration-300">{name}</span>
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
    if (isSmallScreen) return 110 // Smaller on mobile
    if (isMediumScreen) return 140 // Medium on tablets
    return 180 // Default for desktop
  }

  const itemWidth = getItemWidth()
  const totalWidth = duplicatedLogos.length * itemWidth

  // Animation duration based on the number of logos and screen size
  const getAnimationDuration = () => {
    if (isSmallScreen) return duplicatedLogos.length * 1.5
    if (isMediumScreen) return duplicatedLogos.length * 1.1
    return duplicatedLogos.length * 0.8
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
            ease: "linear",
            times: [0, 1],
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
    <motion.section 
      className="relative py-8 sm:py-12 overflow-hidden bg-transparent w-screen -ml-[calc(50vw-50%)] mr-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent"></div>

      {/* Background gradient - completely transparent */}
      <div className="absolute inset-0 pointer-events-none bg-transparent"></div>

      <div className="relative z-10 bg-transparent">
        <motion.div 
          className="text-center mb-4 sm:mb-6 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-fluid-2xl sm:text-fluid-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Practice Across Top Platforms
          </h2>
          <p className="mt-2 text-fluid-base text-white/70 max-w-2xl mx-auto">
            AlgoAtlas helps you prepare for challenges on all major competitive programming platforms
          </p>
        </motion.div>

        {/* Logo carousel */}
        <div
          className="relative w-full overflow-hidden bg-transparent"
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseEnter}
          onTouchEnd={handleMouseLeave}
        >
          {mounted && (
            <motion.div 
              className="flex bg-transparent" 
              animate={controls} 
              initial={{ x: 0 }}
            >
              {duplicatedLogos.map((logo, index) => (
                <LogoItem key={`${logo.name}-${index}`} {...logo} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent"></div>
    </motion.section>
  )
}
