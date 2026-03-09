"use client"

import { useState, useEffect } from "react"
import { DivisionDetails } from "@/components/DivisionDetails"
import { useLearningProgress } from "@/hooks/use-learning-progress"
import { LearningModule, LearningItem, pathColors } from "@/lib/types/learning-paths"

type Status = "not-started" | "reading" | "practicing" | "complete" | "skipped" | "ignored"

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

interface LearningPathDetailsProps {
  pathId: string
}

export default function LearningPathDetails({ pathId }: LearningPathDetailsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pathName, setPathName] = useState("")
  const [pathDescription, setPathDescription] = useState("")
  const [pathColor, setPathColor] = useState("bg-blue-500")
  const [topics, setTopics] = useState<Topic[]>([])

  const { updateProgress, getStatusFor } = useLearningProgress({
    pathId,
    fallbackToLocalStorage: true
  })

  useEffect(() => {
    async function fetchPathDetails() {
      try {
        const response = await fetch(`/api/learning-paths?id=${pathId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch learning path details')
        }
        
        const data = await response.json()
        
        if (!data.path || !data.modules) {
          throw new Error('Invalid data format received from API')
        }
        
        // Set path details
        setPathName(data.path.title)
        setPathDescription(data.path.description)
        
        // Set path color based on title
        if (data.path.title.includes('Diamond')) {
          setPathColor(`bg-${pathColors['Diamond Path'].main}`)
        } else if (data.path.title.includes('Emerald')) {
          setPathColor(`bg-${pathColors['Emerald Path'].main}`)
        } else if (data.path.title.includes('Sapphire')) {
          setPathColor(`bg-${pathColors['Sapphire Path'].main}`)
        } else if (data.path.title.includes('Amethyst')) {
          setPathColor(`bg-${pathColors['Amethyst Path'].main}`)
        } else if (data.path.title.includes('Ruby')) {
          setPathColor(`bg-${pathColors['Ruby Path'].main}`)
        } else {
          setPathColor(`bg-${pathColors.default.main}`)
        }
        
        // Convert modules and items to topics and subtopics format
        const convertedTopics = data.modules.map((module: LearningModule) => {
          return {
            title: module.title,
            description: module.description,
            url: (module.items && module.items.length > 0) ? module.items[0].external_url : "#",
            subtopics: (module.items || []).map((item: LearningItem) => ({
              title: item.title,
              description: item.content,
              url: item.external_url,
              progress: getStatusFor(module.title, item.title) as Status
            }))
          }
        })
        
        setTopics(convertedTopics)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching learning path details:', err)
        setError('Failed to load learning path details. Please try again later.')
        setLoading(false)
      }
    }
    
    fetchPathDetails()
  }, [pathId, getStatusFor])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/70">Loading learning path details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // Update topic status in the component
  const updatedTopics = topics.map(topic => {
    // Update the status of each subtopic
    const updatedSubtopics = topic.subtopics.map(subtopic => ({
      ...subtopic,
      progress: getStatusFor(topic.title, subtopic.title) as Status
    }))
    
    return {
      ...topic,
      subtopics: updatedSubtopics
    }
  })

  return (
    <DivisionDetails
      name={pathName}
      color={pathColor}
      description={pathDescription}
      topics={updatedTopics}
      onProgressUpdate={(topicId, subtopicId, status) => {
        updateProgress(topicId, subtopicId, status as any)
      }}
    />
  )
} 