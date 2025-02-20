"use client";

import { DivisionDetails } from "@/components/DivisionDetails"

const advancedTopics = [
  {
    title: "Data Structures",
    description: "Advanced data structures for complex problem-solving.",
    subtopics: [
      {
        title: "Max Suffix Query with Insertions Only",
        description: "A solution to USACO Gold - Springboards.",
        frequency: "Rare",
      },
      {
        title: "Wavelet Tree",
        description: "Advanced tree data structure for various range queries.",
        frequency: "Has Not Appeared",
      },
      {
        title: "Counting Minimums with Segment Tree",
        description: "Querying for the minimum and number of occurrences of minimum in a range",
        frequency: "Has Not Appeared",
      },
      {
        title: "Segment Tree Beats",
        description: "Perform chmin and chmax range updates",
        frequency: "Rare",
      },
      {
        title: "Persistent Data Structures",
        description: "What if data structures could time travel?",
        frequency: "Rare",
      },
      {
        title: "Treaps",
        description: "A randomized binary search tree",
        frequency: "Not Frequent",
      },
    ],
  },
  {
    title: "Convexity",
    description: "Advanced techniques related to convex functions and optimization.",
    subtopics: [
      {
        title: "LineContainer",
        description: "Convex Containers",
        frequency: "Rare",
      },
      {
        title: "Lagrangian Relaxation",
        description: "aka Aliens Trick",
        frequency: "Rare",
      },
      {
        title: "Slope Trick",
        description:
          "Slope trick refers to a way to manipulate piecewise linear convex functions. Includes a simple solution to USACO Landscaping.",
        frequency: "Rare",
      },
    ],
  },
  {
    title: "Graphs",
    description: "Advanced graph algorithms and concepts.",
    subtopics: [
      {
        title: "Shortest Paths with Negative Edge Weights",
        description: "Returning to Bellman-Ford and Floyd-Warshall.",
        frequency: "Has Not Appeared",
      },
      {
        title: "Eulerian Tours",
        description: "Visiting all edges of a graph exactly once.",
        frequency: "Has Not Appeared",
      },
      {
        title: "BCCs and 2CCs",
        description: "Biconnected Components and 2-Connected Components",
        frequency: "Rare",
      },
      {
        title: "Strongly Connected Components",
        description:
          "Subsets of nodes in directed graphs where each node in a subset can reach each other node in the subset.",
        frequency: "Rare",
      },
      {
        title: "Offline Deletion",
        description: "Erasing from non-amortized insert-only data structures.",
        frequency: "Has Not Appeared",
      },
      {
        title: "Euler's Formula",
        description: "A formula for finding the number of faces in a planar graph.",
        frequency: "Rare",
      },
      {
        title: "Critical",
        description: "Finding nodes that must be visited along any path.",
        frequency: "Rare",
      },
      {
        title: "Link Cut Tree",
        description: "Dynamic operations on a rooted forest",
        frequency: "Rare",
      },
    ],
  },
  {
    title: "Dynamic Programming",
    description: "Advanced DP techniques and optimizations.",
    subtopics: [
      {
        title: "DP on Trees - Combining Subtrees",
        description: "Advanced tree DP techniques",
        frequency: "Rare",
      },
      {
        title: "Additional DP Optimizations and Techniques",
        description: "Additional dynamic programming techniques and optimizations like Knuth's optimization.",
        frequency: "Rare",
      },
    ],
  },
  {
    title: "Flows",
    description: "Advanced flow algorithms and concepts.",
    subtopics: [
      {
        title: "Maximum Flow",
        description: "Introduces maximum flow as well as flow with lower bounds.",
        frequency: "Rare",
      },
      {
        title: "Minimum Cut",
        description: "Finding the minimum cut in a flow network",
        frequency: "Rare",
      },
      {
        title: "Flow with Lower Bounds",
        description: "Flow algorithms with lower bound constraints",
        frequency: "Has Not Appeared",
      },
      {
        title: "Minimum Cost Flow",
        description: "Triangle Inequality, Johnson's Algorithm, and Min Cost Flow",
        frequency: "Rare",
      },
    ],
  },
  {
    title: "Polynomials",
    description: "Advanced techniques for polynomial manipulation.",
    subtopics: [
      {
        title: "Introduction to Fast Fourier Transform",
        description: "Quickly multiplying polynomials",
        frequency: "Has Not Appeared",
      },
      {
        title: "More Complex Operations Using FFT",
        description: "Advanced applications of Fast Fourier Transform",
        frequency: "Has Not Appeared",
      },
    ],
  },
  {
    title: "Strings",
    description: "Advanced string algorithms and data structures.",
    subtopics: [
      {
        title: "String Searching",
        description: "Knuth-Morris-Pratt and Z Algorithms (and a few more related topics).",
        frequency: "Rare",
      },
      {
        title: "Suffix Array",
        description: "Quickly sorting suffixes of a string and its applications",
        frequency: "Rare",
      },
      {
        title: "String Suffix Structures",
        description: "Suffix Automata, Suffix Trees, and Palindromic Trees",
        frequency: "Has Not Appeared",
      },
    ],
  },
  {
    title: "Misc. Topics",
    description: "Various advanced topics in competitive programming.",
    subtopics: [
      {
        title: "Extended Euclidean Algorithm",
        description: "Advanced applications of the Euclidean algorithm",
        frequency: "Rare",
      },
      {
        title: "Catalan Numbers",
        description: "Applications and properties of Catalan numbers",
        frequency: "Rare",
      },
      {
        title: "XOR Basis",
        description: "Advanced techniques using XOR operations",
        frequency: "Rare",
      },
      {
        title: "Fracturing Search",
        description: 'A simple solution to "Robotic Cow Herd" that generalizes.',
        frequency: "Rare",
      },
      {
        title: "Game Theory",
        description: "Solving games that are usually two-player to find the winner.",
        frequency: "Has Not Appeared",
      },
      {
        title: "Prefix Sums of Multiplicative Functions",
        description: "Covering Dirichlet convolution, Möbius inversion, and binomial inversion.",
        frequency: "Has Not Appeared",
      },
      {
        title: "Matroid Intersection",
        description: "Advanced combinatorial optimization technique",
        frequency: "Has Not Appeared",
      },
      {
        title: "Interactive and Communication Problems",
        description: "Some tips and tricks",
        frequency: "Rare",
      },
      {
        title: "Vectorization in C++",
        description: "Optimizing C++ code using vectorization techniques",
        frequency: "Has Not Appeared",
      },
    ],
  },
]

export default function AdvancedPage() {
  return (
    <DivisionDetails
      name="Advanced"
      color="bg-red-700"
      description="Master the most advanced competitive programming techniques and algorithms."
      topics={advancedTopics}
      progress={0}
    />
  )
}
