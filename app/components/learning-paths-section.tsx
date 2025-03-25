"use client"
import Link from "next/link"
import { motion } from "framer-motion"

const learningPaths = [
  {
    id: "emerald",
    title: "Emerald",
    description: "Introduction to competitive programming with fundamental algorithms and data structures.",
    color: "bg-green-500",
  },
  {
    id: "sapphire",
    title: "Sapphire",
    description: "Intermediate algorithms and data structures for competitive programming.",
    color: "bg-blue-500",
  },
  {
    id: "ruby",
    title: "Ruby",
    description: "Advanced algorithms and techniques for competitive programming.",
    color: "bg-red-500",
  },
  {
    id: "amethyst",
    title: "Amethyst",
    description: "Expert-level algorithms and techniques for competitive programming masters.",
    color: "bg-purple-500",
  },
  {
    id: "diamond",
    title: "Diamond",
    description: "Mastery of competitive programming concepts and advanced problem-solving.",
    color: "bg-cyan-500",
  },
]

function PathCard({ id, title, description, color }: {
  id: string
  title: string
  description: string
  color: string
}) {
  return (
    <Link href={`/learning-paths/${id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${color} rounded-lg p-6 shadow-lg cursor-pointer transition-colors duration-200 h-full`}
      >
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90">{description}</p>
      </motion.div>
    </Link>
  )
}

export function LearningPathsSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <PathCard key={path.id} {...path} />
        ))}
      </div>
    </div>
  )
} 