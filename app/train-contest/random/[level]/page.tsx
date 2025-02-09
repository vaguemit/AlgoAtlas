"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Contest } from "@/components/Contest"
import { LoadingSpinner } from "@/components/LoadingSpinner"

interface Problem {
  id: string
  title: string
  difficulty: number
  url: string
  platform: string
  tags: string[]
  type: string
  solved: boolean
}

export default function RandomContest() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [problems, setProblems] = useState<Problem[]>([])

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://codeforces.com/api/problemset.problems`)
        const data = await response.json()
        
        if (data.status === "OK" && data.result?.problems) {
          // Filter problems based on the selected level
          const minRating = 800 + (Number(params.level) - 1) * 400
          const maxRating = minRating + 400

          const filteredProblems = data.result.problems
            .filter((p: any) => p.rating >= minRating && p.rating <= maxRating)
            .map((p: any) => ({
              id: `${p.contestId}${p.index}`,
              title: p.name,
              difficulty: p.rating,
              url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
              platform: "codeforces",
              tags: p.tags || [],
              type: "standard",
              solved: false
            }))

          // Get 4 random problems
          const randomProblems = filteredProblems
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)

          setProblems(randomProblems)
        }
      } catch (error) {
        console.error("Error fetching problems:", error)
        setProblems([])
      }
      setIsLoading(false)
    }

    fetchProblems()
  }, [params.level])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return <Contest level={params.level} problems={problems} />
}

