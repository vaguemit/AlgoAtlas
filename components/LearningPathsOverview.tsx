"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Book, Target } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Division {
  name: string
  color: string
  description: string
  topics: number
  progress: number
}

const divisions: Division[] = [
  {
    name: "Emerald",
    color: "bg-emerald-500",
    description: "Start here if you're new to competitive programming.",
    topics: 22,
    progress: 0,
  },
  {
    name: "Sapphire",
    color: "bg-blue-500",
    description: "Dive deeper into advanced algorithms and data structures",
    topics: 4,
    progress: 0,
  },
  {
    name: "Ruby",
    color: "bg-red-500",
    description: "Master complex algorithms and optimization techniques",
    topics: 7,
    progress: 0,
  },
  {
    name: "Diamond",
    color: "bg-purple-500",
    description: "Tackle the most challenging competitive programming problems",
    topics: 4,
    progress: 0,
  },
  {
    name: "Advanced",
    color: "bg-red-700",
    description: "Master the most advanced competitive programming techniques and algorithms",
    topics: 9,
    progress: 0,
  },
]

export function LearningPathsOverview() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">The Coding Arena Guide</h1>
        <p className="text-xl text-muted-foreground">
          A free collection of curated, high-quality resources to take you from Emerald to Advanced and beyond.
        </p>
        <Button size="lg" className="mt-4">
          Get Started
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {divisions.map((division, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${division.color}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{division.name}</CardTitle>
                  <Badge className={division.color}>{division.name} Division</Badge>
                </div>
                <CardDescription>{division.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{division.progress}%</span>
                    </div>
                    <Progress value={division.progress} />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Book className="h-4 w-4 mr-1" />
                        <span className="text-sm">{division.topics} Topics</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        <span className="text-sm">Multiple Projects</span>
                      </div>
                    </div>
                    <Link href={`/learning-paths/${division.name.toLowerCase()}`}>
                      <motion.button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

