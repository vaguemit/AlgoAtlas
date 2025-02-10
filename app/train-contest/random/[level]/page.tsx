"use client"

import { useEffect, useState, useCallback } from "react"
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
  const [allProblems, setAllProblems] = useState<Problem[]>([])

  // Memoized function to get random problems
  const getRandomProblems = useCallback((problemPool: Problem[]) => {
    return [...problemPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, []);

  // Handle reroll
  const handleReroll = useCallback(() => {
    setProblems(getRandomProblems(allProblems));
  }, [allProblems, getRandomProblems]);

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true)
      try {
        // Use cached data if available
        const cachedData = sessionStorage.getItem('cfProblems');
        let problemsData;

        if (cachedData) {
          problemsData = JSON.parse(cachedData);
        } else {
          const response = await fetch(`https://codeforces.com/api/problemset.problems`)
          const data = await response.json()
          if (data.status === "OK" && data.result?.problems) {
            problemsData = data.result.problems;
            // Cache the response
            sessionStorage.setItem('cfProblems', JSON.stringify(problemsData));
          }
        }

        if (problemsData) {
          const minRating = 800 + (Number(params.level) - 1) * 400
          const maxRating = minRating + 400

          const filteredProblems = problemsData
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

          setAllProblems(filteredProblems)
          setProblems(getRandomProblems(filteredProblems))
        }
      } catch (error) {
        console.error("Error fetching problems:", error)
        setProblems([])
      }
      setIsLoading(false)
    }

    fetchProblems()
  }, [params.level, getRandomProblems])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return <Contest level={params.level} problems={problems} onReroll={handleReroll} />
}

