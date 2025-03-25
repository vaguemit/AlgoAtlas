"use client"
import { DivisionDetails } from "../../../components/DivisionDetails"
import { useState, useEffect } from "react"

type Status = "not-started" | "reading" | "practicing" | "complete" | "skipped" | "ignored"

const emeraldTopics = [
  {
    title: "Prefix Sums",
    description: "Efficient techniques for range sum queries and more.",
    url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/",
    subtopics: [
      {
        title: "Introduction to Prefix Sums",
        description: "Computing range sum queries in constant time over a fixed 1D array.",
        url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/",
        progress: "not-started" as Status
      },
      {
        title: "More on Prefix Sums",
        description: "Max subarray sum, prefix sums in two dimensions, and a more complicated example.",
        url: "https://www.youtube.com/watch?v=PhgtNY_-CiY",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Sorting & Searching",
    description: "Advanced sorting and searching techniques.",
    url: "https://www.geeksforgeeks.org/sorting-algorithms/",
    subtopics: [
      {
        title: "Binary Search",
        description: "Finding elements in sorted arrays efficiently.",
        url: "https://www.geeksforgeeks.org/binary-search/",
        progress: "not-started" as Status
      },
      {
        title: "Two Pointers",
        description: "Using two pointers to solve array problems.",
        url: "https://www.geeksforgeeks.org/two-pointers-technique/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Graphs",
    description: "Graph algorithms and traversal techniques.",
    url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
    subtopics: [
      {
        title: "Graph Representation",
        description: "Different ways to represent graphs in code.",
        url: "https://www.geeksforgeeks.org/graph-and-its-representations/",
        progress: "not-started" as Status
      },
      {
        title: "Graph Traversal",
        description: "DFS and BFS algorithms.",
        url: "https://www.geeksforgeeks.org/graph-traversals-bfs-and-dfs/",
        progress: "not-started" as Status
      },
      {
        title: "Shortest Paths",
        description: "Finding shortest paths in weighted graphs.",
        url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Additional Topics",
    description: "Miscellaneous advanced topics.",
    url: "https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/",
    subtopics: [
      {
        title: "Intro to Bitwise Operators",
        description: "Six bitwise operators and the common ways they are used.",
        url: "https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/",
        progress: "not-started" as Status
      },
    ],
  },
]

export default function EmeraldPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate initial progress from localStorage
    if (typeof window !== "undefined") {
      const topicProgress = localStorage.getItem("emerald-topic-progress")
      const subtopicProgress = localStorage.getItem("emerald-subtopic-progress")
      
      let total = 0
      let completed = 0
      
      // Count total topics and subtopics
      emeraldTopics.forEach(topic => {
        total++ // Count the topic
        total += topic.subtopics.length // Count its subtopics
      })
      
      if (topicProgress) {
        const topics = JSON.parse(topicProgress) as Record<string, Status>
        Object.values(topics).forEach((status) => {
          if (status === "complete") completed++
        })
      }
      
      if (subtopicProgress) {
        const subtopics = JSON.parse(subtopicProgress) as Record<string, Status>
        Object.values(subtopics).forEach((status) => {
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
      name="Emerald"
      color="bg-green-500"
      description="Introduction to competitive programming with fundamental algorithms and data structures."
      topics={emeraldTopics}
      progress={progress}
    />
  )
} 