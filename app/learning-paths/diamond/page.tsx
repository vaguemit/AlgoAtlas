"use client"
import { DivisionDetails } from "../../../components/DivisionDetails"
import { useState, useEffect } from "react"

type Status = "not-started" | "reading" | "practicing" | "complete" | "skipped" | "ignored"

const diamondTopics = [
  {
    title: "Using This Guide",
    description: "How to effectively use this guide to maximize your productivity.",
    url: "https://www.geeksforgeeks.org/competitive-programming-a-complete-guide/",
    subtopics: [
      {
        title: "Getting Started",
        description: "First steps in competitive programming",
        url: "https://www.geeksforgeeks.org/how-to-begin-with-competitive-programming/",
        progress: "not-started" as Status
      },
      {
        title: "Study Plan",
        description: "Structured approach to learning",
        url: "https://www.geeksforgeeks.org/competitive-programming-cp-study-plan/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Introduction to Competitive Programming",
    description: "An overview of programming competitions and how to get started.",
    url: "https://cp-algorithms.com/",
    subtopics: [
      {
        title: "Basic Concepts",
        description: "Fundamental concepts in competitive programming",
        url: "https://cp-algorithms.com/algebra/binary-exp.html",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Choosing a Language",
    description: "Guidance on selecting the appropriate programming language for contests.",
    url: "https://codeforces.com/blog/entry/79",
    subtopics: [
      {
        title: "C++ for Competitive Programming",
        description: "Why C++ is popular in competitive programming",
        url: "https://www.geeksforgeeks.org/c-plus-plus-in-competitive-programming/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Resources: Learning to Code",
    description: "Comprehensive resources for learning how to code.",
    url: "https://www.codecademy.com/",
    subtopics: [
      {
        title: "Interactive C++ Course",
        description: "Learn C++ interactively",
        url: "https://www.codecademy.com/learn/learn-c-plus-plus",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Running Code Online",
    description: "Platforms and tools for executing your code online.",
    url: "https://www.onlinegdb.com/",
    subtopics: [
      {
        title: "Online Compilers",
        description: "Various online compilers and their features",
        url: "https://www.geeksforgeeks.org/online-compilation-execution-time-limit/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Data Types",
    description: "Understanding essential data types for competitive programming.",
    url: "https://www.w3schools.com/cpp/cpp_data_types.asp",
    subtopics: [
      {
        title: "C++ Data Types",
        description: "Detailed guide on C++ data types",
        url: "https://www.geeksforgeeks.org/c-data-types/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Input & Output",
    description: "Techniques for efficient input and output operations in contests.",
    url: "https://www.hackerearth.com/practice/notes/fast-io-optimization-in-c/",
    subtopics: [
      {
        title: "Fast I/O",
        description: "Optimizing input/output operations",
        url: "https://www.geeksforgeeks.org/fast-io-for-competitive-programming/",
        progress: "not-started" as Status
      },
    ],
  },
  {
    title: "Expected Knowledge",
    description: "Prerequisites and foundational knowledge before advancing.",
    url: "https://cses.fi/book/book.pdf",
    subtopics: [],
  },
  {
    title: "How to Debug",
    description: "Strategies to identify and fix errors in your code.",
    url: "https://ericlippert.com/2014/03/05/how-to-debug-small-programs/",
    subtopics: [],
  },
  {
    title: "How to Practice",
    description: "Effective methods and resources for practicing competitive programming.",
    url: "https://www.codechef.com/practice",
    subtopics: [],
  },
  {
    title: "Contest Strategy",
    description: "Approaches to strategize and perform well during contests.",
    url: "https://codeforces.com/blog/entry/71566",
    subtopics: [],
  },
  {
    title: "Resources: Competitive Programming",
    description: "A curated list of valuable resources for competitive programmers.",
    url: "https://github.com/jwasham/coding-interview-university",
    subtopics: [],
  },
  {
    title: "Contests",
    description: "Information on major programming contests and how to participate.",
    url: "https://clist.by/",
    subtopics: [],
  },
  {
    title: "Olympiads",
    description: "Details about national and international informatics olympiads.",
    url: "https://ioinformatics.org/",
    subtopics: [],
  },
  {
    title: "Language-Specific",
    description: "Discussions and setups for specific programming languages.",
    url: "https://www.learncpp.com/",
    subtopics: [],
  },
  {
    title: "Running Code Locally",
    description: "Guidelines for setting up your environment to run code on your machine.",
    url: "https://www.jetbrains.com/clion/",
    subtopics: [],
  },
  {
    title: "C++ With the Command Line",
    description: "Instructions for compiling and running C++ programs via the command line.",
    url: "https://www.cplusplus.com/doc/tutorial/program_structure/",
    subtopics: [],
  },
  {
    title: "Fast Input & Output",
    description: "Methods to optimize input and output operations for better performance.",
    url: "https://codeforces.com/blog/entry/74947",
    subtopics: [],
  },
  {
    title: "Basic Debugging",
    description: "Fundamental debugging techniques to troubleshoot your code.",
    url: "https://www.freecodecamp.org/news/how-to-debug-javascript-errors/",
    subtopics: [],
  },
  {
    title: "Debugging C++",
    description: "Tips and tools for debugging C++ programs effectively.",
    url: "https://www.cprogramming.com/debugging/visual-studio-debugging.html",
    subtopics: [],
  },
  {
    title: "(Optional) C++ - Writing Generic Code",
    description: "Guidelines for writing reusable and generic C++ code.",
    url: "https://www.learncpp.com/cpp-tutorial/function-templates/",
    subtopics: [],
  },
  {
    title: "(Optional) C++ - Lambda Expressions",
    description: "Understanding and using lambda expressions in C++.",
    url: "https://en.cppreference.com/w/cpp/language/lambda",
    subtopics: [],
  },
]

export default function DiamondPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate initial progress from localStorage
    if (typeof window !== "undefined") {
      const topicProgress = localStorage.getItem("diamond-topic-progress")
      const subtopicProgress = localStorage.getItem("diamond-subtopic-progress")
      
      let total = 0
      let completed = 0
      
      // Count total topics and subtopics
      diamondTopics.forEach(topic => {
        total++ // Count the topic
        total += topic.subtopics?.length || 0 // Count its subtopics
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
      name="Diamond"
      color="bg-blue-500"
      description="Getting started with competitive programming for beginners. Learn the basics to launch your CP journey."
      topics={diamondTopics}
      progress={progress}
    />
  )
} 