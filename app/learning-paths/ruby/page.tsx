"use client"
import { DivisionDetails } from "../../../components/DivisionDetails"
import { useState, useEffect } from "react"

type Status = "not-started" | "reading" | "practicing" | "complete" | "skipped" | "ignored"

const rubyTopics = [
  {
    title: "Data Structures",
    description: "Advanced data structures for complex problem-solving.",
    url: "https://usaco.guide/plat/data-structures",
    subtopics: [
      {
        title: "Max Suffix Query with Insertions Only",
        description: "A solution to USACO Gold - Springboards.",
        url: "https://usaco.guide/problems/usaco-1066-springboards/solution",
        progress: "not-started" as Status
      },
      {
        title: "Wavelet Tree",
        description: "Advanced tree data structure for various range queries.",
        url: "https://www.geeksforgeeks.org/wavelet-trees-introduction/",
        progress: "not-started" as Status
      },
      {
        title: "Counting Minimums with Segment Tree",
        description: "Querying for the minimum and number of occurrences of minimum in a range",
        url: "https://codeforces.com/blog/entry/57319",
        progress: "not-started" as Status
      },
      {
        title: "Segment Tree Beats",
        description: "Perform chmin and chmax range updates",
        url: "https://codeforces.com/blog/entry/57319",
        progress: "not-started" as Status
      },
      {
        title: "Persistent Data Structures",
        description: "What if data structures could time travel?",
        url: "https://www.geeksforgeeks.org/persistent-data-structures/",
        progress: "not-started" as Status
      },
      {
        title: "Treaps",
        description: "A randomized binary search tree",
        url: "https://www.geeksforgeeks.org/treap-a-randomized-binary-search-tree/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Convexity",
    description: "Advanced techniques related to convex functions and optimization.",
    url: "https://usaco.guide/plat/convexity",
    subtopics: [
      {
        title: "LineContainer",
        description: "Convex Containers",
        url: "https://codeforces.com/blog/entry/63823",
      },
      {
        title: "Lagrangian Relaxation",
        description: "aka Aliens Trick",
        url: "https://codeforces.com/blog/entry/78504",
      },
      {
        title: "Slope Trick",
        description: "Slope trick refers to a way to manipulate piecewise linear convex functions. Includes a simple solution to USACO Landscaping.",
        url: "https://codeforces.com/blog/entry/47821",
      },
    ],
  },
  {
    title: "Graphs",
    description: "Advanced graph algorithms and concepts.",
    url: "https://usaco.guide/plat/graphs",
    subtopics: [
      {
        title: "Shortest Paths with Negative Edge Weights",
        description: "Returning to Bellman-Ford and Floyd-Warshall.",
        url: "https://www.geeksforgeeks.org/detect-negative-cycle-graph-bellman-ford/",
        progress: "not-started" as Status
      },
      {
        title: "Eulerian Tours",
        description: "Visiting all edges of a graph exactly once.",
        url: "https://www.geeksforgeeks.org/eulerian-path-and-circuit/",
        progress: "not-started" as Status
      },
      {
        title: "BCCs and 2CCs",
        description: "Biconnected Components and 2-Connected Components",
        url: "https://www.geeksforgeeks.org/biconnected-components/",
        progress: "not-started" as Status
      },
      {
        title: "Strongly Connected Components",
        description: "Subsets of nodes in directed graphs where each node in a subset can reach each other node in the subset.",
        url: "https://www.geeksforgeeks.org/strongly-connected-components/",
        progress: "not-started" as Status
      },
      {
        title: "Offline Deletion",
        description: "Erasing from non-amortized insert-only data structures.",
        url: "https://codeforces.com/blog/entry/15296",
        progress: "not-started" as Status
      },
      {
        title: "Euler's Formula",
        description: "A formula for finding the number of faces in a planar graph.",
        url: "https://www.geeksforgeeks.org/eulers-formula-and-eulers-identity/",
        progress: "not-started" as Status
      },
      {
        title: "Critical",
        description: "Finding nodes that must be visited along any path.",
        url: "https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/",
        progress: "not-started" as Status
      },
      {
        title: "Link Cut Tree",
        description: "Dynamic operations on a rooted forest",
        url: "https://www.geeksforgeeks.org/link-cut-tree/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Dynamic Programming",
    description: "Advanced DP techniques and optimizations.",
    url: "https://usaco.guide/plat/dp",
    subtopics: [
      {
        title: "DP on Trees - Combining Subtrees",
        description: "Advanced tree DP techniques",
        url: "https://codeforces.com/blog/entry/20935",
        progress: "not-started" as Status
      },
      {
        title: "Additional DP Optimizations and Techniques",
        description: "Additional dynamic programming techniques and optimizations like Knuth's optimization.",
        url: "https://www.geeksforgeeks.org/knuths-optimization-in-dynamic-programming/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Flows",
    description: "Advanced flow algorithms and concepts.",
    url: "https://usaco.guide/plat/flows",
    subtopics: [
      {
        title: "Maximum Flow",
        description: "Introduces maximum flow as well as flow with lower bounds.",
        url: "https://www.geeksforgeeks.org/maximum-flow-problem-introduction/",
        progress: "not-started" as Status
      },
      {
        title: "Minimum Cut",
        description: "Finding the minimum cut in a flow network",
        url: "https://www.geeksforgeeks.org/minimum-cut-in-a-directed-graph/",
        progress: "not-started" as Status
      },
      {
        title: "Flow with Lower Bounds",
        description: "Flow algorithms with lower bound constraints",
        url: "https://codeforces.com/blog/entry/104960",
        progress: "not-started" as Status
      },
      {
        title: "Minimum Cost Flow",
        description: "Triangle Inequality, Johnson's Algorithm, and Min Cost Flow",
        url: "https://www.geeksforgeeks.org/minimum-cost-maximum-flow-from-a-graph-using-bellman-ford-algorithm/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Polynomials",
    description: "Advanced techniques for polynomial manipulation.",
    url: "https://usaco.guide/plat/polynomials",
    subtopics: [
      {
        title: "Introduction to Fast Fourier Transform",
        description: "Quickly multiplying polynomials",
        url: "https://www.geeksforgeeks.org/fast-fourier-transformation-poynomial-multiplication/",
        progress: "not-started" as Status
      },
      {
        title: "More Complex Operations Using FFT",
        description: "Advanced applications of Fast Fourier Transform",
        url: "https://codeforces.com/blog/entry/43499",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Strings",
    description: "Advanced string algorithms and data structures.",
    url: "https://usaco.guide/plat/strings",
    subtopics: [
      {
        title: "String Searching",
        description: "Knuth-Morris-Pratt and Z Algorithms (and a few more related topics).",
        url: "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/",
        progress: "not-started" as Status
      },
      {
        title: "Suffix Array",
        description: "Quickly sorting suffixes of a string and its applications",
        url: "https://www.geeksforgeeks.org/suffix-array-set-1-introduction/",
        progress: "not-started" as Status
      },
      {
        title: "String Suffix Structures",
        description: "Suffix Automata, Suffix Trees, and Palindromic Trees",
        url: "https://www.geeksforgeeks.org/suffix-tree-application-5-longest-common-substring-2/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Misc. Topics",
    description: "Various advanced topics in competitive programming.",
    url: "https://usaco.guide/plat/math",
    subtopics: [
      {
        title: "Extended Euclidean Algorithm",
        description: "Advanced applications of the Euclidean algorithm",
        url: "https://www.geeksforgeeks.org/euclidean-algorithms-basic-and-extended/",
        progress: "not-started" as Status
      },
      {
        title: "Catalan Numbers",
        description: "Applications and properties of Catalan numbers",
        url: "https://www.geeksforgeeks.org/program-nth-catalan-number/",
        progress: "not-started" as Status
      },
      {
        title: "XOR Basis",
        description: "Advanced techniques using XOR operations",
        url: "https://codeforces.com/blog/entry/68953",
        progress: "not-started" as Status
      },
      {
        title: "Fracturing Search",
        description: 'A simple solution to "Robotic Cow Herd" that generalizes.',
        url: "https://usaco.guide/problems/usaco-1184-robotic-cow-herd/solution",
        progress: "not-started" as Status
      },
      {
        title: "Game Theory",
        description: "Solving games that are usually two-player to find the winner.",
        url: "https://www.geeksforgeeks.org/introduction-to-game-theory/",
        progress: "not-started" as Status
      },
      {
        title: "Prefix Sums of Multiplicative Functions",
        description: "Covering Dirichlet convolution, Möbius inversion, and binomial inversion.",
        url: "https://codeforces.com/blog/entry/53925",
        progress: "not-started" as Status
      },
      {
        title: "Matroid Intersection",
        description: "Advanced combinatorial optimization technique",
        url: "https://codeforces.com/blog/entry/69287",
        progress: "not-started" as Status
      },
      {
        title: "Interactive and Communication Problems",
        description: "Some tips and tricks",
        url: "https://codeforces.com/blog/entry/45307",
        progress: "not-started" as Status
      },
      {
        title: "Vectorization in C++",
        description: "Optimizing C++ code using vectorization techniques",
        url: "https://www.geeksforgeeks.org/vectorization-python/",
        progress: "not-started" as Status
      },
    ],
  },
]

export default function RubyPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate initial progress from localStorage
    if (typeof window !== "undefined") {
      const topicProgress = localStorage.getItem("ruby-topic-progress")
      const subtopicProgress = localStorage.getItem("ruby-subtopic-progress")
      
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
      name="Ruby"
      color="bg-red-500"
      description="Advanced algorithms and techniques for competitive programming."
      topics={rubyTopics}
      progress={progress}
    />
  )
} 