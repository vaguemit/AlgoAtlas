"use client"
import { DivisionDetails } from "../../../components/DivisionDetails"
import { useState, useEffect } from "react"
import { useLearningProgress, ProgressStatus } from "@/hooks/use-learning-progress"

type Status = "not-started" | "reading" | "practicing" | "complete" | "skipped" | "ignored"

const sapphireTopics = [
  {
    title: "Math",
    description: "Mathematical concepts and techniques for competitive programming.",
    url: "https://www.geeksforgeeks.org/divisibility-rules-for-competitive-programming/",
    subtopics: [
      {
        title: "Divisibility",
        description: "Using the information that one integer evenly divides another.",
        url: "https://www.geeksforgeeks.org/divisibility-rules-for-competitive-programming/",
        progress: "not-started" as Status
      },
      {
        title: "Modular Arithmetic",
        description: "Working with remainders from division.",
        url: "https://cp-algorithms.com/algebra/module-inverse.html",
        progress: "not-started" as Status
      },
      {
        title: "Combinatorics",
        description: "How to count.",
        url: "https://usaco.guide/bronze/intro-comb",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Dynamic Programming",
    description: "Advanced DP techniques and problem types.",
    url: "https://www.geeksforgeeks.org/dynamic-programming/",
    subtopics: [
      {
        title: "Introduction to DP",
        description: "Speeding up naive recursive solutions with memoization.",
        url: "https://www.geeksforgeeks.org/dynamic-programming/",
        progress: "not-started" as Status
      },
      {
        title: "Knapsack DP",
        description: "Problems that can be modeled as filling a limited-size container with items.",
        url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
        progress: "not-started" as Status
      },
      {
        title: "Paths on Grids",
        description: "Counting the number of 'special' paths on a grid, and how some string problems can be solved using grids.",
        url: "https://cp-algorithms.com/dynamic_programming/grid-problems.html",
        progress: "not-started" as Status
      },
      {
        title: "Longest Increasing Subsequence",
        description: "Finding and using the longest increasing subsequence of an array.",
        url: "https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/",
        progress: "not-started" as Status
      },
      {
        title: "Bitmask DP",
        description: "DP problems that require iterating over subsets.",
        url: "https://cp-algorithms.com/algebra/all-submasks.html",
        progress: "not-started" as Status
      },
      {
        title: "Range DP",
        description: "Solving a DP problem on every contiguous subarray of the original array.",
        url: "https://usaco.guide/plat/range-dp",
        progress: "not-started" as Status
      },
      {
        title: "Digit DP",
        description: "Finding the number of integers in a range that have a property.",
        url: "https://codeforces.com/blog/entry/53960",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Graphs",
    description: "Advanced graph algorithms and concepts.",
    url: "https://www.geeksforgeeks.org/shortest-path-unweighted-graph/",
    subtopics: [
      {
        title: "Shortest Paths with Unweighted Edges",
        description: "Introduces how BFS can be used to find shortest paths in unweighted graphs.",
        url: "https://www.geeksforgeeks.org/shortest-path-unweighted-graph/",
        progress: "not-started" as Status
      },
      {
        title: "Disjoint Set Union",
        description: "The Disjoint Set Union (DSU) data structure, which allows you to add edges to a graph and test whether two vertices of the graph are connected.",
        url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
        progress: "not-started" as Status
      },
      {
        title: "Topological Sort",
        description: "Ordering the vertices of a directed acyclic graph such that each vertex is visited before its children.",
        url: "https://www.geeksforgeeks.org/topological-sorting/",
        progress: "not-started" as Status
      },
      {
        title: "Shortest Paths with Non-Negative Edge Weights",
        description: "Bellman-Ford, Floyd-Warshall, and Dijkstra.",
        url: "https://cp-algorithms.com/graph/shortest-paths.html",
        progress: "not-started" as Status
      },
      {
        title: "Minimum Spanning Trees",
        description: "Finding a subset of the edges of a connected, undirected, edge-weighted graph that connects all the vertices to each other of minimum total weight.",
        url: "https://www.geeksforgeeks.org/minimum-spanning-tree/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Data Structures",
    description: "Advanced data structures for efficient problem-solving.",
    url: "https://www.geeksforgeeks.org/stack-data-structure/",
    subtopics: [
      {
        title: "Stacks",
        description: "A data structure that only allows insertion and deletion at one end.",
        url: "https://www.geeksforgeeks.org/stack-data-structure/",
        progress: "not-started" as Status
      },
      {
        title: "Sliding Window",
        description: "Maintaining data over consecutive subarrays.",
        url: "https://cp-algorithms.com/data_structures/sliding_window_minimum.html",
        progress: "not-started" as Status
      },
      {
        title: "Point Update Range Sum",
        description: "Segment Tree, Binary Indexed Tree, and Order Statistic Tree (in C++).",
        url: "https://usaco.guide/gold/prefix-sums",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Trees",
    description: "Advanced tree algorithms and techniques.",
    url: "https://cp-algorithms.com/graph/euler_tour.html",
    subtopics: [
      {
        title: "Euler Tour Technique",
        description: "Flattening a tree into an array to easily query and update subtrees.",
        url: "https://cp-algorithms.com/graph/euler_tour.html",
        progress: "not-started" as Status
      },
      {
        title: "DP on Trees - Introduction",
        description: "Using subtrees as subproblems.",
        url: "https://usaco.guide/plat/tree-dp",
        progress: "not-started" as Status
      },
      {
        title: "DP on Trees - Solving For All Roots",
        description: "Tree DP problems involving rerooting.",
        url: "https://codeforces.com/blog/entry/20935",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Additional Topics",
    description: "Miscellaneous advanced topics.",
    url: "https://www.geeksforgeeks.org/hashing-in-competitive-programming/",
    subtopics: [
      {
        title: "Hashing",
        description: "Quickly testing equality of substrings or sets with a small probability of failure.",
        url: "https://www.geeksforgeeks.org/hashing-in-competitive-programming/",
        progress: "not-started" as Status
      },
      {
        title: "(Optional) Hashmaps",
        description: "Maintaining collections of distinct elements with hashing.",
        url: "https://www.geeksforgeeks.org/hashing-data-structure/",
        progress: "not-started" as Status
      },
      {
        title: "Meet In The Middle",
        description: "Problems involving dividing the search space into two.",
        url: "https://www.geeksforgeeks.org/meet-in-the-middle/",
        progress: "not-started" as Status
      },
    ],
  },
]

export default function SapphirePage() {
  const { completionPercentage, updateProgress, getStatusFor } = useLearningProgress({
    pathId: "sapphire",
    fallbackToLocalStorage: true
  })

  // Update topic status in the sapphireTopics data structure
  const updatedTopics = sapphireTopics.map(topic => {
    // Update the status of each subtopic
    const updatedSubtopics = topic.subtopics.map(subtopic => ({
      ...subtopic,
      progress: getStatusFor(topic.title, subtopic.title) as Status
    }))
    
    return {
      ...topic,
      subtopics: updatedSubtopics
    }
  })

  return (
    <DivisionDetails
      name="Sapphire"
      color="bg-blue-500"
      description="Intermediate algorithms and data structures for competitive programming."
      topics={updatedTopics}
      progress={completionPercentage}
      onProgressUpdate={(topicId, subtopicId, status) => {
        updateProgress(topicId, subtopicId, status as ProgressStatus)
      }}
    />
  )
} 