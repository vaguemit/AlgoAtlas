import { NextResponse } from "next/server"

// Contest data structure
export interface Contest {
  id: string
  title: string
  platform: "codeforces" | "codechef" | "atcoder"
  startTime: Date
  duration: number // in minutes
  url: string
  description?: string
  status: "upcoming" | "ended" // Add status field
}

export async function GET() {
  try {
    // Fetch contests from all platforms in parallel
    const [codeforcesContests, codechefContests, atcoderContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchCodechefContests(),
      fetchAtcoderContests(),
    ])

    // Combine all contests
    const allContests = [...codeforcesContests, ...codechefContests, ...atcoderContests]

    // Sort by start time, with upcoming contests first
    allContests.sort((a, b) => {
      // First sort by status (upcoming first)
      if (a.status !== b.status) {
        return a.status === "upcoming" ? -1 : 1
      }
      // Then sort by date (ascending for upcoming, descending for ended)
      if (a.status === "upcoming") {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      } else {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      }
    })

    return NextResponse.json({ contests: allContests })
  } catch (error) {
    console.error("Error fetching contests:", error)
    return NextResponse.json({ error: "Failed to fetch contests", contests: [] }, { status: 500 })
  }
}

// Fetch contests from Codeforces API
async function fetchCodeforcesContests(): Promise<Contest[]> {
  try {
    const response = await fetch("https://codeforces.com/api/contest.list")
    const data = await response.json()

    if (data.status !== "OK") {
      throw new Error(`Codeforces API error: ${data.comment || "Unknown error"}`)
    }

    const now = new Date().getTime()
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000

    // Get upcoming contests
    const upcomingContests = data.result
      .filter((contest) => {
        const contestStartTime = contest.startTimeSeconds * 1000
        const contestEndTime = contestStartTime + (contest.durationSeconds * 1000)
        return contestStartTime > now
      })
      .slice(0, 10) // Limit to 10 contests
      .map((contest) => ({
        id: `cf-${contest.id}`,
        title: contest.name,
        platform: "codeforces" as const,
        startTime: new Date(contest.startTimeSeconds * 1000),
        duration: Math.floor(contest.durationSeconds / 60),
        url: `https://codeforces.com/contests/${contest.id}`,
        description: "Solve algorithmic problems and compete with coders around the world.",
        status: "upcoming" as const,
      }))

    // Get recently ended contests
    const endedContests = data.result
      .filter((contest) => {
        const contestStartTime = contest.startTimeSeconds * 1000
        const contestEndTime = contestStartTime + (contest.durationSeconds * 1000)
        return contestEndTime < now && contestStartTime > oneWeekAgo
      })
      .slice(0, 5) // Limit to 5 contests
      .map((contest) => ({
        id: `cf-${contest.id}`,
        title: contest.name,
        platform: "codeforces" as const,
        startTime: new Date(contest.startTimeSeconds * 1000),
        duration: Math.floor(contest.durationSeconds / 60),
        url: `https://codeforces.com/contests/${contest.id}`,
        description: "Solve algorithmic problems and compete with coders around the world.",
        status: "ended" as const,
      }))

    return [...upcomingContests, ...endedContests]
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error)
    return [] // Return empty array on error
  }
}

// Fetch contests from CodeChef
async function fetchCodechefContests(): Promise<Contest[]> {
  try {
    const response = await fetch(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all",
    )
    const data = await response.json()
    const now = new Date().getTime()
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000

    const contests = []

    // Add upcoming contests
    if (data.future_contests) {
      const upcomingContests = data.future_contests
        .filter((contest) => new Date(contest.contest_start_date_iso).getTime() > now)
        .slice(0, 10) // Limit to 10 contests
        .map((contest) => ({
          id: `cc-${contest.contest_code}`,
          title: contest.contest_name,
          platform: "codechef" as const,
          startTime: new Date(contest.contest_start_date_iso),
          duration: Math.floor(
            (new Date(contest.contest_end_date_iso).getTime() - new Date(contest.contest_start_date_iso).getTime()) /
              (60 * 1000),
          ),
          url: `https://www.codechef.com/${contest.contest_code}`,
          description: contest.contest_description || "Participate in this CodeChef programming contest.",
          status: "upcoming" as const,
        }))
      contests.push(...upcomingContests)
    }

    // Add recently ended contests
    if (data.past_contests) {
      const endedContests = data.past_contests
        .filter((contest) => {
          const endTime = new Date(contest.contest_end_date_iso).getTime()
          return endTime < now && endTime > oneWeekAgo
        })
        .slice(0, 5) // Limit to 5 contests
        .map((contest) => ({
          id: `cc-${contest.contest_code}`,
          title: contest.contest_name,
          platform: "codechef" as const,
          startTime: new Date(contest.contest_start_date_iso),
          duration: Math.floor(
            (new Date(contest.contest_end_date_iso).getTime() - new Date(contest.contest_start_date_iso).getTime()) /
              (60 * 1000),
          ),
          url: `https://www.codechef.com/${contest.contest_code}`,
          description: contest.contest_description || "Participate in this CodeChef programming contest.",
          status: "ended" as const,
        }))
      contests.push(...endedContests)
    }

    return contests
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error)
    return [] // Return empty array on error
  }
}

// Fetch contests from AtCoder
async function fetchAtcoderContests(): Promise<Contest[]> {
  try {
    // Since the external API is unreliable, we'll create mock data instead
    // In a production app, you would implement server-side scraping of the AtCoder website
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Generate realistic contest dates
    const generateContestDate = (daysFromNow: number, hoursOffset = 0) => {
      const date = new Date(now)
      date.setDate(date.getDate() + daysFromNow)
      date.setHours(date.getHours() + hoursOffset)
      // Round to nearest hour
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      return date
    }

    // Create realistic mock data based on actual AtCoder contest patterns
    const upcomingContests = [
      {
        id: "at-abc320",
        title: "AtCoder Beginner Contest 320",
        platform: "atcoder" as const,
        startTime: generateContestDate(3, 2), // 3 days from now
        duration: 100, // 1 hour 40 minutes
        url: "https://atcoder.jp/contests/abc320",
        description: "Beginner-friendly contest with interesting problems.",
        status: "upcoming" as const,
      },
      {
        id: "at-arc160",
        title: "AtCoder Regular Contest 160",
        platform: "atcoder" as const,
        startTime: generateContestDate(10, 1), // 10 days from now
        duration: 120, // 2 hours
        url: "https://atcoder.jp/contests/arc160",
        description: "Regular contest for intermediate competitive programmers.",
        status: "upcoming" as const,
      },
      {
        id: "at-agc060",
        title: "AtCoder Grand Contest 060",
        platform: "atcoder" as const,
        startTime: generateContestDate(14, 3), // 14 days from now
        duration: 150, // 2.5 hours
        url: "https://atcoder.jp/contests/agc060",
        description: "Grand contest for advanced competitive programmers.",
        status: "upcoming" as const,
      },
    ]

    // Create recently ended contests
    const endedContests = [
      {
        id: "at-abc319",
        title: "AtCoder Beginner Contest 319",
        platform: "atcoder" as const,
        startTime: generateContestDate(-3, 0), // 3 days ago
        duration: 100, // 1 hour 40 minutes
        url: "https://atcoder.jp/contests/abc319",
        description: "Beginner-friendly contest with interesting problems.",
        status: "ended" as const,
      },
      {
        id: "at-arc159",
        title: "AtCoder Regular Contest 159",
        platform: "atcoder" as const,
        startTime: generateContestDate(-6, 0), // 6 days ago
        duration: 120, // 2 hours
        url: "https://atcoder.jp/contests/arc159",
        description: "Regular contest for intermediate competitive programmers.",
        status: "ended" as const,
      },
    ]

    return [...upcomingContests, ...endedContests]
  } catch (error) {
    console.error("Error in AtCoder contests:", error)
    return [] // Return empty array on error
  }
}

