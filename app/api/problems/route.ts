import { NextResponse } from "next/server"
import type { CodeforcesApiResponse } from "@/types/codeforces"

const CODEFORCES_API_BASE = "https://codeforces.com/api"

export async function GET() {
  try {
    console.log("Fetching problems from Codeforces...")
    const response = await fetch(`${CODEFORCES_API_BASE}/problemset.problems`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Received response:", data.status)

    if (data.status !== "OK") {
      throw new Error("Failed to fetch problems from Codeforces")
    }

    // Extract and process problems
    const problems = data.result.problems.map((problem: any) => ({
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      rating: problem.rating,
      tags: problem.tags
    }))

    console.log(`Processing ${problems.length} problems`)
    return NextResponse.json(problems)

  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}

