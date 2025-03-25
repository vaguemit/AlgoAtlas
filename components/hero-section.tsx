"use client"

import { useState } from "react"
import { CosmicBackground } from "./cosmic-background"

export function HeroSection() {
  // Track hover states for enhanced effects
  const [isGetStartedHovered, setIsGetStartedHovered] = useState(false)
  const [isLearnMoreHovered, setIsLearnMoreHovered] = useState(false)
  const [isTitleHovered, setIsTitleHovered] = useState(false)

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden">
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-fluid-2 pt-24 sm:pt-32 pb-20 flex flex-col items-center justify-center min-h-[100svh]">
        {/* Static content with hover effects */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col items-center">
            <div
              className="relative mb-6 cursor-pointer transition-transform duration-300 ease-out"
              style={{ transform: isTitleHovered ? "scale(1.03)" : "scale(1)" }}
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              <div className="text-fluid-6xl font-bold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 animate-gradient">
                AlgoAtlas
              </div>
              <div
                className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl rounded-full -z-10 transition-opacity duration-300"
                style={{ opacity: isTitleHovered ? 0.9 : 0.6 }}
              ></div>
            </div>
            <div className="text-fluid-xl md:text-fluid-2xl text-blue-200 font-light tracking-wide text-center hover:text-blue-100 transition-colors duration-300">
              Master Algorithms & Data Structures
            </div>
            <div className="h-1 w-24 sm:w-32 md:w-40 mx-auto mt-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full origin-center hover:w-48 transition-all duration-500 ease-in-out"></div>
          </div>
        </div>

        {/* Headline with subtle hover effect */}
        <h2 className="text-fluid-3xl md:text-fluid-4xl font-bold text-center tracking-tight text-white max-w-3xl mx-auto hover:text-purple-100 transition-colors duration-300">
          Work together, achieve more
        </h2>

        {/* Subheading */}
        <p className="mt-6 text-fluid-base md:text-fluid-lg text-center text-blue-100/90 max-w-3xl mx-auto px-fluid-2 hover:text-blue-100 transition-colors duration-300">
          Collaborate with your teams, use management tools that sync with your projects, and code from anywhere—all on
          a single, integrated platform.
        </p>

        {/* CTA Buttons with enhanced hover effects */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full px-fluid-2 sm:px-0">
          <a
            href="/get-started"
            className="relative group w-full sm:w-auto transition-transform duration-300 ease-out transform hover:scale-105 active:scale-95"
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
          </a>
          <a
            href="/learn-more"
            className="relative group w-full sm:w-auto transition-transform duration-300 ease-out transform hover:scale-105 active:scale-95"
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
          </a>
        </div>
      </div>

      {/* Bottom gradient overlay to enhance transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#4B0082]/90 to-transparent"></div>
    </section>
  )
}

