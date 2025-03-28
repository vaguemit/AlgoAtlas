"use client"

import { HeroSection } from "@/components/hero-section"
import { SignupHeroSection } from "@/components/signup-hero-section"
import { PartnerLogosSection } from "@/components/partner-logos-section"
import { CodePreviewPanel } from "@/components/code-preview-panel"
import { CursorFollowingCharacter } from "@/components/cursor-following-character"
import { useDeviceType } from "@/hooks/use-device-type"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Home() {
  const deviceType = useDeviceType()
  const { isDesktop } = deviceType
  const { isMobile } = deviceType
  const [isLoaded, setIsLoaded] = useState(false)

  // Mark component as loaded after mount
  useEffect(() => {
    // Use a short timeout to ensure the browser has time to paint
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <main className="relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Algorithms Section */}
      <motion.div 
        className="container mx-auto px-4 py-8 sm:py-12 relative z-10 bg-gradient-to-b from-[#2E0854]/30 to-[#4B0082]/30 backdrop-blur-sm rounded-lg border border-purple-500/10 my-3 sm:my-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl font-bold text-center mb-5 sm:mb-7 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
          variants={itemVariants}
        >
          Featured Algorithms
        </motion.h2>

        {/* Code Preview Panel */}
        {isLoaded && !isMobile && (
          <motion.div variants={itemVariants}>
            <CodePreviewPanel />
          </motion.div>
        )}

        {/* Interactive Character */}
        {isDesktop && isLoaded && (
          <motion.div 
            className="mt-6 mb-8 flex justify-center"
            variants={itemVariants}
          >
            <div className="w-full max-w-2xl">
              <CursorFollowingCharacter />
            </div>
          </motion.div>
        )}

        {/* Feature cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6 sm:mt-8 px-1 sm:px-0"
          variants={containerVariants}
        >
          <FeatureCard
            title="Learn Algorithms"
            description="Master the fundamentals of algorithms and data structures with our comprehensive tutorials."
            glowColor="from-purple-600 to-blue-600"
          />
          <FeatureCard
            title="Solve Problems"
            description="Challenge yourself with our curated collection of coding problems across various difficulty levels."
            glowColor="from-pink-600 to-purple-600"
          />
          <FeatureCard
            title="Join Contests"
            description="Compete with others in our regular coding contests and improve your problem-solving skills."
            glowColor="from-yellow-600/70 to-pink-600/70"
          />
        </motion.div>
      </motion.div>

      {/* Partner Logos Section */}
      {isLoaded && <PartnerLogosSection />}

      {/* Signup Hero Section */}
      {isLoaded && <SignupHeroSection />}
    </main>
  )
}

function FeatureCard({ title, description, glowColor }: { title: string; description: string; glowColor: string }) {
  return (
    <motion.div 
      className="relative group" 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6 }
        }
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${glowColor} rounded-lg blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300 group-hover:scale-105`}
      ></div>
      <div className="relative bg-black/95 backdrop-blur-sm border border-purple-500/20 p-5 rounded-lg hover:border-purple-500/40 transition-all duration-300 h-full shadow-lg shadow-black/50">
        <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          {title}
        </h2>
        <p className="text-white/70">{description}</p>
      </div>
    </motion.div>
  )
}

