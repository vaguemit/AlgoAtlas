"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { UserProfile } from "@/components/UserProfile"
import type { CodeforcesUser } from "@/types/codeforces"

interface CodeforcesConnectProps {
  onConnect: (handle: string) => void
}

export function CodeforcesConnect({ onConnect }: CodeforcesConnectProps) {
  const [codeforcesHandle, setCodeforcesHandle] = useState("")
  const [userInfo, setUserInfo] = useState<CodeforcesUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const connectCodeforces = async () => {
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
      const response = await fetch(`/api/codeforces?method=user.info&handles=${codeforcesHandle}`)
      const data = await response.json()

      if (data.status === "OK" && data.result.length > 0) {
        setUserInfo(data.result[0])
        onConnect(codeforcesHandle)
        toast({
          title: "Success",
          description: "Codeforces account connected successfully!",
        })
      } else {
        throw new Error(data.error || "Failed to fetch user info")
      }
    } catch (error) {
      console.error("Error connecting Codeforces account:", error)
      toast({
        title: "Error",
        description: "Failed to connect Codeforces account. Please check the handle and try again.",
        variant: "destructive",
      })
      setUserInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-6 max-w-2xl mx-auto">
      <Label htmlFor="codeforcesHandle">Connect your Codeforces account:</Label>
      <div className="flex mt-1">
        <Input
          id="codeforcesHandle"
          type="text"
          value={codeforcesHandle}
          onChange={(e) => setCodeforcesHandle(e.target.value)}
          placeholder="Enter your Codeforces handle"
          className="mr-2"
        />
        <Button onClick={connectCodeforces} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect"}
        </Button>
      </div>
      {userInfo && (
        <div className="mt-4">
          <UserProfile user={userInfo} />
        </div>
      )}
    </div>
  )
}

