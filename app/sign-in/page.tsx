"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function SignIn() {
  const [codeforcesHandle, setCodeforcesHandle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleCodeforcesOAuth = () => {
    // Redirect to Codeforces OAuth page
    window.location.href = "https://codeforces.com/enter"
  }

  const connectCodeforces = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!codeforcesHandle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Codeforces handle",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/codeforces?method=user.info&handles=${encodeURIComponent(codeforcesHandle)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === "OK" && data.result && data.result.length > 0) {
        login(codeforcesHandle)
        toast({
          title: "Success",
          description: "Codeforces account connected successfully!",
        })
        router.push(`/profile/${codeforcesHandle}`)
      } else {
        throw new Error(data.comment || "Invalid Codeforces handle")
      }
    } catch (error) {
      console.error("Error connecting Codeforces account:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect Codeforces account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Connect your Codeforces account to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleCodeforcesOAuth} className="w-full">
            Sign in with Codeforces
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with handle</span>
            </div>
          </div>
          <form onSubmit={connectCodeforces} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codeforcesHandle">Codeforces Handle</Label>
              <Input
                id="codeforcesHandle"
                value={codeforcesHandle}
                onChange={(e) => setCodeforcesHandle(e.target.value)}
                placeholder="Enter your Codeforces handle"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Connecting..." : "Connect with Handle"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

