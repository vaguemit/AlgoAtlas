"use client"
import { DivisionDetails } from "../../../components/DivisionDetails"
import { useState, useEffect } from "react"

type Status = "not-started" | "reading" | "practicing" | "complete" | "skipped" | "ignored"

const amethystTopics = [
  {
    title: "Range Queries",
    description: "Advanced techniques for handling range queries.",
    url: "https://usaco.guide/plat/range-queries",
    subtopics: [
      {
        title: "Segment Trees",
        description: "A versatile data structure for range queries and updates.",
        url: "https://www.geeksforgeeks.org/segment-tree-set-1-sum-of-given-range/",
        progress: "not-started" as Status
      },
      {
        title: "Binary Indexed Trees",
        description: "Efficient data structure for prefix sum queries.",
        url: "https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/",
        progress: "not-started" as Status
      },
      {
        title: "Sparse Tables",
        description: "Static data structure for range minimum queries.",
        url: "https://www.geeksforgeeks.org/sparse-table/",
        progress: "not-started" as Status
      },
      {
        title: "Mo's Algorithm",
        description: "Offline algorithm for range queries.",
        url: "https://www.geeksforgeeks.org/mos-algorithm-query-square-root-decomposition-set-1-introduction/",
        progress: "not-started" as Status
      }
    ]
  },
  {
    title: "Misc. Topics",
    description: "Various advanced topics in competitive programming.",
    url: "https://usaco.guide/plat/misc",
    subtopics: [
      {
        title: "Bit Manipulation",
        description: "Advanced techniques using bitwise operations.",
        url: "https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/",
        progress: "not-started" as Status
      },
      {
        title: "Number Theory",
        description: "Advanced mathematical concepts and algorithms.",
        url: "https://www.geeksforgeeks.org/number-theory-competitive-programming/",
        progress: "not-started" as Status
      },
      {
        title: "Geometry",
        description: "Computational geometry algorithms and techniques.",
        url: "https://www.geeksforgeeks.org/geometric-algorithms/",
        progress: "not-started" as Status
      },
      {
        title: "Game Theory",
        description: "Solving games and strategic problems.",
        url: "https://www.geeksforgeeks.org/game-theory/",
        progress: "not-started" as Status
      }
    ]
  }
]

export default function AmethystPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate initial progress from localStorage
    if (typeof window !== "undefined") {
      const topicProgress = localStorage.getItem("amethyst-topic-progress")
      const subtopicProgress = localStorage.getItem("amethyst-subtopic-progress")
      
      let total = 0
      let completed = 0
      
      if (topicProgress) {
        const topics = JSON.parse(topicProgress) as Record<string, Status>
        Object.values(topics).forEach((status) => {
          total++
          if (status === "complete") completed++
        })
      }
      
      if (subtopicProgress) {
        const subtopics = JSON.parse(subtopicProgress) as Record<string, Status>
        Object.values(subtopics).forEach((status) => {
          total++
          if (status === "complete") completed++
        })
      }
      
      if (total > 0) {
        setProgress(Math.round((completed / total) * 100))
      }
    }
  }, [])

  return (
    <DivisionDetails
      name="Amethyst"
      color="bg-purple-500"
      description="Advanced topics and techniques for competitive programming."
      topics={amethystTopics}
      progress={progress}
    />
  )
} 