"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CosmicBackground } from "./cosmic-background"
import { CodePreviewPanel } from "./code-preview-panel"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Code, Binary, Cpu, Database, Terminal } from "lucide-react"

export function HeroSection() {
  // Track hover states for enhanced effects
  const [isGetStartedHovered, setIsGetStartedHovered] = useState(false)
  const [isLearnMoreHovered, setIsLearnMoreHovered] = useState(false)
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  
  // Add new state for text animation
  const [textIndex, setTextIndex] = useState(0)
  const techWords = ["Algorithms", "Data Structures", "Problem Solving", "Competitive Coding"]

  useEffect(() => {
    // Small delay to start animations after component mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % techWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const floatingIconVariants = {
    initial: { y: 0, opacity: 0, scale: 0 },
    animate: { 
      y: [-20, 0, -20], 
      opacity: [0.5, 1, 0.5],
      scale: 1,
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="relative w-full min-h-[90svh] overflow-hidden">
      {/* Cosmic Background with enhanced opacity */}
      <div className="absolute inset-0 opacity-80">
        <CosmicBackground />
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[15%]"
          variants={floatingIconVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0 }}
        >
          <Code className="w-8 h-8 text-purple-400/60" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-[20%]"
          variants={floatingIconVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        >
          <Binary className="w-8 h-8 text-blue-400/60" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-[25%]"
          variants={floatingIconVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        >
          <Cpu className="w-8 h-8 text-cyan-400/60" />
        </motion.div>
        <motion.div
          className="absolute top-60 right-[30%]"
          variants={floatingIconVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1.5 }}
        >
          <Database className="w-8 h-8 text-purple-400/60" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-[15%]"
          variants={floatingIconVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
        >
          <Terminal className="w-8 h-8 text-blue-400/60" />
        </motion.div>
      </div>

      {/* Content container with improved spacing */}
      <motion.div 
        className="relative z-10 container mx-auto px-fluid-2 pt-24 sm:pt-32 pb-16 flex flex-col md:flex-row items-center justify-center min-h-[90svh] gap-8 lg:gap-16"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Text content on the left */}
        <div className="w-full md:w-1/2 mx-auto md:mx-0 flex flex-col justify-center">
          <motion.div className="mb-8 sm:mb-12" variants={itemVariants}>
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div
                className="relative cursor-pointer transition-transform duration-300 ease-out group"
                style={{ transform: isTitleHovered ? "scale(1.03)" : "scale(1)" }}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                {/* Main text */}
                <div className="relative text-center md:text-left">
                  <div className="text-fluid-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 animate-gradient drop-shadow-2xl">
                    Navigate Your
                  </div>
                  <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="relative mt-3 text-center md:text-left">
                  <div className="text-fluid-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 animate-gradient drop-shadow-2xl">
                    Competitive Programming
                  </div>
                  <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="relative mt-3 text-center md:text-left">
                  <div className="text-fluid-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 animate-gradient drop-shadow-2xl">
                    Journey
                  </div>
                  <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Animated tech words */}
                <div className="mt-6 h-8 relative overflow-hidden text-center md:text-left">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={textIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <span className="text-lg text-blue-300/80 font-medium">
                        Master {techWords[textIndex]}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Enhanced glow effect */}
                <div
                  className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl rounded-full -z-10 transition-all duration-500"
                  style={{ 
                    opacity: isTitleHovered ? 0.8 : 0.4,
                    transform: isTitleHovered ? "scale(1.1)" : "scale(1)" 
                  }}
                ></div>
              </div>

              {/* Enhanced decorative line with pulse effect */}
              <motion.div 
                className="relative h-1.5 w-24 sm:w-32 md:w-40 mt-8"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 rounded-full origin-left"
                  whileHover={{ width: "16rem", transition: { duration: 0.8 } }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 rounded-full origin-left"
                  animate={{
                    opacity: [1, 0.5, 1],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Code preview panel with enhanced styling */}
        {!isMobile && (
          <motion.div 
            className="w-full md:w-1/2 relative group"
            variants={codePreviewVariants}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CodePreviewPanel height={isTablet ? 400 : 500} />
            </div>
          </motion.div>
        )}
        
        {/* Enhanced floating animation elements */}
        <div className="absolute top-1/4 left-2/3 w-40 h-40 opacity-20">
          <motion.div 
            className="w-full h-full rounded-full bg-purple-500/30 blur-3xl"
            animate={{ 
              x: [0, 20, 0], 
              y: [0, -20, 0],
              scale: [0.8, 1, 0.8],
              opacity: [0.2, 0.3, 0.2]
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
              scale: [1, 0.9, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6,
              ease: "easeInOut",
              delay: 1 
            }}
          />
        </div>
        
        {/* Enhanced additional decorative element */}
        <div className="absolute top-1/2 right-10 w-64 h-64 opacity-10">
          <motion.div 
            className="w-full h-full rounded-full bg-cyan-500/20 blur-3xl"
            animate={{ 
              x: [0, 10, 0], 
              y: [0, -10, 0],
              scale: [0.9, 1.1, 0.9],
              opacity: [0.1, 0.2, 0.1]
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

      {/* Enhanced bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09061A] via-[#09061A]/80 to-transparent"></div>
    </section>
  )
}

