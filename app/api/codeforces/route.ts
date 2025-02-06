import { NextResponse } from "next/server"
import type { CodeforcesApiResponse } from "@/types/codeforces"

const CODEFORCES_API_BASE = "https://codeforces.com/api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const method = searchParams.get("method")
    const handle = searchParams.get("handle")
    const handles = searchParams.get("handles")
    const from = searchParams.get("from") || "1"
    const count = searchParams.get("count") || "100"

    if (!method) {
      throw new Error("Method is required")
    }

    const url = `${CODEFORCES_API_BASE}/${method}`
    const queryParams = new URLSearchParams()

    switch (method) {
      case "user.info":
        if (!handles) throw new Error("handles parameter is required")
        queryParams.set("handles", handles)
        break
      case "user.status":
      case "user.rating":
      case "user.friends":
        if (!handle) throw new Error("handle parameter is required")
        queryParams.set("handle", handle)
        break
      case "problemset.problems":
        break
      default:
        throw new Error("Invalid method")
    }

    if (method === "user.status") {
      queryParams.set("from", from)
      queryParams.set("count", count)
    }

    const finalUrl = `${url}?${queryParams.toString()}`
    console.log("Fetching from:", finalUrl)

    const response = await fetch(finalUrl)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data: CodeforcesApiResponse = await response.json()

    if (data.status !== "OK") {
      throw new Error(data.comment || "Codeforces API returned non-OK status")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Codeforces API:", error)
    return NextResponse.json(
      {
        status: "FAILED",
        comment: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

