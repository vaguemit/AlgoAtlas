import { NextResponse } from "next/server"
import type { CodeforcesProblem } from "@/types/codeforces"

export async function GET() {
  try {
    const response = await fetch("https://codeforces.com/api/problemset.problems")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    if (data.status !== "OK") {
      throw new Error("Failed to fetch problems from Codeforces")
    }

    const problems: CodeforcesProblem[] = data.result.problems
      .filter((problem: CodeforcesProblem) => problem.rating !== undefined)
      .sort((a: CodeforcesProblem, b: CodeforcesProblem) => a.rating! - b.rating!)

    return NextResponse.json(problems)
  } catch (error) {
    console.error("Error fetching problems:", error)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}

