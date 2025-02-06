import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

interface Topic {
  title: string
  description: string
  resources: {
    title: string
    type: "article" | "video" | "problem"
    link: string
  }[]
}

interface LearningPathDetailsProps {
  title: string
  description: string
  topics: string[]
  difficulty: string
  content: Topic[]
}

export function LearningPathDetails({ title, description, topics, difficulty, content }: LearningPathDetailsProps) {
  const [progress, setProgress] = useState(0)

  const handleStartPath = () => {
    // In a real application, this would initiate the learning path for the user
    setProgress(10)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {topics.map((topic, i) => (
              <Badge key={i} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
          <Badge>{difficulty}</Badge>
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          <Button onClick={handleStartPath} className="mt-4">
            {progress === 0 ? "Start Learning Path" : "Continue Learning"}
          </Button>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        {content.map((topic, index) => (
          <AccordionItem key={index} value={`topic-${index}`}>
            <AccordionTrigger>{topic.title}</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">{topic.description}</p>
              <ul className="space-y-2">
                {topic.resources.map((resource, resourceIndex) => (
                  <li key={resourceIndex}>
                    <Link href={resource.link} className="text-blue-500 hover:underline">
                      {resource.title}
                    </Link>
                    <Badge variant="outline" className="ml-2">
                      {resource.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

