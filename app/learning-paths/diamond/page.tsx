"use client";

import { DivisionDetails } from "@/components/DivisionDetails"

const diamondTopics = [
  {
    title: "Range Queries",
    description: "Advanced techniques for efficient range queries.",
    subtopics: [
      {
        title: "More Applications of Segment Tree",
        description: "Walking on a Segment Tree, Non-Commutative Combiner Functions",
        frequency: "Somewhat Frequent",
      },
      {
        title: "Range Queries with Sweep Line",
        description: "Solving 2D grid problems using 1D range queries.",
        frequency: "Not Frequent",
      },
      {
        title: "Range Update Range Query",
        description: "Lazy updates on segment trees and two binary indexed trees in conjunction.",
        frequency: "Rare",
      },
      {
        title: "Sparse Segment Trees",
        description: "Querying big ranges.",
        frequency: "Rare",
      },
      {
        title: "2D Range Queries",
        description: "Extending Range Queries to 2D (and beyond).",
        frequency: "Rare",
      },
      {
        title: "Divide & Conquer - SRQ",
        description: "Using Divide & Conquer to answer offline or online range queries on a static array.",
        frequency: "Rare",
      },
      {
        title: "Square Root Decomposition",
        description: "Splitting up data into smaller chunks to speed up processing.",
        frequency: "Rare",
      },
    ],
  },
  {
    title: "Trees",
    description: "Advanced tree algorithms and techniques.",
    subtopics: [
      {
        title: "Binary Jumping",
        description: "Efficiently finding ancestors of a node.",
        frequency: "Somewhat Frequent",
      },
      {
        title: "Small-To-Large Merging",
        description: "A way to merge two sets efficiently.",
        frequency: "Rare",
      },
      {
        title: "Heavy-Light Decomposition",
        description: "Path and subtree updates and queries.",
        frequency: "Rare",
      },
      {
        title: "Centroid Decomposition",
        description: "Decomposing a tree to facilitate path computations.",
        frequency: "Rare",
      },
    ],
  },
  {
    title: "Geometry",
    description: "Advanced geometric algorithms and concepts.",
    subtopics: [
      {
        title: "Geometry Primitives",
        description: "Basic setup for geometry problems.",
        frequency: "Rare",
      },
      {
        title: "Sweep Line",
        description: "Introduction to line sweep.",
        frequency: "Rare",
      },
      {
        title: "Convex Hull",
        description: "Smallest convex polygon containing a set of points on a grid.",
        frequency: "Not Frequent",
      },
      {
        title: "Convex Hull Trick",
        description: "A way to find the maximum or minimum value of several convex functions at given points.",
        frequency: "Not Frequent",
      },
    ],
  },
  {
    title: "Misc. Topics",
    description: "Various advanced topics in competitive programming.",
    subtopics: [
      {
        title: "Inclusion-Exclusion Principle",
        description:
          "The inclusion-exclusion principle is a counting technique that generalizes the formula for computing the size of union of n finite sets.",
        frequency: "Rare",
      },
      {
        title: "Matrix Exponentiation",
        description: "Repeatedly multiplying a square matrix by itself.",
        frequency: "Rare",
      },
      {
        title: "(Optional) Bitsets",
        description: "Examples of how bitsets give some unintended solutions on recent USACO problems.",
        frequency: "Rare",
      },
      {
        title: "Divide & Conquer - DP",
        description: "Using Divide & Conquer as a DP Optimization.",
        frequency: "Rare",
      },
      {
        title: "Sum over Subsets DP",
        description: "Taking bitmask DP to the next level.",
        frequency: "Not Frequent",
      },
    ],
  },
]

export default function DiamondPage() {
  return (
    <DivisionDetails
      name="Diamond"
      color="bg-purple-500"
      description="Tackle the most challenging competitive programming problems."
      topics={diamondTopics}
      progress={0}
    />
  )
}
