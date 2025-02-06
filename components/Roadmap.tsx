"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Tier {
  range: string
  coreSkills: { name: string; progress: number }[]
  platformTargets: string[]
  practiceGoals: string[]
  problems: Problem[]
  completion: number
}

interface Problem {
  id: string
  name: string
  rating: number
  tags: string[]
  solvedCount: number
  url: string
  solved: boolean
}

const initialTiers: Tier[] = [
  {
    range: "1000-1400",
    coreSkills: [
      { name: "Brute force", progress: 0 },
      { name: "Simulation", progress: 0 },
      { name: "Case analysis", progress: 0 },
    ],
    platformTargets: ["AtCoder ABC C/D problems"],
    practiceGoals: ["Solve 30 AtCoder B problems in ≤10 mins each"],
    problems: [],
    completion: 0,
  },
  {
    range: "1400-1900",
    coreSkills: [
      { name: "BFS/DFS", progress: 0 },
      { name: "Binary search", progress: 0 },
      { name: "Basic DP", progress: 0 },
    ],
    platformTargets: ["Codeforces R1600-R2000 problems"],
    practiceGoals: ["Solve 20 Codeforces Div2 C problems in ≤20 mins each"],
    problems: [],
    completion: 0,
  },
  {
    range: "1900-2200",
    coreSkills: [
      { name: "Advanced DP", progress: 0 },
      { name: "Graph algorithms", progress: 0 },
      { name: "Number theory", progress: 0 },
    ],
    platformTargets: ["TopCoder Div1Easy", "Codeforces Div1A"],
    practiceGoals: ["Solve 15 Codeforces Div1 A problems in ≤30 mins each"],
    problems: [],
    completion: 0,
  },
  {
    range: "2200-2400+",
    coreSkills: [
      { name: "Advanced data structures", progress: 0 },
      { name: "Advanced graph algorithms", progress: 0 },
      { name: "Optimization techniques", progress: 0 },
    ],
    platformTargets: ["Codeforces Div1B", "TopCoder Div1Medium"],
    practiceGoals: ["Solve 10 Codeforces Div1 B problems in ≤45 mins each"],
    problems: [],
    completion: 0,
  },
]

export function Roadmap() {
  const [tiers, setTiers] = useState(initialTiers)
  const [expandedTier, setExpandedTier] = useState<string | null>(null)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/codeforces?method=problemset.problems")
        const data = await response.json()
        if (data.status === "OK") {
          const updatedTiers = tiers.map((tier) => {
            const [min, max] = tier.range.split("-").map(Number)
            const avgRating = Math.floor((min + max) / 2)
            const tierProblems = data.result.problems
              .filter((p: Problem) => p.rating >= min && p.rating <= max)
              .slice(0, 5)
              .map((p: Problem) => ({ ...p, solved: false }))
            return { ...tier, problems: tierProblems }
          })
          setTiers(updatedTiers)
        }
      } catch (error) {
        console.error("Error fetching problems:", error)
      }
    }
    fetchProblems()
  }, [tiers]) // Added tiers to the dependency array

  const handleExpandTier = (range: string) => {
    setExpandedTier(expandedTier === range ? null : range)
  }

  const handleMarkAsSolved = (tierIndex: number, problemIndex: number) => {
    const newTiers = [...tiers]
    newTiers[tierIndex].problems[problemIndex].solved = true

    // Update core skills progress
    const skillProgress = (newTiers[tierIndex].coreSkills[0].progress + 20) % 100
    newTiers[tierIndex].coreSkills = newTiers[tierIndex].coreSkills.map((skill) => ({
      ...skill,
      progress: skillProgress,
    }))

    // Update tier completion
    const solvedProblems = newTiers[tierIndex].problems.filter((p) => p.solved).length
    newTiers[tierIndex].completion = (solvedProblems / newTiers[tierIndex].problems.length) * 100

    setTiers(newTiers)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-4">Competitive Programming Roadmap</h2>
      {tiers.map((tier, tierIndex) => (
        <Card
          key={tier.range}
          className={`border-l-4 ${tierIndex % 2 === 0 ? "border-l-blue-500" : "border-l-green-500"}`}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Rating {tier.range}</span>
              <Progress value={tier.completion} className="w-1/3" />
            </CardTitle>
            <CardDescription>
              Tier {tierIndex + 1} - {tier.completion.toFixed(0)}% complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="skills">
                <AccordionTrigger>Core Skills</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {tier.coreSkills.map((skill, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <div className="flex items-center">
                          <Progress value={skill.progress} className="w-24 mr-2" />
                          <span>{skill.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="targets">
                <AccordionTrigger>Platform-Specific Targets</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    {tier.platformTargets.map((target, i) => (
                      <li key={i}>{target}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="goals">
                <AccordionTrigger>Practice Goals</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    {tier.practiceGoals.map((goal, i) => (
                      <li key={i}>{goal}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button
              onClick={() => handleExpandTier(tier.range)}
              className="mt-4"
              variant={expandedTier === tier.range ? "secondary" : "default"}
            >
              {expandedTier === tier.range ? "Hide Problems" : "Show Problems"}
            </Button>
            {expandedTier === tier.range && (
              <div className="mt-4 space-y-4">
                {tier.problems.map((problem, problemIndex) => (
                  <Card key={problem.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Link href={problem.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {problem.name}
                        </Link>
                      </CardTitle>
                      <CardDescription>Rating: {problem.rating}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {problem.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p>Solved by {problem.solvedCount} users</p>
                      <Button
                        className="mt-2"
                        onClick={() => handleMarkAsSolved(tierIndex, problemIndex)}
                        disabled={problem.solved}
                      >
                        {problem.solved ? <CheckCircle className="mr-2" /> : null}
                        {problem.solved ? "Solved" : "Mark as Solved"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>AI-Guided Tip</AlertTitle>
        <AlertDescription>
          For the 1400-1900 range, focus on TopCoder Div1Easy and Codeforces DP problems to improve your problem-solving
          skills.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Don't skip paper brainstorming for AtCoder C problems! It's crucial for developing your analytical skills.
        </AlertDescription>
      </Alert>
    </div>
  )
}

