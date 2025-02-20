"use client";

import { DivisionDetails } from "@/components/DivisionDetails"

const sapphireTopics = [
  {
    title: "Prefix Sums",
    description: "Efficient techniques for range sum queries and more.",
    subtopics: [
      {
        title: "Introduction to Prefix Sums",
        description: "Computing range sum queries in constant time over a fixed 1D array.",
        frequency: "Somewhat Frequent",
        url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/",
      },
      {
        title: "More on Prefix Sums",
        description: "Max subarray sum, prefix sums in two dimensions, and a more complicated example.",
        frequency: "Not Frequent",
        url: "https://www.youtube.com/watch?v=PhgtNY_-CiY",
      },
    ],
  },
  {
    title: "Sorting & Searching",
    description: "Advanced sorting techniques and searching algorithms.",
    subtopics: [
      {
        title: "Custom Comparators and Coordinate Compression",
        description:
          "Using a custom comparator to sort custom objects or values in a non-default order, and compressing values from a large range to a smaller one.",
        frequency: "Somewhat Frequent",
        url: "https://www.cs.cmu.edu/~clo/www/CMU/DataStructures/Lessons/lesson8_2.htm",
      },
      {
        title: "Two Pointers",
        description:
          "Iterating two monotonic pointers across an array to search for a pair of indices satisfying some condition in linear time.",
        frequency: "Not Frequent",
        url: "https://www.geeksforgeeks.org/two-pointers-technique/",
      },
      {
        title: "More Operations on Sorted Sets",
        description:
          "Finding the next element smaller or larger than a specified key in a set, and using iterators with sets.",
        frequency: "Not Frequent",
        url: "https://www.geeksforgeeks.org/ordered-set-gnu-c-pbds/",
      },
      {
        title: "(Optional) C++ Sets with Custom Comparators",
        description: "Incorporating custom comparators into standard library containers.",
        frequency: "Rare",
        url: "https://www.geeksforgeeks.org/stl-set-custom-comparator-c/",
      },
      {
        title: "Greedy Algorithms with Sorting",
        description: "Solving greedy problems by sorting the input.",
        frequency: "Somewhat Frequent",
        url: "https://www.hackerearth.com/practice/algorithms/greedy/basics-of-greedy-algorithms/tutorial/",
      },
      {
        title: "Binary Search",
        description: "Binary searching on arbitrary monotonic functions and built-in functions for binary search.",
        frequency: "Somewhat Frequent",
        url: "https://www.topcoder.com/thrive/articles/Binary%20Search",
      },
    ],
  },
  {
    title: "Graphs",
    description: "Fundamental graph algorithms and concepts.",
    subtopics: [
      {
        title: "Graph Traversal",
        description: "Traversing a graph with depth first search and breadth first search.",
        frequency: "Very Frequent",
        url: "https://www.geeksforgeeks.org/graph-and-its-representations/",
      },
      {
        title: "Flood Fill",
        description: "Finding connected components in a graph represented by a grid.",
        frequency: "Somewhat Frequent",
        url: "https://www.geeksforgeeks.org/flood-fill-algorithm-implement-fill-paint/",
      },
      {
        title: "Introduction to Tree Algorithms",
        description: "Introducing a special type of graph: trees.",
        frequency: "Not Frequent",
        url: "https://www.hackerearth.com/practice/data-structures/trees/binary-and-nary-trees/tutorial/",
      },
      {
        title: "Introduction to Functional Graphs",
        description: "Directed graphs in which every vertex has exactly one outgoing edge.",
        frequency: "Not Frequent",
        url: "https://en.wikipedia.org/wiki/Functional_graph",
      },
    ],
  },
  {
    title: "Additional Topics",
    description: "Miscellaneous advanced topics.",
    subtopics: [
      {
        title: "Intro to Bitwise Operators",
        description: "Six bitwise operators and the common ways they are used.",
        frequency: "Somewhat Frequent",
        url: "https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/",
      },
    ],
  },
]

export default function SapphirePage() {
  return (
    <DivisionDetails
      name="Sapphire"
      color="bg-blue-500"
      description="Dive deeper into advanced algorithms and data structures."
      topics={sapphireTopics}
      progress={0}
    />
  )
}
