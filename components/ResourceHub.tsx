"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Circle, Folder, FolderOpen, Plus, Search } from "lucide-react"
import Link from "next/link"

interface Resource {
  type: "Tutorial" | "Video" | "Problem" | "Book" | "Template" | "Contest" | "Forum"
  title: string
  link: string
  difficulty?: number
  tags?: string[]
  completed: boolean
  upvotes?: number
  solvedRatio?: number
  description?: string
}

interface Category {
  name: string
  description: string
  resources: Resource[]
  progress: number
}

const mockCategories: Category[] = [
  {
    name: "Foundational Tutorials & Guides",
    description: "Core algorithms and data structures",
    progress: 30,
    resources: [
      {
        type: "Tutorial",
        title: "CP-Algorithms: Dynamic Programming",
        link: "https://cp-algorithms.com/dynamic_programming/",
        completed: false,
        upvotes: 150,
        description: "Comprehensive guide on DP techniques",
      },
      {
        type: "Video",
        title: "Errichto's Binary Search Masterclass",
        link: "https://www.youtube.com/watch?v=GU7DpgHINWQ",
        completed: false,
        upvotes: 120,
        description: "In-depth tutorial on binary search applications",
      },
      // Add more resources...
    ],
  },
  {
    name: "Practice Platforms",
    description: "Curated problem sets for different skill levels",
    progress: 45,
    resources: [
      {
        type: "Contest",
        title: "AtCoder Beginner Contest 124",
        link: "https://atcoder.jp/contests/abc124",
        difficulty: 1200,
        completed: false,
        tags: ["beginner", "implementation"],
        description: "Ideal for beginners (problems A-C)",
      },
      {
        type: "Contest",
        title: "Codeforces Round #817 (Div. 3)",
        link: "https://codeforces.com/contest/1722",
        difficulty: 1400,
        completed: false,
        tags: ["intermediate", "data structures"],
        description: "Great for intermediate programmers (problems A-D)",
      },
      // Add more resources...
    ],
  },
  {
    name: "Topic-Specific Problem Sets",
    description: "Focused practice on individual topics",
    progress: 60,
    resources: [
      {
        type: "Problem",
        title: "AtCoder DP Contest - Frog 1",
        link: "https://atcoder.jp/contests/dp/tasks/dp_a",
        difficulty: 1200,
        completed: true,
        tags: ["dp", "beginner"],
        description: "Classic introductory DP problem",
      },
      {
        type: "Problem",
        title: "Codeforces - Shortest Path with Obstacle",
        link: "https://codeforces.com/problemset/problem/1547/A",
        difficulty: 1600,
        completed: false,
        tags: ["graphs", "shortest paths"],
        description: "Graph theory application",
      },
      // Add more resources...
    ],
  },
  {
    name: "Advanced Resources",
    description: "In-depth materials for experienced competitors",
    progress: 15,
    resources: [
      {
        type: "Book",
        title: "Competitive Programming 3",
        link: "https://cpbook.net/",
        completed: false,
        upvotes: 200,
        description: "Comprehensive guide by Steven Halim",
      },
      {
        type: "Template",
        title: "KACTL",
        link: "https://github.com/kth-competitive-programming/kactl",
        completed: false,
        upvotes: 180,
        description: "KTH's ICPC notebook with optimized implementations",
      },
      // Add more resources...
    ],
  },
  {
    name: "Mental Training & Strategy",
    description: "Psychological aspects and contest strategies",
    progress: 75,
    resources: [
      {
        type: "Tutorial",
        title: "Masataka Yoneda's Guide",
        link: "https://codeforces.com/blog/entry/66909",
        completed: true,
        upvotes: 300,
        description: "Strategies to improve from 1000 to 2400+",
      },
      {
        type: "Forum",
        title: "Codeforces: Psychologically Safe Practice",
        link: "https://codeforces.com/blog/entry/78159",
        completed: false,
        upvotes: 150,
        description: "Discussion on maintaining mental health while competing",
      },
      // Add more resources...
    ],
  },
  // Add more categories...
]

const DifficultyBadge = ({ difficulty }: { difficulty: number }) => {
  let color = "bg-gray-500"
  if (difficulty < 1200) color = "bg-green-500"
  else if (difficulty < 1600) color = "bg-blue-500"
  else if (difficulty < 2000) color = "bg-purple-500"
  else if (difficulty < 2400) color = "bg-orange-500"
  else color = "bg-red-500"

  return <Badge className={`${color} text-white`}>R{difficulty}</Badge>
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  return (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <Badge variant={resource.type === "Problem" ? "destructive" : "secondary"}>{resource.type}</Badge>
            <Link href={resource.link} target="_blank" rel="noopener noreferrer" className="ml-2 hover:underline">
              {resource.title}
            </Link>
            {resource.difficulty && <DifficultyBadge difficulty={resource.difficulty} />}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  {resource.completed ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{resource.completed ? "Completed" : "Mark as completed"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">{resource.description}</p>
        <div className="mt-2">
          {resource.tags &&
            resource.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="mr-2">
                #{tag}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

const CategoryCard = ({ category }: { category: Category }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-4">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between">
          <span>
            {isExpanded ? <FolderOpen className="inline-block mr-2" /> : <Folder className="inline-block mr-2" />}
            {category.name}
          </span>
          <Progress value={category.progress} className="w-1/4" />
        </CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="resources">
              <AccordionTrigger>View Resources ({category.resources.length})</AccordionTrigger>
              <AccordionContent>
                {category.resources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      )}
    </Card>
  )
}

export function ResourceHub() {
  const [categories, setCategories] = useState(mockCategories)
  const [filter, setFilter] = useState("")

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(filter.toLowerCase()) ||
      category.resources.some(
        (resource) =>
          resource.title.toLowerCase().includes(filter.toLowerCase()) ||
          resource.tags?.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())),
      ),
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Resource Hub</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Contribute a new resource</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search topics, tags, or resources..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="beginner">Beginner (R1000-1400)</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate (R1400-1900)</TabsTrigger>
          <TabsTrigger value="advanced">Advanced (R1900+)</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {filteredCategories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </TabsContent>
        {/* Implement other tab contents similarly */}
      </Tabs>
    </div>
  )
}

