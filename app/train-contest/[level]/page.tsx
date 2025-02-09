"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Contest } from "@/components/Contest"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { MultiSelect } from "@/components/ui/multi-select"
import { ContestEntry } from "@/components/ContestEntry"

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

interface FilterOptions {
  tags: string[]
  type: string
  platform: string
}

// Exact ratings from the level sheet
const p1Ratings = [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 900, 900, 900, 900, 1000, 1000, 1000, 1000, 1100, 1100, 1100, 1100, 1200, 1200, 1200, 1200, 1300, 1300, 1300, 1300, 1400, 1400, 1400, 1400, 1500, 1500, 1500, 1500, 1600, 1600, 1600, 1600, 1700, 1700, 1700, 1700, 1800, 1800, 1800, 1800, 1900, 1900, 1900, 1900, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100, 2200, 2200, 2200, 2200, 2300, 2300, 2300, 2300, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2600, 2600, 2600, 2600, 2700, 2700, 2700, 2700, 2800, 2800, 2800, 2800, 2900, 2900, 2900, 2900, 3000, 3100, 3100, 3200, 3200, 3300, 3300, 3300, 3400, 3400, 3400, 3500]

const p2Ratings = [800, 800, 800, 900, 900, 900, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1100, 1100, 1100, 1100, 1200, 1200, 1200, 1200, 1300, 1300, 1300, 1300, 1400, 1400, 1400, 1400, 1500, 1500, 1500, 1500, 1600, 1600, 1600, 1600, 1700, 1700, 1700, 1700, 1800, 1800, 1800, 1800, 1900, 1900, 1900, 1900, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100, 2200, 2200, 2200, 2200, 2300, 2300, 2300, 2300, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2600, 2600, 2600, 2600, 2700, 2700, 2700, 2700, 2800, 2800, 2800, 2800, 2900, 2900, 2900, 2900, 3000, 3000, 3000, 3000, 3100, 3100, 3100, 3100, 3200, 3200, 3200, 3300, 3300, 3300, 3300, 3400, 3400, 3400, 3500, 3500]

const p3Ratings = [800, 800, 900, 900, 900, 1000, 1000, 1000, 1100, 1100, 1200, 1200, 1200, 1200, 1200, 1300, 1300, 1300, 1300, 1400, 1400, 1400, 1400, 1500, 1500, 1500, 1500, 1600, 1600, 1600, 1600, 1700, 1700, 1700, 1700, 1800, 1800, 1800, 1800, 1900, 1900, 1900, 1900, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100, 2200, 2200, 2200, 2200, 2300, 2300, 2300, 2300, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2600, 2600, 2600, 2600, 2700, 2700, 2700, 2700, 2800, 2800, 2800, 2800, 2900, 2900, 2900, 2900, 3000, 3000, 3000, 3000, 3100, 3100, 3100, 3100, 3200, 3200, 3200, 3200, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3400, 3400, 3500, 3500, 3500]

const p4Ratings = [800, 900, 900, 900, 1000, 1000, 1000, 1100, 1100, 1200, 1200, 1300, 1400, 1400, 1400, 1400, 1500, 1500, 1500, 1500, 1600, 1600, 1600, 1600, 1700, 1700, 1700, 1700, 1800, 1800, 1800, 1800, 1900, 1900, 1900, 1900, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100, 2200, 2200, 2200, 2200, 2300, 2300, 2300, 2300, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2600, 2600, 2600, 2600, 2700, 2700, 2700, 2700, 2800, 2800, 2800, 2800, 2900, 2900, 2900, 2900, 3000, 3000, 3000, 3000, 3100, 3100, 3100, 3100, 3200, 3200, 3200, 3200, 3300, 3300, 3300, 3300, 3400, 3400, 3400, 3400, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500]

export default function ActiveContest() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [problems, setProblems] = useState<Problem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    type: "",
    platform: "all"
  })
  const [isContestStarted, setIsContestStarted] = useState(false)

  const fetchProblems = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("Fetching problems for level:", params.level)
      const response = await fetch(`https://codeforces.com/api/problemset.problems`)
      const data = await response.json()
      
      if (data.status === "OK" && data.result?.problems) {
        const level = Number(params.level)
        console.log("Current level:", level)

        // Get the target ratings for this level
        const targetRatings = {
          p1: p1Ratings[level - 1] || 800,
          p2: p2Ratings[level - 1] || 900,
          p3: p3Ratings[level - 1] || 1000,
          p4: p4Ratings[level - 1] || 1100
        }

        console.log("Target ratings:", targetRatings)

        let allProblems = data.result.problems.map((p: any) => ({
          id: `${p.contestId}${p.index}`,
          title: p.name,
          difficulty: p.rating,
          url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
          platform: "codeforces",
          tags: p.tags || [],
          type: "standard",
          solved: false
        }))

        // Apply tag filters if any
        if (filters.tags.length > 0) {
          allProblems = allProblems.filter((p: Problem) => 
            filters.tags.every(tag => p.tags.includes(tag))
          )
        }

        // Get problems for each difficulty
        const contestProblems = [];
        
        // Get one problem for each target rating
        for (const rating of [targetRatings.p1, targetRatings.p2, targetRatings.p3, targetRatings.p4]) {
          const problemsOfRating = allProblems.filter((p: Problem) => p.difficulty === rating);
          if (problemsOfRating.length > 0) {
            const randomProblem = problemsOfRating[Math.floor(Math.random() * problemsOfRating.length)];
            contestProblems.push(randomProblem);
          }
        }

        console.log("Final contest problems:", contestProblems)
        setProblems(contestProblems)
      } else {
        setError("Invalid data format received from API")
        console.error("Invalid data format received from API")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Error fetching problems:", error)
      setProblems([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProblems()
  }, [params.level, filters])

  const handleReroll = async (index: number) => {
    // Fetch a new problem with the same rating
    const rating = problems[index].difficulty
    const response = await fetch(`https://codeforces.com/api/problemset.problems`)
    const data = await response.json()
    
    if (data.status === "OK" && data.result?.problems) {
      const sameRatingProblems = data.result.problems
        .filter((p: any) => p.rating === rating)
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

      if (sameRatingProblems.length > 0) {
        const newProblem = sameRatingProblems[Math.floor(Math.random() * sameRatingProblems.length)]
        const newProblems = [...problems]
        newProblems[index] = newProblem
        setProblems(newProblems)
      }
    }
  }

  const handleCustomProblem = (index: number, url: string) => {
    // Validate and add custom problem
    const newProblems = [...problems]
    newProblems[index] = {
      ...newProblems[index],
      url: url,
      title: `Custom Problem ${index + 1}`,
    }
    setProblems(newProblems)
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (problems.length === 0) {
    return <div className="text-center p-4">No problems found for this level. Try different filters.</div>
  }

  if (!isContestStarted) {
    return (
      <ContestEntry
        level={params.level as string}
        problems={problems}
        onStart={() => setIsContestStarted(true)}
        onReroll={handleReroll}
        onCustomProblem={handleCustomProblem}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 p-4 bg-secondary/20 rounded-lg">
        <MultiSelect
          options={["dp", "graphs", "math", "implementation", "data structures"].map(tag => ({ label: tag, value: tag }))}
          value={filters.tags}
          onChange={(tags) => setFilters(prev => ({ ...prev, tags }))}
          placeholder="Select tags..."
          className="w-64"
        />
      </div>

      <Contest level={params.level} problems={problems} />
    </div>
  )
}

