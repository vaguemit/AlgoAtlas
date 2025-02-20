"use client";

import { DivisionDetails } from "@/components/DivisionDetails"

const rubyTopics = [
  {
    title: "Math",
    description: "Mathematical concepts and techniques for competitive programming.",
    subtopics: [
      {
        title: "Divisibility",
        description: "Using the information that one integer evenly divides another.",
        frequency: "Rare",
        url: "https://www.geeksforgeeks.org/divisibility-rules-for-competitive-programming/",
      },
      {
        title: "Modular Arithmetic",
        description: "Working with remainders from division.",
        frequency: "Not Frequent",
        url: "https://cp-algorithms.com/algebra/module-inverse.html",
      },
      {
        title: "Combinatorics",
        description: "How to count.",
        frequency: "Not Frequent",
        url: "https://usaco.guide/bronze/intro-comb",
      },
    ],
  },
  {
    title: "Dynamic Programming",
    description: "Advanced DP techniques and problem types.",
    subtopics: [
      {
        title: "Introduction to DP",
        description: "Speeding up naive recursive solutions with memoization.",
        frequency: "Very Frequent",
        url: "https://www.geeksforgeeks.org/dynamic-programming/",
      },
      {
        title: "Knapsack DP",
        description: "Problems that can be modeled as filling a limited-size container with items.",
        frequency: "Not Frequent",
        url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
      },
      {
        title: "Paths on Grids",
        description:
          'Counting the number of "special" paths on a grid, and how some string problems can be solved using grids.',
        frequency: "Not Frequent",
        url: "https://cp-algorithms.com/dynamic_programming/grid-problems.html",
      },
      {
        title: "Longest Increasing Subsequence",
        description: "Finding and using the longest increasing subsequence of an array.",
        frequency: "Has Not Appeared",
        url: "https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/",
      },
      {
        title: "Bitmask DP",
        description: "DP problems that require iterating over subsets.",
        frequency: "Not Frequent",
        url: "https://cp-algorithms.com/algebra/all-submasks.html",
      },
      {
        title: "Range DP",
        description: "Solving a DP problem on every contiguous subarray of the original array.",
        frequency: "Rare",
        url: "https://usaco.guide/plat/range-dp",
      },
      {
        title: "Digit DP",
        description: "Finding the number of integers in a range that have a property.",
        frequency: "Rare",
        url: "https://codeforces.com/blog/entry/53960",
      },
    ],
  },
  {
    title: "Graphs",
    description: "Advanced graph algorithms and concepts.",
    subtopics: [
      {
        title: "Shortest Paths with Unweighted Edges",
        description: "Introduces how BFS can be used to find shortest paths in unweighted graphs.",
        frequency: "Not Frequent",
        url: "https://www.geeksforgeeks.org/shortest-path-unweighted-graph/",
      },
      {
        title: "Disjoint Set Union",
        description:
          "The Disjoint Set Union (DSU) data structure, which allows you to add edges to a graph and test whether two vertices of the graph are connected.",
        frequency: "Somewhat Frequent",
        url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
      },
      {
        title: "Topological Sort",
        description:
          "Ordering the vertices of a directed acyclic graph such that each vertex is visited before its children.",
        frequency: "Rare",
        url: "https://www.geeksforgeeks.org/topological-sorting/",
      },
      {
        title: "Shortest Paths with Non-Negative Edge Weights",
        description: "Bellman-Ford, Floyd-Warshall, and Dijkstra.",
        frequency: "Not Frequent",
        url: "https://cp-algorithms.com/graph/shortest-paths.html",
      },
      {
        title: "Minimum Spanning Trees",
        description:
          "Finding a subset of the edges of a connected, undirected, edge-weighted graph that connects all the vertices to each other of minimum total weight.",
        frequency: "Not Frequent",
        url: "https://www.geeksforgeeks.org/minimum-spanning-tree/",
      },
    ],
  },
  {
    title: "Data Structures",
    description: "Advanced data structures for efficient problem-solving.",
    subtopics: [
      {
        title: "Stacks",
        description: "A data structure that only allows insertion and deletion at one end.",
        frequency: "Rare",
        url: "https://www.geeksforgeeks.org/stack-data-structure/",
      },
      {
        title: "Sliding Window",
        description: "Maintaining data over consecutive subarrays.",
        frequency: "Not Frequent",
        url: "https://cp-algorithms.com/data_structures/sliding_window_minimum.html",
      },
      {
        title: "Point Update Range Sum",
        description: "Segment Tree, Binary Indexed Tree, and Order Statistic Tree (in C++).",
        frequency: "Somewhat Frequent",
        url: "https://usaco.guide/gold/prefix-sums",
      },
    ],
  },
  {
    title: "Trees",
    description: "Advanced tree algorithms and techniques.",
    subtopics: [
      {
        title: "Euler Tour Technique",
        description: "Flattening a tree into an array to easily query and update subtrees.",
        frequency: "Not Frequent",
        url: "https://cp-algorithms.com/graph/euler_tour.html",
      },
      {
        title: "DP on Trees - Introduction",
        description: "Using subtrees as subproblems.",
        frequency: "Not Frequent",
        url: "https://usaco.guide/plat/tree-dp",
      },
      {
        title: "DP on Trees - Solving For All Roots",
        description: "Tree DP problems involving rerooting.",
        frequency: "Rare",
        url: "https://codeforces.com/blog/entry/20935",
      },
    ],
  },
  {
    title: "Additional Topics",
    description: "Miscellaneous advanced topics.",
    subtopics: [
      {
        title: "Hashing",
        description: "Quickly testing equality of substrings or sets with a small probability of failure.",
        frequency: "Rare",
        url: "https://www.geeksforgeeks.org/hashing-in-competitive-programming/",
      },
      {
        title: "(Optional) Hashmaps",
        description: "Maintaining collections of distinct elements with hashing.",
        frequency: "Rare",
        url: "https://www.geeksforgeeks.org/hashing-data-structure/",
      },
      {
        title: "Meet In The Middle",
        description: "Problems involving dividing the search space into two.",
        frequency: "Rare",
        url: "https://www.geeksforgeeks.org/meet-in-the-middle/",
      },
    ],
  },
]

export default function RubyPage() {
  return (
    <DivisionDetails
      name="Ruby"
      color="bg-red-500"
      description="Master complex algorithms and optimization techniques."
      topics={rubyTopics}
      progress={0}
    />
  )
}

