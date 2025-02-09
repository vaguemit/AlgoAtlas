"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import Link from "next/link"

interface Problem {
  contestId: number
  index: string
  name: string
  rating: number
}

interface RandomProblemsProps {
  count: number
  minRating: number
  maxRating: number
}

export function RandomProblems({ count, minRating, maxRating }: RandomProblemsProps) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRandomProblems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/codeforces?method=problemset.problems`)
      const data = await response.json()
      if (data.status === "OK") {
        const filteredProblems = data.result.problems.filter(
          (p: Problem) => p.rating >= minRating && p.rating <= maxRating,
        )
        const randomProblems = filteredProblems.sort(() => 0.5 - Math.random()).slice(0, count)
        setProblems(randomProblems)
      } else {
        throw new Error(data.comment || "Failed to fetch problems")
      }
    } catch (error) {
      console.error("Error fetching random problems:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomProblems()
  }, [count, minRating, maxRating, fetchRandomProblems]) // Added fetchRandomProblems to dependencies

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Random Codeforces Problems</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {problems.map((problem) => (
            <div key={`${problem.contestId}${problem.index}`} className="flex justify-between items-center">
              <Link
                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {problem.name}
              </Link>
              <Badge>{problem.rating}</Badge>
            </div>
          ))}
        </div>
        <Button onClick={fetchRandomProblems} className="mt-4">
          Refresh Problems
        </Button>
      </CardContent>
    </Card>
  )
}

