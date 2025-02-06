"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Circle, Folder, FolderOpen, Plus } from "lucide-react"
import Link from "next/link"

interface Resource {
  type: "Tutorial" | "Video" | "Problem"
  title: string
  link: string
  completed: boolean
}

interface Topic {
  name: string
  description: string
  resources: Resource[]
  subtopics?: Topic[]
}

interface TopicTreeProps {
  topic: Topic
  level: number
}

const TopicTree: React.FC<TopicTreeProps> = ({ topic, level }) => {
  const [isOpen, setIsOpen] = useState(level === 0)
  const [isCompleted, setIsCompleted] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)
  const toggleCompleted = () => setIsCompleted(!isCompleted)

  const completedResources = topic.resources.filter((r) => r.completed).length
  const progress = (completedResources / topic.resources.length) * 100

  return (
    <div className="ml-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={toggleOpen}>
          {isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
        </Button>
        <span className="font-medium">{topic.name}</span>
        <Progress value={progress} className="w-20" />
        <Button variant="ghost" size="sm" onClick={toggleCompleted}>
          {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        </Button>
      </div>
      {isOpen && (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-muted-foreground">{topic.description}</p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="resources">
              <AccordionTrigger>Resources</AccordionTrigger>
              <AccordionContent>
                {topic.resources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-2 py-1">
                    <Badge variant={resource.type === "Problem" ? "destructive" : "secondary"}>{resource.type}</Badge>
                    <Link href={resource.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {resource.title}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedResources = [...topic.resources]
                        updatedResources[index].completed = !updatedResources[index].completed
                        // Update the state here (this is a simplified example)
                      }}
                    >
                      {resource.completed ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {topic.subtopics &&
            topic.subtopics.map((subtopic, index) => <TopicTree key={index} topic={subtopic} level={level + 1} />)}
        </div>
      )}
    </div>
  )
}

const dataStructuresTopic: Topic = {
  name: "Data Structures",
  description: "Fundamental data structures for competitive programming",
  resources: [],
  subtopics: [
    {
      name: "Beginner (1000-1400)",
      description: "Basic data structures for beginners",
      resources: [
        {
          type: "Tutorial",
          title: "Arrays and Prefix Sum",
          link: "https://cp-algorithms.com/data_structures/prefix_sum.html",
          completed: false,
        },
        {
          type: "Video",
          title: "Errichto's Array Lecture",
          link: "https://www.youtube.com/watch?v=example",
          completed: false,
        },
        {
          type: "Problem",
          title: "Codeforces 1000A - Array Manipulation",
          link: "https://codeforces.com/problemset/problem/1000/A",
          completed: false,
        },
      ],
      subtopics: [
        {
          name: "Arrays",
          description: "Basic array operations and techniques",
          resources: [
            {
              type: "Tutorial",
              title: "Introduction to Arrays",
              link: "https://www.geeksforgeeks.org/introduction-to-arrays/",
              completed: false,
            },
          ],
        },
        {
          name: "Prefix Sum",
          description: "Efficient technique for range sum queries",
          resources: [
            {
              type: "Tutorial",
              title: "Prefix Sum Array",
              link: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/",
              completed: false,
            },
          ],
        },
      ],
    },
    {
      name: "Intermediate (1400-1900)",
      description: "More advanced data structures",
      resources: [
        {
          type: "Tutorial",
          title: "Binary Indexed Tree (Fenwick Tree)",
          link: "https://cp-algorithms.com/data_structures/fenwick.html",
          completed: false,
        },
        {
          type: "Video",
          title: "Segment Trees Explained",
          link: "https://www.youtube.com/watch?v=example2",
          completed: false,
        },
        {
          type: "Problem",
          title: "Codeforces 1500B - Segment Tree Problem",
          link: "https://codeforces.com/problemset/problem/1500/B",
          completed: false,
        },
      ],
    },
    {
      name: "Advanced (1900+)",
      description: "Complex data structures for advanced problems",
      resources: [
        {
          type: "Tutorial",
          title: "Persistent Segment Trees",
          link: "https://cp-algorithms.com/data_structures/persistent_segment_tree.html",
          completed: false,
        },
        {
          type: "Video",
          title: "Advanced Data Structures Masterclass",
          link: "https://www.youtube.com/watch?v=example3",
          completed: false,
        },
        {
          type: "Problem",
          title: "Codeforces 2000C - Treap Challenge",
          link: "https://codeforces.com/problemset/problem/2000/C",
          completed: false,
        },
      ],
    },
  ],
}

export function TopicLearningPath() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Topic-Focused Learning Path</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Resource or Request Topic</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Structures</CardTitle>
          <CardDescription>Master the fundamental building blocks of algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <TopicTree topic={dataStructuresTopic} level={0} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Community Recommendations</CardTitle>
          <CardDescription>Top resources as voted by Codeforces users</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <Link href="#" className="hover:underline">
                "Competitive Programmer's Handbook" by Antti Laaksonen
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                "Introduction to Algorithms" by CLRS
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                "Algorithms for Competitive Programming" by CatalinT
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

