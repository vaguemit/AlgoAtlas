"use client"

import { HeroSection } from "@/components/hero-section"
import { SignupHeroSection } from "@/components/signup-hero-section"
import { PartnerLogosSection } from "@/components/partner-logos-section"
import { CodePreviewPanel } from "@/components/code-preview-panel"
import { CursorFollowingCharacter } from "@/components/cursor-following-character"
import { useDeviceType } from "@/hooks/use-device-type"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { CodeBracketIcon, ChartBarIcon, AcademicCapIcon, ComputerDesktopIcon, SparklesIcon } from "@heroicons/react/24/outline"

function FeatureCard({ title, description, glowColor, isActive = false }: { title: string; description: string; glowColor: string; isActive?: boolean }) {
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
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${glowColor} rounded-lg blur-md opacity-5 group-hover:opacity-15 transition-opacity duration-300 group-hover:scale-105`}
        animate={isActive ? {
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.05, 1],
        } : {}}
        transition={isActive ? {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        } : {}}
      />
      <motion.div 
        className="relative bg-transparent backdrop-blur-sm border border-[#3A1E70]/20 p-4 rounded-lg hover:border-[#3A1E70]/40 transition-all duration-300 h-full shadow-sm shadow-black/10"
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.h2 
          className="text-lg font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9A70E8] to-[#8265DC]"
          initial={{ opacity: 0.9 }}
          whileHover={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h2>
        <p className="text-white/60 text-sm">{description}</p>
        
        <motion.div
          className="mt-2 flex justify-end"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-1 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9A70E8]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const deviceType = useDeviceType()
  const { isDesktop } = deviceType
  const { isMobile } = deviceType
  const [isLoaded, setIsLoaded] = useState(true)
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const featureSectionRef = useRef<HTMLDivElement>(null);
  
  // Use scroll animations
  const { scrollYProgress } = useScroll({
    target: featureSectionRef,
    offset: ["start end", "end start"]
  });
  
  const scrollSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const featureSectionOpacity = useTransform(scrollSpring, [0, 0.2], [0.6, 1]);
  const featureSectionScale = useTransform(scrollSpring, [0, 0.2], [0.95, 1]);
  
  // Parallax effect for background
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Add a scroll progress indicator
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
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2A1845] via-[#3A1E70] to-[#4A2085] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence>
          {isLoaded && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -100, y: -100 }}
                animate={{ opacity: 0.12, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-20 left-10 w-64 h-64 bg-[#3A1E70] rounded-full blur-[120px]"
              />
              <motion.div
                initial={{ opacity: 0, x: 100, y: 100 }}
                animate={{ opacity: 0.12, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="absolute bottom-32 right-10 w-56 h-56 bg-[#2A1845] rounded-full blur-[100px]"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.05, 0.1, 0.05],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="absolute top-1/3 right-1/4 w-32 h-32 bg-[#4A2085] rounded-full blur-[80px]"
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <HeroSection />
      </motion.div>

      {/* Partner Logos Section */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <PartnerLogosSection />
        </motion.div>
      )}

      {/* Featured Algorithms Section */}
      <motion.div 
        ref={featureSectionRef}
        className="container mx-auto px-4 py-6 sm:py-8 relative z-10 bg-transparent backdrop-blur-sm rounded-lg border border-[#3A1E70]/20 my-3 sm:my-5"
        initial={{ opacity: 0.6, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          opacity: featureSectionOpacity,
          scale: featureSectionScale
        }}
      >
        {/* Animated background elements - made fully transparent */}
        <motion.div 
          className="absolute inset-0 -z-10 overflow-hidden rounded-lg"
          style={{ y: parallaxY1 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-transparent opacity-5"></div>
        </motion.div>
        
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 bg-transparent rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.2, 0.15] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 px-4 max-w-7xl mx-auto">
          <div 
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="text-purple-400 mb-3">
              <CodeBracketIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Problem Solving Gym</h3>
            <p className="text-gray-300">
              Level up your skills with our adaptive problem-solving gym. Get personalized problem sets and track your progress through difficulty levels.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="text-purple-400 mb-3">
              <ChartBarIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Contest Tracker</h3>
            <p className="text-gray-300">
              Stay updated with upcoming coding contests across platforms. Never miss a competition and track your contest history.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="text-purple-400 mb-3">
              <AcademicCapIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Learning Paths</h3>
            <p className="text-gray-300">
              Follow structured learning paths to master algorithms and data structures. From basics to advanced topics, we've got you covered.
            </p>
          </div>
        </div>

        {/* Interactive Character */}
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

        {/* Feature cards - second section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 max-w-7xl mx-auto">
          <div 
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="text-purple-400 mb-3">
              <ComputerDesktopIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Online Compilers</h3>
            <p className="text-gray-300">
              Write and test your code directly in the browser with our integrated development environment.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="text-purple-400 mb-3">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">AI Assistant</h3>
            <p className="text-gray-300">
              Get instant help with coding problems and concepts from our intelligent AI assistant.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Signup Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <SignupHeroSection />
      </motion.div>
    </main>
  )
}

