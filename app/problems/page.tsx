"use client"

import { useState, useEffect } from "react"
import ProblemsTable from "./ProblemsTable"
import { toast } from "@/components/ui/use-toast"
import type { CodeforcesProblem } from "@/types/codeforces"

export default function Problems() {
  const [problems, setProblems] = useState<CodeforcesProblem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("/api/problems")
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API")
        }
        setProblems(data)
      } catch (error) {
        console.error("Error fetching problems:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        toast({
          title: "Error",
          description: "Failed to fetch problems. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProblems()
  }, [])

  if (isLoading) {
    return <div className="container mx-auto px-6 py-12">Loading problems...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Codeforces Problem Repository</h1>
      <ProblemsTable initialProblems={problems} />
    </div>
  )
}

