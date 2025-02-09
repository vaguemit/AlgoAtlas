"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowUpDown, Bookmark, BookmarkCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface LevelInfo {
  level: number
  duration: number
  performance: number
  p1Rating: number
  p2Rating: number
  p3Rating: number
  p4Rating: number
}

type SortConfig = {
  key: keyof LevelInfo
  direction: "asc" | "desc"
}

const ITEMS_PER_PAGE = 20

const getDifficultyColor = (rating: number) => {
  if (rating < 1200) return "text-emerald-500 dark:text-emerald-400"
  if (rating < 1400) return "text-blue-500 dark:text-blue-400"
  if (rating < 1600) return "text-purple-500 dark:text-purple-400"
  if (rating < 1900) return "text-yellow-500 dark:text-yellow-400"
  return "text-red-500 dark:text-red-400"
}

const getDifficultyLabel = (rating: number) => {
  if (rating < 1200) return "Beginner"
  if (rating < 1400) return "Intermediate"
  if (rating < 1600) return "Advanced"
  if (rating < 1900) return "Expert"
  return "Master"
}

export default function LevelSheetTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "level", direction: "asc" })
  const [bookmarkedLevel, setBookmarkedLevel] = useState<number | null>(null)
  const { toast } = useToast()
  const { isAuthenticated, handle } = useAuth()

  // Simulated level data (replace with your actual data)
  const levelData: LevelInfo[] = useMemo(() => {
    const durations = [
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120,
      120, 120, 120, 120, 120, 120, 120, 125, 125, 130, 130, 135, 135, 140, 140, 145, 145, 150, 150, 155, 155, 160, 160,
      165, 165, 170, 170, 175, 175, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180,
      180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180,
    ]

    const performances = [
      900, 950, 1000, 1050, 1100, 1125, 1150, 1175, 1200, 1250, 1300, 1350, 1400, 1425, 1450, 1475, 1500, 1525, 1550,
      1575, 1600, 1625, 1650, 1675, 1700, 1725, 1750, 1775, 1800, 1825, 1850, 1875, 1900, 1925, 1950, 1975, 2000, 2025,
      2050, 2075, 2100, 2125, 2150, 2175, 2200, 2225, 2250, 2275, 2300, 2325, 2350, 2375, 2400, 2425, 2450, 2475, 2500,
      2525, 2550, 2575, 2600, 2625, 2650, 2675, 2700, 2725, 2750, 2775, 2800, 2825, 2850, 2875, 2900, 2925, 2950, 2975,
      3000, 3025, 3050, 3075, 3100, 3125, 3150, 3175, 3200, 3225, 3250, 3275, 3300, 3325, 3350, 3375, 3400, 3425, 3450,
      3475, 3500, 3550, 3600, 3650, 3700, 3725, 3750, 3775, 3800, 3850, 3900, 3950, 4000,
    ]

    const p1Ratings = [
      800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 900, 900, 900, 900, 1000, 1000, 1000, 1000, 1100,
      1100, 1100, 1100, 1200, 1200, 1200, 1200, 1300, 1300, 1300, 1300, 1400, 1400, 1400, 1400, 1500, 1500, 1500, 1500,
      1600, 1600, 1600, 1600, 1700, 1700, 1700, 1700, 1800, 1800, 1800, 1800, 1900, 1900, 1900, 1900, 2000, 2000, 2000,
      2000, 2100, 2100, 2100, 2100, 2200, 2200, 2200, 2200, 2300, 2300, 2300, 2300, 2400, 2400, 2400, 2400, 2500, 2500,
      2500, 2500, 2600, 2600, 2600, 2600, 2700, 2700, 2700, 2700, 2800, 2800, 2800, 2800, 2900, 2900, 2900, 2900, 3000,
      3100, 3100, 3200, 3200, 3300, 3300, 3300, 3400, 3400, 3400, 3500,
    ]

    const p2Ratings = [
      800, 800, 800, 900, 900, 900, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1100, 1100, 1100, 1100, 1200, 1200,
      1200, 1200, 1300, 1300, 1300, 1300, 1400, 1400, 1400, 1400, 1500, 1500, 1500, 1500, 1600, 1600, 1600, 1600, 1700,
      1700, 1700, 1700, 1800, 1800, 1800, 1800, 1900, 1900, 1900, 1900, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100,
      2200, 2200, 2200, 2200, 2300, 2300, 2300, 2300, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2600, 2600, 2600,
      2600, 2700, 2700, 2700, 2700, 2800, 2800, 2800, 2800, 2900, 2900, 2900, 2900, 3000, 3000, 3000, 3000, 3100, 3100,
      3100, 3100, 3200, 3200, 3200, 3300, 3300, 3300, 3300, 3400, 3400, 3400, 3500, 3500,
    ]

    const p3Ratings = [
      800, 800, 900, 900, 900, 1000, 1000, 1000, 1100, 1100, 1200, 1200, 1200, 1200, 1200, 1300, 1300, 1300, 1300, 1400,
      1400, 1400, 1400, 1500, 1500, 1500, 1500, 1600, 1600, 1600, 1600, 1700, 1700, 1700, 1700, 1800, 1800, 1800, 1800,
      1900, 1900, 1900, 1900, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100, 2200, 2200, 2200, 2200, 2300, 2300, 2300,
      2300, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2600, 2600, 2600, 2600, 2700, 2700, 2700, 2700, 2800, 2800,
      2800, 2800, 2900, 2900, 2900, 2900, 3000, 3000, 3000, 3000, 3100, 3100, 3100, 3100, 3200, 3200, 3200, 3200, 3300,
      3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3400, 3400, 3500, 3500, 3500,
    ]

    const p4Ratings = [
      800, 900, 900, 900, 1000, 1000, 1000, 1100, 1100, 1200, 1200, 1300, 1400, 1400, 1400, 1400, 1500, 1500, 1500,
      1500, 1600, 1600, 1600, 1600, 1700, 1700, 1700, 1700, 1800, 1800, 1800, 1800, 1900, 1900, 1900, 1900, 2000, 2000,
      2000, 2000, 2100, 2100, 2100, 2100, 2200, 2200, 2200, 2200, 2300, 2300, 2300, 2300, 2400, 2400, 2400, 2400, 2500,
      2500, 2500, 2500, 2600, 2600, 2600, 2600, 2700, 2700, 2700, 2700, 2800, 2800, 2800, 2800, 2900, 2900, 2900, 2900,
      3000, 3000, 3000, 3000, 3100, 3100, 3100, 3100, 3200, 3200, 3200, 3200, 3300, 3300, 3300, 3300, 3400, 3400, 3400,
      3400, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500, 3500,
    ]

    return Array.from({ length: 109 }, (_, i) => ({
      level: i + 1,
      duration: durations[i],
      performance: performances[i],
      p1Rating: p1Ratings[i],
      p2Rating: p2Ratings[i],
      p3Rating: p3Ratings[i],
      p4Rating: p4Ratings[i],
    }))
  }, [])

  const handleSort = (key: keyof LevelInfo) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const sortedAndFilteredData = useMemo(() => {
    return levelData
      .filter(
        (level) => level.level.toString().includes(searchTerm) || level.performance.toString().includes(searchTerm),
      )
      .sort((a, b) => {
        const multiplier = sortConfig.direction === "asc" ? 1 : -1
        return (a[sortConfig.key] - b[sortConfig.key]) * multiplier
      })
  }, [levelData, searchTerm, sortConfig])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedAndFilteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedAndFilteredData, currentPage])

  const pageCount = Math.ceil(sortedAndFilteredData.length / ITEMS_PER_PAGE)

  const toggleBookmark = (level: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark levels",
        variant: "destructive",
      })
      return
    }

    setBookmarkedLevel((current) => (current === level ? null : level))
    toast({
      title: bookmarkedLevel === level ? "Bookmark Removed" : "Level Bookmarked",
      description:
        bookmarkedLevel === level
          ? "Level has been removed from your bookmarks"
          : `Level ${level} has been added to your bookmarks`,
    })
  }

  const getRecommendedLevel = () => {
    // This would typically come from the backend based on user's history
    return Math.floor(Math.random() * 10) + 1
  }

  const recommendedLevel = isAuthenticated ? getRecommendedLevel() : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input
          type="text"
          placeholder="Search by level or performance..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm font-mono"
        />
        {isAuthenticated && recommendedLevel && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Recommended Level: {recommendedLevel}</Badge>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse font-mono">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-4 text-left">
                <Button variant="ghost" className="font-mono" onClick={() => handleSort("level")}>
                  Level
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="p-4 text-left">Duration</th>
              <th className="p-4 text-left">
                <Button variant="ghost" className="font-mono" onClick={() => handleSort("performance")}>
                  Performance
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </th>
              {["p1Rating", "p2Rating", "p3Rating", "p4Rating"].map((key) => (
                <th key={key} className="p-4 text-left">
                  <Button variant="ghost" className="font-mono" onClick={() => handleSort(key as keyof LevelInfo)}>
                    {key.replace("Rating", "")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              ))}
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((level) => (
              <tr
                key={level.level}
                className={`border-t hover:bg-muted/50 ${level.level === recommendedLevel ? "bg-primary/5" : ""}`}
              >
                <td className="p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className={getDifficultyColor(level.performance)}>{level.level}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getDifficultyLabel(level.performance)} Level</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="p-4">{level.duration} min</td>
                <td className="p-4">
                  <Badge variant="outline" className={getDifficultyColor(level.performance)}>
                    {level.performance}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className={getDifficultyColor(level.p1Rating)}>
                    {level.p1Rating}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className={getDifficultyColor(level.p2Rating)}>
                    {level.p2Rating}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className={getDifficultyColor(level.p3Rating)}>
                    {level.p3Rating}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className={getDifficultyColor(level.p4Rating)}>
                    {level.p4Rating}
                  </Badge>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="icon" onClick={() => toggleBookmark(level.level)}>
                    {bookmarkedLevel === level.level ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
            const pageNumber = i + 1
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          })}
          {pageCount > 5 && (
            <>
              <span>...</span>
              <Button
                variant={currentPage === pageCount ? "default" : "outline"}
                onClick={() => setCurrentPage(pageCount)}
              >
                {pageCount}
              </Button>
            </>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

