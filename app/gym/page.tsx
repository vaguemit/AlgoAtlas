"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dumbbell, ArrowRight, Timer, Target, Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { levels, Level, getDifficultyColor } from "./level-sheet/page"

interface Problem {
  contestId: number
  index: string
  name: string
  rating: number
  url: string
}

interface ContestProblem {
  id: string
  difficulty: number
  name: string
  url: string
}

interface ActiveContest {
  problems: ContestProblem[]
  timeLimit: number
  targetPerformance: number
  startTime: number
  endTime: number
}

async function fetchCodeforcesProblems(rating: number): Promise<Problem[]> {
  try {
    const response = await fetch(`https://codeforces.com/api/problemset.problems`)
    const data = await response.json()
    
    if (data.status === 'OK') {
      return data.result.problems.filter((p: Problem) => 
        p.rating && Math.abs(p.rating - rating) <= 100
      )
    }
    return []
  } catch (error) {
    console.error('Error fetching problems:', error)
    return []
  }
}

export default function GymPage() {
  const [userLevel, setUserLevel] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [activeContest, setActiveContest] = useState<ActiveContest | null>(null)
  const [selectedProblems, setSelectedProblems] = useState<ContestProblem[]>([])
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (activeContest) {
      timer = setInterval(() => {
        const now = Date.now()
        const remaining = Math.max(0, activeContest.endTime - now)
        setTimeLeft(Math.floor(remaining / 1000))
        
        if (remaining === 0) {
          endContest()
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [activeContest])

  const startContest = async () => {
    setIsLoading(true)
    try {
      const levelData = levels.find((l: Level) => l.id === userLevel)
      if (!levelData) {
        toast.error("Invalid level selected")
        return
      }

      const contestProblems: ContestProblem[] = []
      for (const problem of levelData.problems) {
        const problems = await fetchCodeforcesProblems(problem.difficulty)
        if (problems.length > 0) {
          const randomProblem = problems[Math.floor(Math.random() * problems.length)]
          contestProblems.push({
            id: `${randomProblem.contestId}${randomProblem.index}`,
            difficulty: problem.difficulty,
            name: randomProblem.name,
            url: `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`
          })
        }
      }

      if (contestProblems.length === 4) {
        setSelectedProblems(contestProblems)
        toast.success("Problems generated! Review and start when ready.")
      } else {
        toast.error("Could not find suitable problems. Please try again.")
      }
    } catch (error) {
      toast.error("Error creating contest. Please try again.")
    }
    setIsLoading(false)
  }

  const rerollProblem = async (index: number) => {
    setIsLoading(true)
    try {
      const levelData = levels.find((l: Level) => l.id === userLevel)
      if (!levelData) return

      const targetDifficulty = levelData.problems[index].difficulty
      const problems = await fetchCodeforcesProblems(targetDifficulty)
      
      if (problems.length > 0) {
        const randomProblem = problems[Math.floor(Math.random() * problems.length)]
        const newProblems = [...selectedProblems]
        newProblems[index] = {
          id: `${randomProblem.contestId}${randomProblem.index}`,
          difficulty: targetDifficulty,
          name: randomProblem.name,
          url: `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`
        }
        setSelectedProblems(newProblems)
        toast.success("Problem rerolled!")
      }
    } catch (error) {
      toast.error("Error rerolling problem. Please try again.")
    }
    setIsLoading(false)
  }

  const beginContest = () => {
    if (!selectedProblems.length) return

    const levelData = levels.find((l: Level) => l.id === userLevel)
    if (!levelData) return

    const startTime = Date.now()
    const endTime = startTime + (levelData.timeLimit * 60 * 1000)

    setActiveContest({
      problems: selectedProblems,
      timeLimit: levelData.timeLimit,
      targetPerformance: levelData.performance,
      startTime,
      endTime
    })
    toast.success("Contest started! Good luck!")
  }

  const endContest = () => {
    if (!activeContest) return

    const timeSpent = (Date.now() - activeContest.startTime) / (60 * 1000)
    const timeExceeded = timeSpent > activeContest.timeLimit

    if (timeExceeded) {
      toast.error("Time's up! Try again or practice more!")
    }

    setActiveContest(null)
    setSelectedProblems([])
  }

  useEffect(() => {
    const savedLevel = localStorage.getItem('userLevel')
    if (savedLevel) {
      setUserLevel(Number(savedLevel))
    }
  }, [])

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Problem Solving Gym
          </h1>
          <p className="text-lg text-blue-100/80">
            Practice your problem-solving skills with our curated collection of coding problems. Track your progress and
            improve your competitive programming abilities.
          </p>
        </div>

        {/* Level Sheet Button */}
        <div className="flex justify-center mb-12">
          <Link href="/gym/level-sheet">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Button className="relative bg-black/95 backdrop-blur-sm border border-purple-500/20 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-black/50 hover:border-purple-500/30 transition-all duration-300">
                <Dumbbell className="mr-3 h-6 w-6" />
                View Level Sheet
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Level Selection and Contest Creation */}
        {!activeContest ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-black/95 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Start a Contest</h2>
              
              {/* Instructions */}
              <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-100/80">
                  <li>Enter your current level (1-109)</li>
                  <li>Click "Generate Problems" to get random problems</li>
                  <li>Review the problems and reroll if needed</li>
                  <li>Click "Begin Contest" when ready</li>
                  <li>Solve the problems within the time limit</li>
                  <li>Complete all problems to advance to the next level</li>
                </ol>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Input
                  type="number"
                  min={1}
                  max={109}
                  value={userLevel}
                  onChange={(e) => setUserLevel(Number(e.target.value))}
                  className="bg-black/50 border-purple-500/20 text-white"
                  placeholder="Enter your level (1-109)"
                />
                <Button
                  onClick={startContest}
                  disabled={isLoading || userLevel < 1 || userLevel > 109}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? "Generating..." : "Generate Problems"}
                </Button>
              </div>

              {/* Problem Selection */}
              {selectedProblems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Review Problems:</h3>
                  {selectedProblems.map((problem, index) => (
                    <div key={problem.id} className="bg-black/80 border border-purple-500/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-purple-400 mb-1">Problem {index + 1}</span>
                          <h3 className="text-lg font-medium text-white">{problem.name}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <Button
                            onClick={() => rerollProblem(index)}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Reroll
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={beginContest}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Begin Contest
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/95 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Active Contest</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-blue-400">
                    <Timer className="h-5 w-5 mr-2" />
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center text-purple-400">
                    <Target className="h-5 w-5 mr-2" />
                    <span>{activeContest.targetPerformance}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {activeContest.problems.map((problem, index) => (
                  <div key={problem.id} className="bg-black/80 border border-purple-500/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-purple-400 mb-1">Problem {index + 1}</span>
                        <h3 className="text-lg font-medium text-white">{problem.name}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Solve →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={endContest}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  End Contest
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 