"use client"
import { LearningPathsSection } from "@/components/learning-paths-section"

export default function LearningPathsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Learning Paths
        </h1>
        <p className="text-lg text-white/80">
          Structured learning tracks to help you master competitive programming at your own pace. Choose a path that
          matches your skill level and start your journey to becoming a better programmer.
        </p>
      </div>

      <LearningPathsSection />
    </div>
  )
}

