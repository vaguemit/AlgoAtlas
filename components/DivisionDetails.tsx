"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronDown, CircleDot, BookOpen, Code, CheckCircle2, FastForward, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

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
  progress?: Status
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
  onProgressUpdate?: (topicId: string, subtopicId: string | null, status: Status) => void
}

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfigs[status]
  return (
    <Badge variant="outline" className={`${config.color} border-none ${config.bgColor} ml-2`}>
      {config.icon}
      <span className="ml-1 text-xs">{config.label}</span>
    </Badge>
  )
}

function StatusButton({ status, onClick }: { status: Status; onClick?: () => void }) {
  const config = statusConfigs[status]
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${config.color} ${config.bgColor} hover:${config.bgColor} flex items-center gap-2 justify-start absolute right-2 top-1/2 transform -translate-y-1/2 z-10`}
      onClick={onClick}
    >
      {config.icon}
      <span className="text-xs">{config.label}</span>
    </Button>
  )
}

function StatusDropdown({ status, onStatusChange }: { status: Status; onStatusChange: (status: Status) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
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

export function DivisionDetails({ 
  name, 
  color, 
  description, 
  topics,
  onProgressUpdate 
}: DivisionDetailsProps) {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})
  const [topicProgress, setTopicProgress] = useState<Record<string, Status>>({})
  const [subtopicProgress, setSubtopicProgress] = useState<Record<string, Status>>({})

  useEffect(() => {
    // Load progress from localStorage only if onProgressUpdate is not provided
    if (typeof window !== "undefined" && !onProgressUpdate) {
      const savedTopicProgress = localStorage.getItem(`${name.toLowerCase()}-topic-progress`)
      const savedSubtopicProgress = localStorage.getItem(`${name.toLowerCase()}-subtopic-progress`)
      
      if (savedTopicProgress) {
        setTopicProgress(JSON.parse(savedTopicProgress))
      }
      
      if (savedSubtopicProgress) {
        setSubtopicProgress(JSON.parse(savedSubtopicProgress))
      }
    }
  }, [name, onProgressUpdate])

  // Update topic status based on subtopics
  const updateTopicStatus = useCallback(() => {
    const newTopicProgress = { ...topicProgress };
    let hasChanges = false;

    topics.forEach(topic => {
      // Check if all subtopics are completed
      const allCompleted = topic.subtopics.length > 0 && topic.subtopics.every(
        subtopic => subtopicProgress[subtopic.title] === "complete"
      );
      
      if (allCompleted && newTopicProgress[topic.title] !== "complete") {
        newTopicProgress[topic.title] = "complete";
        hasChanges = true;
      } else if (!allCompleted && newTopicProgress[topic.title] === "complete") {
        // If topic was marked complete but not all subtopics are complete anymore
        delete newTopicProgress[topic.title];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setTopicProgress(newTopicProgress);
      if (typeof window !== "undefined") {
        localStorage.setItem(`${name.toLowerCase()}-topic-progress`, JSON.stringify(newTopicProgress));
      }
    }
  }, [subtopicProgress, topicProgress, topics, name]);

  useEffect(() => {
    updateTopicStatus();
  }, [updateTopicStatus]);

  const toggleTopic = (title: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const updateTopicProgress = (topicTitle: string, status: Status) => {
    if (onProgressUpdate) {
      // Use the callback if provided
      onProgressUpdate(topicTitle, null, status)
      
      // Update local state to reflect the change immediately
      setTopicProgress(prev => ({
        ...prev,
        [topicTitle]: status
      }))
    } else {
      // Fallback to localStorage
      const newProgress = {
        ...topicProgress,
        [topicTitle]: status,
      }
      
      setTopicProgress(newProgress)
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`${name.toLowerCase()}-topic-progress`, JSON.stringify(newProgress))
      }
    }
  }

  const updateSubtopicProgress = (subtopicTitle: string, status: Status, topicTitle: string) => {
    if (onProgressUpdate) {
      // Use the callback if provided
      onProgressUpdate(topicTitle, subtopicTitle, status)
      
      // Update local state to reflect the change immediately
      setSubtopicProgress(prev => ({
        ...prev,
        [subtopicTitle]: status
      }))
    } else {
      // Fallback to localStorage
      const newProgress = {
        ...subtopicProgress,
        [subtopicTitle]: status,
      }
      
      setSubtopicProgress(newProgress)
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`${name.toLowerCase()}-subtopic-progress`, JSON.stringify(newProgress))
      }
    }
  }

  const getSubtopicStatus = (subtopic: Subtopic): Status => {
    // If we have a saved status in localStorage, use it
    if (subtopicProgress[subtopic.title]) {
      return subtopicProgress[subtopic.title];
    }
    
    // Otherwise use the default progress from the data or "not-started"
    return subtopic.progress || "not-started";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block">
          <h1 className="text-5xl font-bold mb-4 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 animate-gradient">
              {name}
            </span>
            {!name.toLowerCase().includes('path') && <span className="text-white/90"> Path</span>}
            <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </h1>
        </div>
        <p className="text-lg text-blue-100/80 max-w-3xl mx-auto mt-6">{description}</p>
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
              <div className="flex items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white text-left">{topic.title}</h3>
                  <p className="text-white/60 text-sm mt-1 text-left">{topic.description}</p>
                </div>
                {topicProgress[topic.title] === "complete" && (
                  <StatusBadge status="complete" />
                )}
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
                    <div key={subtopic.title} className="group relative">
                      <div className="hover:bg-white/5 p-4 pr-32 rounded-lg transition-colors">
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
                        <StatusDropdown
                          status={getSubtopicStatus(subtopic)}
                          onStatusChange={(status) => updateSubtopicProgress(subtopic.title, status, topic.title)}
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