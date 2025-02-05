import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const learningPaths = [
  {
    title: "Beginner's Algorithms",
    description: "Start your journey with fundamental algorithms and data structures.",
    topics: ["Arrays", "Linked Lists", "Sorting", "Searching"],
    difficulty: "Beginner",
  },
  {
    title: "Intermediate Problem Solving",
    description: "Dive deeper into more complex algorithms and problem-solving techniques.",
    topics: ["Dynamic Programming", "Graph Algorithms", "Greedy Algorithms"],
    difficulty: "Intermediate",
  },
  {
    title: "Advanced Competitive Programming",
    description: "Master advanced techniques used in programming contests.",
    topics: ["Advanced Data Structures", "Network Flow", "Computational Geometry"],
    difficulty: "Advanced",
  },
]

export default function LearningPaths() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Learning Paths</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{path.title}</CardTitle>
              <CardDescription>{path.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {path.topics.map((topic, i) => (
                  <Badge key={i} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
              <Badge>{path.difficulty}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

