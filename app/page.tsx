"use client"

import { HeroSection } from "@/components/hero-section"
import { SignupHeroSection } from "@/components/signup-hero-section"
import { PartnerLogosSection } from "@/components/partner-logos-section"
import { CodePreviewPanel } from "@/components/code-preview-panel"
import { CursorFollowingCharacter } from "@/components/cursor-following-character"
import { useDeviceType } from "@/hooks/use-device-type"
import { useEffect, useState } from "react"

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

  return (
    <main className="relative">
      {/* No Suspense wrapper - render HeroSection directly */}
      <HeroSection />

      <div className="container mx-auto px-4 py-20 relative z-10 bg-gradient-to-b from-[#2E0854]/30 to-[#4B0082]/30 backdrop-blur-sm rounded-lg border border-purple-500/10 my-8">
        <h2 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Featured Algorithms
        </h2>

        {/* Only render CodePreviewPanel on non-mobile devices */}
        {isLoaded && !isMobile && <CodePreviewPanel />}

        {/* Interactive Character Section - Only visible on desktop */}
        {isDesktop && isLoaded && (
          <div className="mt-20 mb-16 flex justify-center">
            <div className="w-full max-w-2xl">
              <CursorFollowingCharacter />
            </div>
          </div>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-20 px-4 sm:px-0">
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
        </div>
      </div>

      {/* Partner Logos Section */}
      {isLoaded && <PartnerLogosSection />}

      {/* Signup Hero Section */}
      {isLoaded && <SignupHeroSection />}
    </main>
  )
}

function FeatureCard({ title, description, glowColor }: { title: string; description: string; glowColor: string }) {
  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${glowColor} rounded-lg blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
      ></div>
      <div className="relative bg-black/95 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg hover:border-purple-500/30 transition-all duration-300 h-full shadow-lg shadow-black/50">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          {title}
        </h2>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  )
}

