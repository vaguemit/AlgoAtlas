"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { RandomProblems } from "@/components/RandomProblems"

interface Problem {
  id: string
  title: string
  difficulty: number
  solved: boolean
  url?: string
  platform: string
  tags: string[]
}

interface ContestProps {
  level: string | string[]
  problems: Problem[]
  onReroll: () => void
}

export function Contest({ level, problems = [], onReroll }: ContestProps) {
  const [contestProblems, setContestProblems] = useState<Problem[]>(problems || [])
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem(`contest-time-${level}`)
    return savedTime ? parseInt(savedTime) : 7200
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setContestProblems(problems || [])
  }, [problems])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Save time to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`contest-time-${level}`, timeLeft.toString())
  }, [timeLeft, level])

  // Reset timer when level changes
  useEffect(() => {
    setTimeLeft(7200)
  }, [level])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleRefresh = () => {
    toast({
      title: "Refreshed",
      description: "Problem statuses have been updated.",
    })
  }

  // Add reroll functionality
  const handleReroll = () => {
    const newProblems = [...problems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
    setContestProblems(newProblems)
    toast({
      title: "Problems Rerolled",
      description: "New set of problems has been generated.",
    })
  }

  // Enhance handleSubmit with confirmation
  const handleSubmit = (problemId: string) => {
    const confirmed = window.confirm("Are you sure you want to mark this problem as solved?")
    if (confirmed) {
      setContestProblems((prevProblems) =>
        prevProblems.map((problem) => 
          problem.id === problemId ? { ...problem, solved: true } : problem
        )
      )
      toast({
        title: "Problem Solved!",
        description: "Your progress has been updated.",
        variant: "default"
      })
    }
  }

  const solvedCount = contestProblems.filter((p) => p.solved).length

  if (timeLeft === 0) {
    router.push("/dashboard")
    return null
  }

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>
          Level {level} Contest
        </CardTitle>
        <Button onClick={handleReroll} variant="outline">
          Reroll Problems
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Time Remaining: {formatTime(timeLeft)}</p>
            <p className="text-lg font-semibold">Progress: {solvedCount}/{contestProblems.length}</p>
          </div>
          <Progress 
            value={(7200 - timeLeft) / 72} 
            className={`mt-2 ${timeLeft < 1800 ? "bg-red-500" : ""}`}
          />
          <div className="grid gap-4">
            {(contestProblems || []).map((problem) => (
              <div 
                key={problem.id} 
                className="p-4 border rounded-lg hover:bg-secondary/10"
              >
                <a 
                  href={problem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg font-semibold hover:text-primary"
                >
                  {problem.title}
                </a>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">
                    Difficulty: {problem.difficulty}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Platform: {problem.platform}
                  </span>
                  <div className="flex gap-1">
                    {(problem.tags || []).map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 text-xs bg-primary/10 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p>
              Solved: {solvedCount} / {contestProblems?.length || 0}
            </p>
          </div>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
      </CardContent>
    </Card>
  )
}

