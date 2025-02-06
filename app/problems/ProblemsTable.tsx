"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FilterOptions } from "./FilterOptions"
import { ArrowUpDown } from "lucide-react"
import type { CodeforcesProblem } from "@/types/codeforces"

type SortField = "time" | "difficulty"

const getDifficultyInfo = (difficulty: number) => {
  if (difficulty <= 1000) return { variant: "outline", category: "Easy" }
  if (difficulty <= 1500) return { variant: "secondary", category: "Medium" }
  if (difficulty <= 2000) return { variant: "destructive", category: "Hard" }
  return { variant: "default", category: "Very Hard" }
}

const ITEMS_PER_PAGE = 20
const MAX_VISIBLE_PAGES = 5

interface ProblemsTableProps {
  initialProblems: CodeforcesProblem[]
}

export default function ProblemsTable({ initialProblems }: ProblemsTableProps) {
  const [filteredProblems, setFilteredProblems] = useState<CodeforcesProblem[]>(initialProblems)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("time")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const tags = useMemo(() => {
    return Array.from(new Set(initialProblems.flatMap((problem) => problem.tags)))
  }, [initialProblems])

  const handleFilterChange = (minDifficulty: number, maxDifficulty: number, selectedTags: string[]) => {
    const filtered = initialProblems.filter(
      (problem) =>
        (problem.rating === null || problem.rating === undefined || 
         (problem.rating >= minDifficulty && problem.rating <= maxDifficulty)) &&
        (selectedTags.length === 0 || selectedTags.some((tag) => problem.tags.includes(tag))),
    )
    setFilteredProblems(filtered)
    setCurrentPage(1)
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

  const getPageNumbers = (current: number, total: number) => {
    const pages = []
    const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2)
    
    let start = Math.max(1, current - halfVisible)
    let end = Math.min(total, start + MAX_VISIBLE_PAGES - 1)
    
    if (end - start + 1 < MAX_VISIBLE_PAGES) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)
    }
    
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (end < total) {
      if (end < total - 1) pages.push('...')
      pages.push(total)
    }
    
    return pages
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
              <TableRow key={`${problem.contestId}${problem.index}`}>
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
                  <Badge variant={variant as "default" | "destructive" | "outline" | "secondary"}>
                    {problem.rating || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>{category}</TableCell>
                <TableCell>{problem.tags.join(", ")}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        <div className="flex gap-1">
          {getPageNumbers(currentPage, pageCount).map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                className="min-w-[40px]"
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
              >
                {page}
              </Button>
            )
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

