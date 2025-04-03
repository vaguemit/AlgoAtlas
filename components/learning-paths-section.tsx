"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Diamond, Gem, Award, Star, Zap, Clock, BookOpen, Code, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { pathColors, pathIcons } from "@/lib/types/learning-paths"
import { Loader2 } from "lucide-react"

export type LearningPathWithProgress = {
  id: string
  title: string
  description: string
  problemCount?: number
  estimatedHours?: number
  difficulty?: string
}

// Map from path title to icon component
const getIconComponent = (pathTitle: string) => {
  const iconName = pathIcons[pathTitle] || 'BookOpen';
  switch (iconName) {
    case 'Diamond': return <Diamond className="h-8 w-8 text-white" />;
    case 'Award': return <Award className="h-8 w-8 text-green-400" />;
    case 'Zap': return <Zap className="h-8 w-8 text-blue-400" />;
    case 'Star': return <Star className="h-8 w-8 text-purple-400" />;
    case 'Gem': return <Gem className="h-8 w-8 text-red-400" />;
    default: return <BookOpen className="h-8 w-8 text-white" />;
  }
}

// Map difficulty based on path title
const getDifficulty = (pathTitle: string): string => {
  if (pathTitle.includes('Diamond')) return 'Newbie';
  if (pathTitle.includes('Emerald')) return 'Beginner';
  if (pathTitle.includes('Sapphire')) return 'Intermediate';
  if (pathTitle.includes('Amethyst')) return 'Master';
  if (pathTitle.includes('Ruby')) return 'Advanced';
  return 'Beginner';
}

// Get color gradient from pathColors
const getColorGradient = (pathTitle: string): string => {
  if (pathTitle.includes('Diamond')) return 'from-slate-300 to-white';
  if (pathTitle.includes('Emerald')) return 'from-green-600 to-green-400';
  if (pathTitle.includes('Sapphire')) return 'from-blue-600 to-blue-400';
  if (pathTitle.includes('Amethyst')) return 'from-purple-600 to-purple-400';
  if (pathTitle.includes('Ruby')) return 'from-red-600 to-red-400';
  return 'from-gray-600 to-gray-400';
}

function PathCard({ path, index }: { path: LearningPathWithProgress; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const icon = getIconComponent(path.title)
  const difficulty = path.difficulty || getDifficulty(path.title)
  const colorGradient = getColorGradient(path.title)
  const isDiamond = path.title.includes('Diamond')

  return (
    <div
      className="block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative h-full"
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.1, 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        {/* Glow effect */}
        <div
          className={cn(
            `absolute inset-0 bg-gradient-to-r ${colorGradient} rounded-xl blur-md opacity-20 transition-opacity duration-300`,
            isHovered ? "opacity-40" : "opacity-20",
          )}
        ></div>

        {/* Card content */}
        <div className="relative bg-black/95 backdrop-blur-sm border border-purple-500/20 p-4 sm:p-6 rounded-xl shadow-lg shadow-black/50 h-full flex flex-col">
          {/* Difficulty badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colorGradient} ${isDiamond ? "text-gray-800" : "text-white"}`}
            >
              {difficulty}
            </span>
          </div>

          {/* Header with icon and title */}
          <div className="flex items-center mb-4">
            <div className="mr-4 p-2 rounded-lg bg-black/50 border border-purple-500/20">{icon}</div>
            <h3 className="text-xl font-bold text-white">{path.title}</h3>
          </div>

          {/* Description */}
          <p className="text-white/70 mb-6 flex-grow">{path.description}</p>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-blue-300/80">
              <Code className="h-4 w-4 mr-2" />
              <span className="text-sm">{path.problemCount || 0} Problems</span>
            </div>
            <div className="flex items-center text-blue-300/80">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">~{path.estimatedHours || 0} hours</span>
            </div>
          </div>

          {/* Action button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className={`w-full bg-gradient-to-r ${colorGradient} ${isDiamond ? "text-gray-800" : "text-white"} hover:shadow-md transition-all duration-300`}
            >
              <Link href={`/learning-paths/${path.id}`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export function LearningPathsSection() {
  const [paths, setPaths] = useState<LearningPathWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        // Use the original API endpoint to fetch from the database
        const response = await fetch("/api/learning-paths")
        if (!response.ok) {
          throw new Error("Failed to fetch learning paths")
        }
        const data = await response.json()
        
        // The API returns { paths: [...] }
        const pathsArray = data.paths || []

        // Filter out Introduction to Algorithms and Competitive Programming 101 if they exist
        const filteredPaths = pathsArray.filter((path: any) => 
          !path.title.includes("Introduction to Algorithms") && 
          !path.title.includes("Competitive Programming 101")
        )
        
        setPaths(filteredPaths)
      } catch (err) {
        setError("Failed to load learning paths. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLearningPaths()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <span className="ml-2 text-lg">Loading learning paths...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-900/20 border border-red-800 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!paths || paths.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-blue-900/20 border border-blue-800 text-center">
        <p className="text-blue-400">No learning paths available at this time.</p>
      </div>
    )
  }

  return (
    <section className="py-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Learning path cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {paths.map((path, index) => (
            <PathCard key={path.id} path={path} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

