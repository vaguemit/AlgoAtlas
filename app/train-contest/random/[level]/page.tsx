"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Contest } from "@/components/Contest"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function RandomContest() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [contestData, setContestData] = useState(null)

  useEffect(() => {
    const fetchContestData = async () => {
      // In a real application, you'd fetch the contest data from your API
      // This is a mock implementation
      setContestData({
        level: params.level,
        problems: [
          { id: "1", title: "Random Problem 1", difficulty: Number(params.level) * 100, solved: false },
          { id: "2", title: "Random Problem 2", difficulty: Number(params.level) * 100 + 200, solved: false },
          { id: "3", title: "Random Problem 3", difficulty: Number(params.level) * 100 + 400, solved: false },
          { id: "4", title: "Random Problem 4", difficulty: Number(params.level) * 100 + 600, solved: false },
        ],
      })
      setIsLoading(false)
    }

    fetchContestData()
  }, [params.level])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return <Contest {...contestData} isRandom={true} />
}

