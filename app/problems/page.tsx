'use client'

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
        console.log("Fetching problems...")
        const res = await fetch("/api/problems?method=problemset.problems")
        console.log("Response status:", res.status)
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()
        console.log("Received data:", data)
        
        if (data.status === "FAILED") {
          throw new Error(data.comment || "Failed to fetch problems")
        }
        
        if (!Array.isArray(data)) {
          console.error("Invalid data format:", data)
          throw new Error("Invalid data format received from API")
        }
        
        console.log(`Setting ${data.length} problems`)
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
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Codeforces Problem Repository</h1>
        <div className="flex items-center justify-center p-8">
          <div className="space-y-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-xl font-semibold">Loading problems...</h2>
            <p className="text-muted-foreground">This may take a few seconds</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No problems available</h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
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

