import { NextResponse } from "next/server"

interface Problem {
  contestId: number
  index: string
  name: string
  type: string
  points: number
  rating: number
  tags: string[]
}

export async function GET() {
  try {
    const response = await fetch("https://codeforces.com/api/problemset.problems")
    const data = await response.json()

    if (data.status !== "OK") {
      throw new Error("Failed to fetch problems from Codeforces")
    }

    const problems: Problem[] = data.result.problems
      .filter((problem: Problem) => problem.rating !== undefined)
      .sort((a: Problem, b: Problem) => a.rating - b.rating)
      .slice(0, 100) // Limit to 100 problems for performance

    return NextResponse.json(problems)
  } catch (error) {
    console.error("Error fetching problems:", error)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}

