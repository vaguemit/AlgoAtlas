"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface ContestEntryProps {
  level: string
  problems: Array<{
    id: string
    title: string
    difficulty: number
    url: string
    platform: string
    tags: string[]
    type: string
    solved: boolean
  }>
  onStart: () => void
  onReroll: (index: number) => void
  onCustomProblem: (index: number, url: string) => void
}

export function ContestEntry({ level, problems, onStart, onReroll, onCustomProblem }: ContestEntryProps) {
  const [countdown, setCountdown] = useState<number>(15)
  const [customUrls, setCustomUrls] = useState(["", "", "", ""])
  const [isStarting, setIsStarting] = useState(false)
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [selectedCustomIndex, setSelectedCustomIndex] = useState<number | null>(null)
  const [customUrl, setCustomUrl] = useState("")

  useEffect(() => {
    if (isStarting) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            onStart()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isStarting, onStart])

  const handleCustomUrlChange = (index: number, url: string) => {
    const newUrls = [...customUrls]
    newUrls[index] = url
    setCustomUrls(newUrls)
  }

  const handleCustomClick = (index: number) => {
    setSelectedCustomIndex(index)
    setIsCustomDialogOpen(true)
  }

  const handleCustomSubmit = () => {
    if (selectedCustomIndex !== null && customUrl) {
      onCustomProblem(selectedCustomIndex, customUrl)
      setCustomUrl("")
      setIsCustomDialogOpen(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto font-mono">
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center gap-4">
            <div className="font-bold text-indigo-600">Enter Contest Level :</div>
            <div className="text-indigo-500">{level}</div>
          </div>

          <div className="text-center bg-indigo-50 dark:bg-indigo-950/30 py-2 rounded-lg">
            Theme : mixed
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <div className="font-bold w-48 text-indigo-600">Problem Rating :</div>
              <div className="grid grid-cols-4 gap-4 flex-1">
                {problems.map((problem, index) => (
                  <div key={index} className="bg-indigo-50 dark:bg-indigo-950/30 p-4 text-center rounded shadow-sm">
                    {problem.difficulty}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="font-bold w-48 text-indigo-600">Problem Content:</div>
              <div className="grid grid-cols-4 gap-4 flex-1">
                {problems.map((problem, index) => (
                  <a
                    key={index}
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="bg-indigo-50 dark:bg-indigo-950/30 p-4 text-center rounded shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                    Problem {index + 1}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="font-bold w-48 text-indigo-600">ReRoll Problem :</div>
              <div className="grid grid-cols-4 gap-4 flex-1">
                {problems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onReroll(index)}
                    className="bg-indigo-50 dark:bg-indigo-950/30 p-4 text-center rounded shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                    reroll {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="font-bold w-48 text-indigo-600">Custom Problem :</div>
              <div className="grid grid-cols-4 gap-4 flex-1">
                {customUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleCustomClick(index)}
                    className="bg-indigo-50 dark:bg-indigo-950/30 p-4 text-center rounded shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                    Custom {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="font-bold text-xl border-t border-b border-indigo-200 dark:border-indigo-800 py-4 text-indigo-600">
              Contest Duration : 120 min
            </div>
            {isStarting ? (
              <div className="text-red-500 font-bold text-xl animate-pulse">
                Contest Starts in {countdown}sec before starting the contest
              </div>
            ) : (
              <Button 
                className="w-32 h-32 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold transition-all hover:scale-105 hover:shadow-lg"
                onClick={() => setIsStarting(true)}
              >
                Start
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
        <DialogContent className="font-mono">
          <DialogHeader>
            <DialogTitle>Enter contest id</DialogTitle>
            <DialogDescription className="space-y-2">
              <div>Ex: codeforces.com/problemset/problem/2047/B</div>
              <div>ContestId=2047</div>
            </DialogDescription>
          </DialogHeader>
          <Input
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter problem URL"
            className="font-mono"
          />
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCustomDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCustomSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 