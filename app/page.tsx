"use client"

import { HeroSection } from "@/components/hero-section"
import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(true)
  
  // Scroll progress indicator
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const scaleX = useSpring(pageScrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Mark component as loaded after mount
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="relative">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2A1845] via-[#3A1E70] to-[#4A2085] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <HeroSection />
      </motion.div>
    </main>
  )
}

