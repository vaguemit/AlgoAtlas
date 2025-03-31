"use client"
import Link from "next/link"
import { motion } from "framer-motion"

const learningPaths = [
  {
    id: "655208fa-4820-46bc-86d0-5b46251fff7f",
    title: "Diamond",
    description: "Introduction to competitive programming with fundamental algorithms and data structures.",
    color: "bg-cyan-500",
  },
  {
    id: "5bce5182-6f1a-4007-aa34-d4da63dc3292",
    title: "Emerald",
    description: "Introduction to competitive programming with fundamental algorithms and data structures.",
    color: "bg-green-500",
  },
  {
    id: "4207f386-8b27-4b68-ba2b-e17508634848",
    title: "Sapphire",
    description: "Intermediate algorithms and data structures for competitive programming.",
    color: "bg-blue-500",
  },
  {
    id: "cc1d892d-a288-4872-9af5-94ff2fadb230",
    title: "Ruby",
    description: "Advanced algorithms and techniques for competitive programming.",
    color: "bg-red-500",
  },
  {
    id: "9aef1d0a-99b8-41b9-ac48-403122605e44",
    title: "Amethyst",
    description: "Expert-level algorithms and techniques for competitive programming masters.",
    color: "bg-purple-500",
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