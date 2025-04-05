"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Trophy, ExternalLink, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Contest data structure
interface Contest {
  id: string
  title: string
  platform: "codeforces" | "codechef" | "atcoder"
  startTime: Date
  duration: number // in minutes
  url: string
  description?: string
  status: "upcoming" | "ended"
}

// Platform colors and icons
const platformConfig = {
  codeforces: {
    color: "from-red-600 to-red-400",
    textColor: "text-red-400",
    icon: <Trophy className="h-5 w-5" />,
    name: "Codeforces",
  },
  codechef: {
    color: "from-amber-600 to-amber-400",
    textColor: "text-amber-400",
    icon: <Trophy className="h-5 w-5" />,
    name: "CodeChef",
  },
  atcoder: {
    color: "from-blue-600 to-blue-400",
    textColor: "text-blue-400",
    icon: <Trophy className="h-5 w-5" />,
    name: "AtCoder",
  },
}

// Countdown timer component
function CountdownTimer({ targetDate, status }: { targetDate: Date; status: "upcoming" | "ended" }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate))

  function calculateTimeLeft(targetDate: Date) {
    const difference = +targetDate - +new Date()

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isLive: status === "upcoming", // Only show "LIVE NOW" for upcoming contests
      }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isLive: false,
    }
  }

  useEffect(() => {
    // Don't set up timer for ended contests
    if (status === "ended") return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, status])

  // For ended contests, show "Ended" badge
  if (status === "ended") {
    return (
      <div className="flex items-center">
        <span className="inline-block px-2 py-1 bg-gray-500/20 text-gray-400 rounded-md text-sm font-medium">
          ENDED
        </span>
      </div>
    )
  }

  if (timeLeft.isLive) {
    return (
      <div className="flex items-center">
        <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-sm font-medium animate-pulse">
          LIVE NOW
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex flex-col items-center">
        <motion.div
          key={timeLeft.days}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-md"
        >
          {timeLeft.days}
        </motion.div>
        <span className="text-xs text-white/60">days</span>
      </div>
      <span className="text-white/60">:</span>
      <div className="flex flex-col items-center">
        <motion.div
          key={timeLeft.hours}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-md"
        >
          {timeLeft.hours.toString().padStart(2, "0")}
        </motion.div>
        <span className="text-xs text-white/60">hrs</span>
      </div>
      <span className="text-white/60">:</span>
      <div className="flex flex-col items-center">
        <motion.div
          key={timeLeft.minutes}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-md"
        >
          {timeLeft.minutes.toString().padStart(2, "0")}
        </motion.div>
        <span className="text-xs text-white/60">min</span>
      </div>
      <span className="text-white/60">:</span>
      <div className="flex flex-col items-center">
        <motion.div
          key={timeLeft.seconds}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-md"
        >
          {timeLeft.seconds.toString().padStart(2, "0")}
        </motion.div>
        <span className="text-xs text-white/60">sec</span>
      </div>
    </div>
  )
}

// Contest card component
function ContestCard({ contest }: { contest: Contest }) {
  const [isHovered, setIsHovered] = useState(false)
  const platform = platformConfig[contest.platform]

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins > 0 ? ` ${mins}m` : ""}`
  }

  return (
    <motion.div
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect - dimmed for ended contests */}
      <div
        className={cn(
          `absolute inset-0 bg-gradient-to-r ${platform.color} rounded-xl blur-md transition-opacity duration-300`,
          contest.status === "ended"
            ? isHovered
              ? "opacity-20"
              : "opacity-10"
            : isHovered
              ? "opacity-40"
              : "opacity-20",
        )}
      ></div>

      {/* Card content */}
      <div
        className={cn(
          "relative backdrop-blur-sm border border-purple-500/20 p-4 sm:p-6 rounded-xl shadow-lg shadow-black/50 h-full flex flex-col",
          contest.status === "ended" ? "bg-black/80" : "bg-black/95",
        )}
      >
        {/* Status badge */}
        {contest.status === "ended" && (
          <div className="absolute top-4 left-4">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">Ended</span>
          </div>
        )}

        {/* Platform badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${platform.color} text-white flex items-center gap-1 ${contest.status === "ended" ? "opacity-70" : ""}`}
          >
            {platform.icon}
            {platform.name}
          </span>
        </div>

        {/* Contest title */}
        <h3 className={cn("text-xl font-bold mb-3 pr-24", contest.status === "ended" ? "text-white/80" : "text-white")}>
          {contest.title}
        </h3>

        {/* Date and time */}
        <div className="flex items-center text-white/70 mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {formatDate(contest.startTime)} at {formatTime(contest.startTime)}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center text-white/70 mb-4">
          <Clock className="h-4 w-4 mr-2" />
          <span>Duration: {formatDuration(contest.duration)}</span>
        </div>

        {/* Description */}
        {contest.description && <p className="text-white/70 mb-6 flex-grow">{contest.description}</p>}

        {/* Countdown timer or Ended badge */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div
              className={cn(
                "absolute -inset-1 rounded-lg blur-md opacity-70",
                contest.status === "ended" ? "bg-gray-500/20" : "bg-gradient-to-r from-purple-500/30 to-blue-500/30",
              )}
            ></div>
            <div className="relative bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3">
              <CountdownTimer targetDate={contest.startTime} status={contest.status} />
            </div>
          </div>
        </div>

        {/* Action button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className={cn(
              `w-full text-white hover:shadow-md transition-all duration-300`,
              contest.status === "ended"
                ? "bg-gray-700 hover:bg-gray-600 hover:shadow-gray-700/30"
                : `bg-gradient-to-r ${platform.color} hover:shadow-${platform.color.split(" ")[0].replace("from-", "")}/30`,
            )}
            onClick={() => window.open(contest.url, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {contest.status === "ended" ? "View Results" : "Register Now"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Timeline component
function ContestTimeline({ contests }: { contests: Contest[] }) {
  // Sort contests by start time
  const sortedContests = [...contests].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  return (
    <div className="relative mt-12 mb-8 px-4">
      {/* Timeline line */}
      <div className="absolute left-0 right-0 h-1 top-4 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      {/* Timeline points */}
      <div className="flex justify-between relative">
        {sortedContests.slice(0, 5).map((contest, index) => (
          <div key={contest.id} className="flex flex-col items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${platformConfig[contest.platform].textColor} border-2 border-current bg-black`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              {index + 1}
            </motion.div>
            <motion.div
              className="text-xs text-white/70 mt-2 text-center max-w-[80px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {contest.startTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Update the ContestsSection component to group contests by status
export function ContestsSection() {
  const [contests, setContests] = useState<Contest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"upcoming" | "ended">("upcoming")

  // Fallback to generate some contests if the API fails
  const generateFallbackContests = useCallback((): Contest[] => {
    const now = new Date()
    return [
      {
        id: "cf-fallback-1",
        title: "Codeforces Round #850 (Div. 1 + Div. 2)",
        platform: "codeforces",
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 150, // 2.5 hours
        url: "https://codeforces.com/contests",
        description: "Solve algorithmic problems and compete with coders around the world.",
        status: "upcoming",
      },
      {
        id: "cc-fallback-1",
        title: "CodeChef Starters 80",
        platform: "codechef",
        startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: 180, // 3 hours
        url: "https://www.codechef.com/contests",
        description: "Weekly programming contest for all CodeChef users.",
        status: "upcoming",
      },
      {
        id: "at-fallback-1",
        title: "AtCoder Beginner Contest 320",
        platform: "atcoder",
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 100, // 1 hour 40 minutes
        url: "https://atcoder.jp/contests",
        description: "Beginner-friendly contest with interesting problems.",
        status: "upcoming",
      },
      {
        id: "cf-fallback-2",
        title: "Codeforces Round #849 (Div. 2)",
        platform: "codeforces",
        startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 150, // 2.5 hours
        url: "https://codeforces.com/contests",
        description: "Solve algorithmic problems and compete with coders around the world.",
        status: "ended",
      },
      {
        id: "at-fallback-2",
        title: "AtCoder Beginner Contest 319",
        platform: "atcoder",
        startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: 100, // 1 hour 40 minutes
        url: "https://atcoder.jp/contests",
        description: "Beginner-friendly contest with interesting problems.",
        status: "ended",
      },
    ]
  }, [])

  // Define fetchContests outside useEffect so it can be called from refreshContests
  const fetchContests = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch contests from API or use mock data
      const response = await fetch("/api/contests")

      if (!response.ok) {
        throw new Error(`Failed to fetch contests: ${response.statusText}`)
      }

      const data = await response.json()

      // Convert string dates to Date objects
      const contestsWithDates = data.contests.map((contest: any) => ({
        ...contest,
        startTime: new Date(contest.startTime),
      }))

      if (contestsWithDates.length === 0) {
        // If no contests were returned, use fallback
        setContests(generateFallbackContests())
        setError("No contests found. Using fallback data.")
      } else {
        setContests(contestsWithDates)
        setError(null) // Clear any previous errors
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching contests:", err)
      setError("Failed to load contests. Using fallback data.")
      // Use fallback contests instead of showing error
      setContests(generateFallbackContests())
      setIsLoading(false)
    }
  }, [generateFallbackContests])

  // Add a refresh function that calls fetchContests
  const refreshContests = useCallback(async () => {
    setIsRefreshing(true)
    await fetchContests()
    setIsRefreshing(false)
  }, [fetchContests])

  // Fetch contests on component mount
  useEffect(() => {
    fetchContests()
  }, [fetchContests])

  // Filter contests by status
  const upcomingContests = contests.filter((contest) => contest.status === "upcoming")
  const endedContests = contests.filter((contest) => contest.status === "ended")

  // Get contests to display based on active tab
  const displayContests = activeTab === "upcoming" ? upcomingContests : endedContests

  return (
    <section className="py-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <div className="text-center mb-12 relative">
         

          {/* Refresh button */}
          <motion.button
            className="absolute top-0 right-0 p-2 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
            onClick={refreshContests}
            disabled={isLoading || isRefreshing}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Refresh contests"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
          </motion.button>
        </div>

        {/* Tab navigation */}
        {!isLoading && !error && contests.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="bg-navy-800/50 backdrop-blur-sm rounded-full p-1 border border-purple-500/20">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "upcoming"
                    ? "bg-purple-500/30 text-white"
                    : "text-white/70 hover:text-white hover:bg-purple-500/10"
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming ({upcomingContests.length})
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "ended"
                    ? "bg-purple-500/30 text-white"
                    : "text-white/70 hover:text-white hover:bg-purple-500/10"
                }`}
                onClick={() => setActiveTab("ended")}
              >
                Recently Ended ({endedContests.length})
              </button>
            </div>
          </div>
        )}

        {/* Timeline visualization - only for upcoming contests */}
        {!isLoading && !error && activeTab === "upcoming" && upcomingContests.length > 0 && (
          <ContestTimeline contests={upcomingContests} />
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* No contests message */}
        {!isLoading && !error && displayContests.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-blue-500/20 text-blue-400 px-4 py-3 rounded-lg">
              {activeTab === "upcoming"
                ? "No upcoming contests found. Check back later!"
                : "No recently ended contests found."}
            </div>
          </div>
        )}

        {/* Contest cards */}
        {!isLoading && !error && displayContests.length > 0 && (
          <div className="mt-8">
            {/* Desktop: Grid layout */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
              {displayContests.slice(0, 6).map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>

            {/* Mobile: Horizontal scroll */}
            <div className="md:hidden overflow-x-auto pb-6 -mx-4 px-4">
              <div className="flex space-x-4" style={{ minWidth: "max-content" }}>
                {displayContests.slice(0, 6).map((contest) => (
                  <div key={contest.id} className="w-80">
                    <ContestCard contest={contest} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

