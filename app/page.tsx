"use client"

import { HeroSection } from "@/components/hero-section"
import { SignupHeroSection } from "@/components/signup-hero-section"
import { PartnerLogosSection } from "@/components/partner-logos-section"
import { CodePreviewPanel } from "@/components/code-preview-panel"
import { CursorFollowingCharacter } from "@/components/cursor-following-character"
import { useDeviceType } from "@/hooks/use-device-type"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"

export default function Home() {
  const deviceType = useDeviceType()
  const { isDesktop } = deviceType
  const { isMobile } = deviceType
  const [isLoaded, setIsLoaded] = useState(false)
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

      {/* Featured Algorithms Section */}
      <motion.div 
        ref={featureSectionRef}
        className="container mx-auto px-4 py-8 sm:py-12 relative z-10 bg-gradient-to-b from-[#1F0E3E]/90 to-[#150C30]/90 backdrop-blur-sm rounded-lg border border-[#3A1E70]/30 my-3 sm:my-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{ 
          opacity: featureSectionOpacity,
          scale: featureSectionScale
        }}
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 -z-10 overflow-hidden rounded-lg"
          style={{ y: parallaxY1 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
        </motion.div>
        
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 bg-[#3A1E70]/15 rounded-full blur-xl"
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

        <motion.h2 
          className="text-3xl font-bold text-center mb-5 sm:mb-7 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
          variants={itemVariants}
        >
          Featured Algorithms
        </motion.h2>

        {/* Code Preview Panel */}
        {isLoaded && !isMobile && (
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <CodePreviewPanel />
          </motion.div>
        )}

        {/* Interactive Character */}
        {isDesktop && isLoaded && (
          <motion.div 
            className="mt-6 mb-8 flex justify-center flex-col items-center"
            variants={itemVariants}
          >
            <div className="w-full max-w-2xl">
              <CursorFollowingCharacter />
            </div>
            <div className="mt-4 text-center">
              <a 
                href="/cat-demo" 
                className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                Click to interact with Whisker in fullscreen mode! 🐱
              </a>
            </div>
          </motion.div>
        )}

        {/* Feature cards with enhanced animations */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6 sm:mt-8 px-1 sm:px-0"
          variants={containerVariants}
        >
          {[
            {
              title: "Learn Algorithms",
              description: "Master the fundamentals of algorithms and data structures with our comprehensive tutorials.",
              glowColor: "from-[#3A1E70] to-[#2A1845]"
            },
            {
              title: "Solve Problems",
              description: "Challenge yourself with our curated collection of coding problems across various difficulty levels.",
              glowColor: "from-[#4A2085] to-[#2A1845]"
            },
            {
              title: "Join Contests",
              description: "Compete with others in our regular coding contests and improve your problem-solving skills.",
              glowColor: "from-[#2A1845] to-[#1A0D35]"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 20 
              }}
            >
              <FeatureCard 
                title={feature.title} 
                description={feature.description} 
                glowColor={feature.glowColor} 
                isActive={activeFeature === index}
              />
            </motion.div>
          ))}
        </motion.div>
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

      {/* Signup Hero Section */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <SignupHeroSection />
        </motion.div>
      )}
    </main>
  )
}

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
        className={`absolute inset-0 bg-gradient-to-r ${glowColor} rounded-lg blur-md opacity-10 group-hover:opacity-20 transition-opacity duration-300 group-hover:scale-105`}
        animate={isActive ? {
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.05, 1],
        } : {}}
        transition={isActive ? {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        } : {}}
      />
      <motion.div 
        className="relative bg-[#150C30]/90 backdrop-blur-sm border border-[#3A1E70]/30 p-5 rounded-lg hover:border-[#3A1E70]/60 transition-all duration-300 h-full shadow-lg shadow-black/30"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#9A70E8] to-[#8265DC]"
          initial={{ opacity: 0.9 }}
          whileHover={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h2>
        <p className="text-white/70">{description}</p>
        
        <motion.div
          className="mt-4 flex justify-end"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-2 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9A70E8]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

