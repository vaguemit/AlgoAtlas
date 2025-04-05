"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronRight,
  Book,
  Target,
  ExternalLink,
  CircleDot,
  BookOpen,
  Code,
  CheckCircle2,
  FastForward,
  X,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type React from "react"
import { motion } from "framer-motion"

type Status = "not-started" | "reading" | "practicing" | "complete" | "skipped" | "ignored"

interface StatusConfig {
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const statusConfigs: Record<Status, StatusConfig> = {
  "not-started": {
    label: "Not Started",
    icon: <CircleDot className="h-4 w-4" />,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
  reading: {
    label: "Reading",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  practicing: {
    label: "Practicing",
    icon: <Code className="h-4 w-4" />,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  complete: {
    label: "Complete",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  skipped: {
    label: "Skipped",
    icon: <FastForward className="h-4 w-4" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  ignored: {
    label: "Ignored",
    icon: <X className="h-4 w-4" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
}

interface Subtopic {
  title: string
  description: string
  url: string
  progress: Status
}

interface Topic {
  title: string
  description: string
  url: string
  subtopics: Subtopic[]
}

interface DivisionDetailsProps {
  name: string
  color: string
  description: string
  topics: Topic[]
  progress: number
}

function StatusButton({ status, onClick }: { status: Status; onClick?: () => void }) {
  const config = statusConfigs[status]
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${config.color} ${config.bgColor} hover:${config.bgColor} flex items-center gap-2 min-w-[120px] justify-start`}
      onClick={onClick}
    >
      {config.icon}
      {config.label}
    </Button>
  )
}

function StatusDropdown({ status, onStatusChange }: { status: Status; onStatusChange: (status: Status) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <StatusButton status={status} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(statusConfigs).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onStatusChange(key as Status)}
            className={`flex items-center gap-2 ${config.color}`}
          >
            {config.icon}
            {config.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DivisionDetails({ name, color, description, topics, progress: initialProgress }: DivisionDetailsProps) {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})
  const [topicProgress, setTopicProgress] = useState<Record<string, Status>>({})
  const [subtopicProgress, setSubtopicProgress] = useState<Record<string, Status>>({})
  const [progress, setProgress] = useState(initialProgress)

  useEffect(() => {
    // Load progress from localStorage
    if (typeof window !== "undefined") {
      const savedTopicProgress = localStorage.getItem(`${name.toLowerCase()}-topic-progress`)
      const savedSubtopicProgress = localStorage.getItem(`${name.toLowerCase()}-subtopic-progress`)
      
      if (savedTopicProgress) {
        setTopicProgress(JSON.parse(savedTopicProgress))
      }
      
      if (savedSubtopicProgress) {
        setSubtopicProgress(JSON.parse(savedSubtopicProgress))
      }
    }
  }, [name])

  const calculateProgress = () => {
    let total = 0
    let completed = 0

    // Count topics
    topics.forEach(topic => {
      total++ // Count the topic itself
      if (topicProgress[topic.title] === "complete") {
        completed++
      }
      
      // Count subtopics
      topic.subtopics.forEach(subtopic => {
        total++
        if (subtopicProgress[subtopic.title] === "complete") {
          completed++
        }
      })
    })

    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const toggleTopic = (title: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const updateProgress = (itemTitle: string, isSubtopic: boolean, newStatus: Status) => {
    if (isSubtopic) {
      setSubtopicProgress((prev) => {
        const updated = { ...prev, [itemTitle]: newStatus }
        localStorage.setItem(`${name.toLowerCase()}-subtopic-progress`, JSON.stringify(updated))
        return updated
      })
    } else {
      setTopicProgress((prev) => {
        const updated = { ...prev, [itemTitle]: newStatus }
        localStorage.setItem(`${name.toLowerCase()}-topic-progress`, JSON.stringify(updated))
        return updated
      })
    }
    
    // Update overall progress
    setTimeout(() => {
      setProgress(calculateProgress())
    }, 0)
  }

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "not-started":
        return "⭕" // Empty circle
      case "reading":
        return "📖" // Book
      case "practicing":
        return "💻" // Laptop
      case "complete":
        return "✅" // Checkmark
      case "skipped":
        return "⏭️" // Skip forward
      case "ignored":
        return "❌" // Cross mark
      default:
        return "⭕"
    }
  }

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "not-started":
        return "text-gray-400"
      case "reading":
        return "text-blue-400"
      case "practicing":
        return "text-yellow-400"
      case "complete":
        return "text-green-400"
      case "skipped":
        return "text-orange-400"
      case "ignored":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
          {name} Path
        </h1>
        <p className="text-lg text-blue-100/80 max-w-3xl mx-auto">{description}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden"
          >
            {/* Topic header */}
            <button
              onClick={() => toggleTopic(topic.title)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <StatusDropdown
                  status={topicProgress[topic.title] || "not-started"}
                  onStatusChange={(status) => updateProgress(topic.title, false, status)}
                />
                <div>
                  <h3 className="text-xl font-semibold text-white text-left">{topic.title}</h3>
                  <p className="text-white/60 text-sm mt-1 text-left">{topic.description}</p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-white/60 transition-transform duration-300 ${
                  expandedTopics[topic.title] ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Subtopics */}
            {expandedTopics[topic.title] && topic.subtopics && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-t border-purple-500/20"
              >
                <div className="px-6 py-4 space-y-4">
                  {topic.subtopics.map((subtopic) => (
                    <div key={subtopic.title} className="group">
                      <div className="flex items-center space-x-4 hover:bg-white/5 p-4 rounded-lg transition-colors">
                        <div className="flex-grow">
                          <Link
                            href={subtopic.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <h4 className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors">
                              {subtopic.title}
                            </h4>
                            <p className="text-white/60 text-sm mt-1">{subtopic.description}</p>
                          </Link>
                        </div>
                        <StatusDropdown
                          status={subtopicProgress[subtopic.title] || subtopic.progress}
                          onStatusChange={(status) => updateProgress(subtopic.title, true, status)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
} 