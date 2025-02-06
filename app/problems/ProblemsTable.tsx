"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FilterOptions } from "./FilterOptions"
import { ArrowUpDown } from "lucide-react"
import type { CodeforcesProblem } from "@/types/codeforces"
import { motion } from "framer-motion"

type SortField = "time" | "difficulty"

const getDifficultyInfo = (difficulty: number) => {
  if (difficulty <= 1000) return { variant: "success", category: "Easy" }
  if (difficulty <= 1500) return { variant: "warning", category: "Medium" }
  if (difficulty <= 2000) return { variant: "destructive", category: "Hard" }
  return { variant: "default", category: "Very Hard" }
}

const ITEMS_PER_PAGE = 20

interface ProblemsTableProps {
  initialProblems: CodeforcesProblem[]
}

export default function ProblemsTable({ initialProblems }: ProblemsTableProps) {
  const [problems, setProblems] = useState<CodeforcesProblem[]>(initialProblems)
  const [filteredProblems, setFilteredProblems] = useState<CodeforcesProblem[]>(initialProblems)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("time")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const tags = useMemo(() => {
    return Array.from(new Set(problems.flatMap((problem) => problem.tags)))
  }, [problems])

  const handleFilterChange = (minDifficulty: number, maxDifficulty: number, selectedTags: string[]) => {
    try {
      const filtered = problems.filter(
        (problem) =>
          problem.rating! >= minDifficulty &&
          problem.rating! <= maxDifficulty &&
          (selectedTags.length === 0 || selectedTags.some((tag) => problem.tags.includes(tag))),
      )
      setFilteredProblems(filtered)
      setCurrentPage(1)
    } catch (error) {
      console.error("Error applying filters:", error)
    }
  }

  const sortProblems = useMemo(
    () => (problemsToSort: CodeforcesProblem[]) => {
      return [...problemsToSort].sort((a, b) => {
        if (sortField === "time") {
          const result = b.contestId - a.contestId || a.index.localeCompare(b.index)
          return sortDirection === "asc" ? result : -result
        } else {
          const result = (a.rating || 0) - (b.rating || 0)
          return sortDirection === "asc" ? result : -result
        }
      })
    },
    [sortField, sortDirection],
  )

  const toggleSort = () => {
    setSortField((prev) => (prev === "time" ? "difficulty" : "time"))
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const pageCount = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE)
  const currentProblems = useMemo(() => {
    return sortProblems(filteredProblems).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  }, [filteredProblems, currentPage, sortProblems])

  if (problems.length === 0) {
    return <div>No problems available. Please try again later.</div>
  }

  return (
    <div className="space-y-4">
      <FilterOptions tags={tags} onFilterChange={handleFilterChange} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={toggleSort}>
                {sortField === "time" ? "Time" : "Difficulty"}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProblems.map((problem) => {
            const { variant, category } = getDifficultyInfo(problem.rating || 0)
            return (
              <motion.tr
                key={`${problem.contestId}${problem.index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-accent transition-colors duration-200"
              >
                <TableCell>
                  {problem.contestId}
                  {problem.index}
                </TableCell>
                <TableCell>
                  <Link
                    href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {problem.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={variant}>{problem.rating || "N/A"}</Badge>
                </TableCell>
                <TableCell>{category}</TableCell>
                <TableCell>{problem.tags.join(", ")}</TableCell>
              </motion.tr>
            )
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center gap-2 mt-4">
        <motion.button
          className="px-4 py-2 border rounded hover:bg-accent transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ←
        </motion.button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
          if (page === 1 || page === pageCount || (page >= currentPage - 2 && page <= currentPage + 2)) {
            return (
              <motion.button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                className="min-w-[40px] px-4 py-2 border rounded hover:bg-accent transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page}
              </motion.button>
            )
          } else if (page === currentPage - 3 || page === currentPage + 3) {
            return <span key={page}>...</span>
          }
          return null
        })}
        <motion.button
          className="px-4 py-2 border rounded hover:bg-accent transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
        >
          →
        </motion.button>
      </div>
    </div>
  )
}

