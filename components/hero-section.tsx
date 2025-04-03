"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CosmicBackground } from "./cosmic-background"
import { CodePreviewPanel } from "./code-preview-panel"
import { useMediaQuery } from "@/hooks/use-media-query"

export function HeroSection() {
  // Track hover states for enhanced effects
  const [isGetStartedHovered, setIsGetStartedHovered] = useState(false)
  const [isLearnMoreHovered, setIsLearnMoreHovered] = useState(false)
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  
  useEffect(() => {
    // Small delay to start animations after component mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 90,
        damping: 16
      }
    }
  }

  const codePreviewVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 60,
        damping: 20,
        delay: 0.5
      }
    }
  }

  return (
    <section className="relative w-full min-h-[90svh] overflow-hidden">
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Content container - shifted to left with asymmetric layout */}
      <motion.div 
        className="relative z-10 container mx-auto px-fluid-2 pt-16 sm:pt-24 pb-16 flex flex-col md:flex-row items-start justify-center min-h-[90svh] gap-8 lg:gap-12"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Text content on the left */}
        <div className="w-full md:w-1/2 mx-auto md:mx-0 flex flex-col justify-center">
          {/* Static content with hover effects - left aligned */}
          <motion.div className="mb-6 sm:mb-10" variants={itemVariants}>
            <div className="flex flex-col items-start">
              <div
                className="relative mb-5 cursor-pointer transition-transform duration-300 ease-out"
                style={{ transform: isTitleHovered ? "scale(1.03)" : "scale(1)" }}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                <div className="text-fluid-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 animate-gradient">
                  AlgoAtlas
                </div>
                <div
                  className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl rounded-full -z-10 transition-opacity duration-300"
                  style={{ opacity: isTitleHovered ? 0.9 : 0.6 }}
                ></div>
              </div>
              <div className="text-fluid-xl md:text-fluid-2xl text-blue-200 font-light tracking-wide hover:text-blue-100 transition-colors duration-300">
                Master Algorithms & Data Structures
              </div>
              <motion.div 
                className="h-1 w-24 sm:w-32 md:w-40 mt-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full origin-left"
                whileHover={{ width: "12rem" }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </motion.div>

          {/* CTA Buttons with enhanced hover effects */}
          <motion.div 
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-start w-full px-fluid-2 sm:px-0"
            variants={itemVariants}
          >
            <motion.a
              href="/get-started"
              className="relative group w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsGetStartedHovered(true)}
              onMouseLeave={() => setIsGetStartedHovered(false)}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-xl blur-md transition-all duration-300"
                style={{
                  opacity: isGetStartedHovered ? 0.8 : 0.5,
                  transform: isGetStartedHovered ? "scale(1.05)" : "scale(1)",
                }}
              ></div>
              <button className="relative rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 w-full sm:w-auto min-h-touch-target">
                Get Started
              </button>
            </motion.a>
            <motion.a
              href="/learn-more"
              className="relative group w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsLearnMoreHovered(true)}
              onMouseLeave={() => setIsLearnMoreHovered(false)}
            >
              <div
                className="absolute inset-0 bg-white/5 rounded-xl blur-md transition-all duration-300"
                style={{
                  opacity: isLearnMoreHovered ? 0.6 : 0.3,
                  transform: isLearnMoreHovered ? "scale(1.05)" : "scale(1)",
                }}
              ></div>
              <button className="relative rounded-xl bg-transparent backdrop-blur-sm border border-white/20 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-white/5 hover:shadow-white/10 hover:border-white/30 transition-all duration-300 w-full sm:w-auto min-h-touch-target">
                Learn More
              </button>
            </motion.a>
          </motion.div>
        </div>

        {/* Code Preview Panel on the right */}
        {!isMobile && (
          <motion.div 
            className="w-full md:w-1/2 flex justify-center items-center"
            variants={codePreviewVariants}
          >
            <div className="w-full max-w-xl transform hover:scale-[1.03] transition-transform duration-500">
              <CodePreviewPanel height={340} />
            </div>
          </motion.div>
        )}
        
        {/* Enhanced floating animation elements for visual appeal */}
        <div className="absolute top-1/4 left-2/3 w-40 h-40 opacity-20">
          <motion.div 
            className="w-full h-full rounded-full bg-purple-500/30 blur-3xl"
            animate={{ 
              x: [0, 20, 0], 
              y: [0, -20, 0],
              scale: [0.8, 1, 0.8]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8,
              ease: "easeInOut" 
            }}
          />
        </div>
        
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 opacity-20">
          <motion.div 
            className="w-full h-full rounded-full bg-blue-500/30 blur-3xl"
            animate={{ 
              x: [0, -15, 0], 
              y: [0, 15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6,
              ease: "easeInOut",
              delay: 1 
            }}
          />
        </div>
        
        {/* Additional decorative element */}
        <div className="absolute top-1/2 right-10 w-64 h-64 opacity-10">
          <motion.div 
            className="w-full h-full rounded-full bg-cyan-500/20 blur-3xl"
            animate={{ 
              x: [0, 10, 0], 
              y: [0, -10, 0],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10,
              ease: "easeInOut",
              delay: 2 
            }}
          />
        </div>
      </motion.div>

      {/* Bottom gradient overlay to enhance transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-[#09061A] to-transparent"></div>
    </section>
  )
}

