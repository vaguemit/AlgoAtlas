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
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type React from "react"

type Status = "not-started" | "reading" | "practicing" | "complete" | "skipped" | "ignored"

interface StatusConfig {
  label: string
  icon: React.ReactNode
  color: string
}

const statusConfigs: Record<Status, StatusConfig> = {
  "not-started": {
    label: "Not Started",
    icon: <CircleDot className="h-4 w-4" />,
    color: "text-gray-500",
  },
  reading: {
    label: "Reading",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-yellow-500",
  },
  practicing: {
    label: "Practicing",
    icon: <Code className="h-4 w-4" />,
    color: "text-orange-500",
  },
  complete: {
    label: "Complete",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-green-500",
  },
  skipped: {
    label: "Skipped",
    icon: <FastForward className="h-4 w-4" />,
    color: "text-blue-500",
  },
  ignored: {
    label: "Ignored",
    icon: <X className="h-4 w-4" />,
    color: "text-purple-500",
  },
}

interface Subtopic {
  title: string
  description: string
  frequency?: string
  url?: string
}

interface Topic {
  title: string
  description: string
  url?: string
  subtopics?: Subtopic[]
}

interface DivisionDetailsProps {
  name: string
  color: string
  description: string
  topics: Topic[]
  progress: number
}

function StatusDropdown({ status, onStatusChange }: { status: Status; onStatusChange: (status: Status) => void }) {
  const config = statusConfigs[status]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`${config.color} flex items-center gap-2`}>
          {config.icon}
          {config.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(statusConfigs).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onStatusChange(key as Status)}
            className={`flex items-center gap-2 ${statusConfigs[key as Status].color}`}
          >
            {config.icon}
            {config.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DivisionDetails({ name, color, description, topics, progress }: DivisionDetailsProps) {
  const [topicStatuses, setTopicStatuses] = useState<Record<string, Status>>({})
  const [subtopicStatuses, setSubtopicStatuses] = useState<Record<string, Status>>({})

  const updateTopicStatus = (topicIndex: number, status: Status) => {
    setTopicStatuses((prev) => ({
      ...prev,
      [`topic-${topicIndex}`]: status,
    }))
  }

  const updateSubtopicStatus = (topicIndex: number, subtopicIndex: number, status: Status) => {
    setSubtopicStatuses((prev) => ({
      ...prev,
      [`topic-${topicIndex}-subtopic-${subtopicIndex}`]: status,
    }))
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">{name} Division</h1>
        <p className="text-xl text-muted-foreground">{description}</p>
      </div>

      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{name}</CardTitle>
            <Badge className={color}>{name} Division</Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topics.map((topic, i) => (
              <div key={i} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {topic.url ? (
                      <Link href={topic.url} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="link"
                          className="h-auto p-0 text-lg font-semibold hover:underline text-left flex items-center"
                        >
                          {topic.title}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <h3 className="text-lg font-semibold">{topic.title}</h3>
                    )}
                  </div>
                  <StatusDropdown
                    status={topicStatuses[`topic-${i}`] || "not-started"}
                    onStatusChange={(status) => updateTopicStatus(i, status)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                {topic.subtopics && (
                  <div className="space-y-2">
                    {topic.subtopics.map((subtopic, j) => (
                      <div key={j} className="pl-4 border-l-2 border-gray-200">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 flex-grow">
                            {subtopic.url ? (
                              <Link href={subtopic.url} target="_blank" rel="noopener noreferrer">
                                <Button
                                  variant="link"
                                  className="h-auto p-0 text-base font-medium hover:underline text-left flex items-center"
                                >
                                  {subtopic.title}
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            ) : (
                              <h4 className="text-base font-medium">{subtopic.title}</h4>
                            )}
                          </div>
                          <StatusDropdown
                            status={subtopicStatuses[`topic-${i}-subtopic-${j}`] || "not-started"}
                            onStatusChange={(status) => updateSubtopicStatus(i, j, status)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{subtopic.description}</p>
                        {subtopic.frequency && (
                          <Badge variant="outline" className="mt-1">
                            {subtopic.frequency}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-1" />
                  <span className="text-sm">{topics.length} Main Topics</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {topics.reduce((acc, topic) => acc + (topic.subtopics?.length || 0), 0)} Subtopics
                  </span>
                </div>
              </div>
              <Button variant="outline">
                Start Learning
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

