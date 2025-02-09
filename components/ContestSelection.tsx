"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ContestSelection() {
  const [level, setLevel] = useState("")
  const [suggestedLevel, setSuggestedLevel] = useState("")
  const [useRandomProblems, setUseRandomProblems] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleStartContest = () => {
    if (!level) {
      toast({
        title: "Error",
        description: "Please enter a contest level",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Contest Started",
      description: `You've started a level ${level} contest. Good luck!`,
    })

    if (useRandomProblems) {
      router.push(`/train-contest/random/${level}`)
    } else {
      router.push(`/train-contest/${level}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a Contest</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Contest Level
            </Label>
            <Input
              type="number"
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Enter contest level"
              className="mt-1"
            />
          </div>
          {suggestedLevel && (
            <p className="text-sm text-muted-foreground">Suggested level by ThemeCP: {suggestedLevel}</p>
          )}
          <div className="flex items-center space-x-2">
            <Switch id="random-problems" checked={useRandomProblems} onCheckedChange={setUseRandomProblems} />
            <Label htmlFor="random-problems">Use random Codeforces problems</Label>
          </div>
          <Button onClick={handleStartContest}>Start Contest</Button>
        </div>
      </CardContent>
    </Card>
  )
}

