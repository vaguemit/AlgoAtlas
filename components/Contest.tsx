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
}

interface ContestProps {
  level: number
  problems: Problem[]
  isRandom?: boolean
}

export function Contest({ level, problems: initialProblems, isRandom = false }: ContestProps) {
  const [problems, setProblems] = useState<Problem[]>(initialProblems)
  const [timeLeft, setTimeLeft] = useState(7200) // 2 hours in seconds
  const { toast } = useToast()
  const router = useRouter()

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

  const handleSubmit = (problemId: string) => {
    setProblems((prevProblems) =>
      prevProblems.map((problem) => (problem.id === problemId ? { ...problem, solved: true } : problem)),
    )
    toast({
      title: "Submitted",
      description: "Your solution has been submitted successfully.",
    })
  }

  const solvedCount = problems.filter((p) => p.solved).length

  if (timeLeft === 0) {
    router.push("/dashboard")
    return null
  }

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>
          Level {level} Contest {isRandom ? "(Random Codeforces Problems)" : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold">Time Remaining: {formatTime(timeLeft)}</p>
            <Progress value={(7200 - timeLeft) / 72} className="mt-2" />
          </div>
          {isRandom ? (
            <RandomProblems count={4} minRating={level * 100} maxRating={level * 100 + 600} />
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">Problems</h3>
              {problems.map((problem) => (
                <div key={problem.id} className="flex justify-between items-center mb-2 p-2 border rounded">
                  <span>
                    {problem.title} (Difficulty: {problem.difficulty})
                  </span>
                  <div>
                    {problem.solved ? (
                      <span className="text-green-500">Solved ✅</span>
                    ) : (
                      <Button onClick={() => handleSubmit(problem.id)}>Submit</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div>
            <p>
              Solved: {solvedCount} / {problems.length}
            </p>
          </div>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
      </CardContent>
    </Card>
  )
}

