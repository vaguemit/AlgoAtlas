"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Diamond, Gem, Award, Star, Zap, Clock, BookOpen, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Define the learning path data structure
interface LearningPath {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  problemCount: number
  estimatedHours: number
  progress?: number
  color: string
  difficulty: string
}

// Learning paths data
const learningPaths: LearningPath[] = [
  {
    id: "diamond",
    title: "Diamond Path",
    icon: <Diamond className="h-8 w-8 text-white" />,
    description: "Getting started with competitive programming for beginners. Learn the basics to launch your CP journey.",
    problemCount: 75,
    estimatedHours: 60,
    progress: 0,
    color: "from-slate-300 to-white",
    difficulty: "Newbie",
  },
  {
    id: "emerald",
    title: "Emerald Path",
    icon: <Award className="h-8 w-8 text-green-400" />,
    description: "Introduction to competitive programming. Learn basic algorithms, sorting, searching, and fundamental data structures.",
    problemCount: 20,
    estimatedHours: 15,
    progress: 0,
    color: "from-green-600 to-green-400",
    difficulty: "Beginner",
  },
  {
    id: "sapphire",
    title: "Sapphire Path",
    icon: <Zap className="h-8 w-8 text-blue-400" />,
    description: "Intermediate problem-solving skills. Focus on greedy algorithms, basic graph theory, and string manipulation.",
    problemCount: 35,
    estimatedHours: 25,
    progress: 0,
    color: "from-blue-600 to-blue-400",
    difficulty: "Intermediate",
  },
  {
    id: "amethyst",
    title: "Amethyst Path",
    icon: <Star className="h-8 w-8 text-purple-400" />,
    description: "Advanced competitive programming. Master segment trees, advanced graph algorithms, and complex dynamic programming.",
    problemCount: 90,
    estimatedHours: 80,
    progress: 0,
    color: "from-purple-600 to-purple-400",
    difficulty: "Master",
  },
  {
    id: "ruby",
    title: "Ruby Path",
    icon: <Gem className="h-8 w-8 text-red-400" />,
    description: "Expert-level algorithms and techniques. Advanced data structures, network flow, and advanced dynamic programming patterns.",
    problemCount: 50,
    estimatedHours: 40,
    progress: 0,
    color: "from-red-600 to-red-400",
    difficulty: "Advanced",
  },
]

function PathCard({ path }: { path: LearningPath }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/learning-paths/${path.id}`}>
      <motion.div
        className="relative h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow effect */}
        <div
          className={cn(
            `absolute inset-0 bg-gradient-to-r ${path.color} rounded-xl blur-md opacity-20 transition-opacity duration-300`,
            isHovered ? "opacity-40" : "opacity-20",
          )}
        ></div>

        {/* Card content */}
        <div className="relative bg-black/95 backdrop-blur-sm border border-purple-500/20 p-4 sm:p-6 rounded-xl shadow-lg shadow-black/50 h-full flex flex-col">
          {/* Difficulty badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${path.color} ${path.id === "diamond" ? "text-gray-800" : "text-white"}`}
            >
              {path.difficulty}
            </span>
          </div>

          {/* Header with icon and title */}
          <div className="flex items-center mb-4">
            <div className="mr-4 p-2 rounded-lg bg-black/50 border border-purple-500/20">{path.icon}</div>
            <h3 className="text-xl font-bold text-white">{path.title}</h3>
          </div>

          {/* Description */}
          <p className="text-white/70 mb-6 flex-grow">{path.description}</p>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-blue-300/80">
              <Code className="h-4 w-4 mr-2" />
              <span className="text-sm">{path.problemCount} Problems</span>
            </div>
            <div className="flex items-center text-blue-300/80">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">~{path.estimatedHours} hours</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>Progress</span>
              <span>{path.progress || 0}%</span>
            </div>
            <div className="h-2 bg-navy-800/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${path.color}`}
                style={{ width: `${path.progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Action button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className={`w-full bg-gradient-to-r ${path.color} ${path.id === "diamond" ? "text-gray-800" : "text-white"} hover:shadow-md hover:shadow-${path.color.split(" ")[0].replace("from-", "")}/30 transition-all duration-300`}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Start Path
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}

export function LearningPathsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Learning path cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {learningPaths.map((path) => (
            <PathCard key={path.id} path={path} />
          ))}
        </div>
      </div>
    </section>
  )
}

