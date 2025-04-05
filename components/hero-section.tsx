"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CosmicBackground } from "./cosmic-background"
import { CodePreviewPanel } from "./code-preview-panel"
import { CursorFollowingCharacter } from "./cursor-following-character"
import { PartnerLogosSection } from "./partner-logos-section"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Code, Binary, Cpu, Database, Terminal } from "lucide-react"
import { CodeBracketIcon, ChartBarIcon, AcademicCapIcon, ComputerDesktopIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export function HeroSection() {
  const [isGetStartedHovered, setIsGetStartedHovered] = useState(false)
  const [isLearnMoreHovered, setIsLearnMoreHovered] = useState(false)
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1025px)")
  const router = useRouter()
  const { user } = useAuth()
  
  const [textIndex, setTextIndex] = useState(0)
  const techWords = ["Algorithms", "Data Structures", "Problem Solving", "Competitive Coding"]

  const handleRegisterClick = () => {
    router.push("/register")
  }

  useEffect(() => {
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
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0A0B1E]">
      {/* Cosmic Background with standardized opacity */}
      <div className="absolute inset-0 opacity-95">
        <CosmicBackground />
      </div>

      {/* Additional gradient overlay for smoother transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B1E] via-[#0F0B2B] to-[#1A0B38] opacity-50"></div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto">
        {/* Hero Content */}
        <motion.div 
          className="px-fluid-2 pt-16 sm:pt-20 pb-8 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Text content */}
          <div className="w-full md:w-1/2 mx-auto md:mx-0 flex flex-col justify-center">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col items-center md:items-start space-y-3">
                <div className="relative text-center md:text-left">
                  <div className="relative">
                    <div className="text-fluid-5xl font-bold tracking-tight text-purple/90">
                      Navigate
                    </div>
                  </div>
                  
                  <div className="relative mt-2">
                    <div className="text-fluid-5xl font-bold tracking-tight text-white/90">
                       Your Competitive Programming
                    </div>
                  </div>
                  
                  <div className="relative mt-2">
                    <div className="text-fluid-5xl font-bold tracking-tight text-white/90">
                      Journey
                    </div>
                  </div>

                  {/* Register Now Button */}
                  {!user && (
                    <motion.div 
                      className="mt-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Button
                        className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-6 text-lg font-semibold text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300"
                        onClick={handleRegisterClick}
                      >
                        Register Now
                      </Button>
                    </motion.div>
                  )}

                  {/* Animated tech words */}
                  <div className="mt-6 h-8 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={textIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <span className="text-lg text-[#8B5CF6]/90 font-medium">
                          Master {techWords[textIndex]}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code preview panel - desktop only */}
          {!isMobile && (
            <motion.div 
              className="w-full md:w-1/2 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CodePreviewPanel height={isTablet ? 300 : 350} />
            </motion.div>
          )}
        </motion.div>

        {/* Partner Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="py-12"
        >
          <PartnerLogosSection />
        </motion.div>

        {/* Feature Cards Section */}
        <div className="py-12">
          {/* First row of feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 px-4 max-w-7xl mx-auto">
            <motion.div 
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-purple-400 mb-3">
                <CodeBracketIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Problem Solving Gym</h3>
              <p className="text-gray-300">
                Level up your skills with our adaptive problem-solving gym. Get personalized problem sets and track your progress through difficulty levels.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-purple-400 mb-3">
                <ChartBarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Contest Tracker</h3>
              <p className="text-gray-300">
                Stay updated with upcoming coding contests across platforms. Never miss a competition and track your contest history.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-purple-400 mb-3">
                <AcademicCapIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Learning Paths</h3>
              <p className="text-gray-300">
                Follow structured learning paths to master algorithms and data structures. From basics to advanced topics, we've got you covered.
              </p>
            </motion.div>
          </div>

          {/* Interactive Character Section */}
          {isDesktop && (
            <div className="flex justify-center flex-col items-center mb-24">
              <div className="w-full max-w-lg flex flex-col items-center">
                <CursorFollowingCharacter />
                <div className="text-center -mt-24 max-w-2xl relative z-10">
                  <motion.h2 
                    className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Improve Rapidly
                  </motion.h2>
                  <motion.p 
                    className="mt-4 text-gray-300 text-xl max-w-xl mx-auto leading-relaxed tracking-wide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    With Whiskers embedded throughout the platform, you can simplify your concepts and level up your skills while having a great experience.
                  </motion.p>
                </div>
              </div>
            </div>
          )}

          {/* Second row of feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 max-w-7xl mx-auto">
            <motion.div 
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-purple-400 mb-3">
                <ComputerDesktopIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Online Compilers</h3>
              <p className="text-gray-300">
                Write and test your code directly in the browser with our integrated development environment.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-purple-400 mb-3">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI Assistant</h3>
              <p className="text-gray-300">
                Get instant help with coding problems and concepts from our intelligent AI assistant.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#2A1151] via-[#1A0B38] to-transparent"></div>
    </section>
  )
}

