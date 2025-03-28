"use client"
import { LearningPathsSection } from "@/components/learning-paths-section"

export default function LearningPathsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center px-6 pt-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Learning Paths
        </h1>
        <div className="h-px w-64 mx-auto mb-6 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Structured learning tracks designed to help you master competitive programming.
          Choose a path that matches your skill level.
        </p>
      </div>
      
      <LearningPathsSection />
    </div>
  )
}

