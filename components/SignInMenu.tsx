"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface SignInMenuProps {
  onCodeforcesConnect: (handle: string) => void
}

export function SignInMenu({ onCodeforcesConnect }: SignInMenuProps) {
  const [codeforcesHandle, setCodeforcesHandle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
        onCodeforcesConnect(codeforcesHandle)
        toast({
          title: "Success",
          description: "Codeforces account connected successfully!",
        })
        setIsOpen(false)
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button>Sign In</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="w-full space-y-2">
            <Label htmlFor="codeforcesHandle">Codeforces Handle</Label>
            <Input
              id="codeforcesHandle"
              value={codeforcesHandle}
              onChange={(e) => setCodeforcesHandle(e.target.value)}
              placeholder="Enter Codeforces handle"
            />
            <Button onClick={connectCodeforces} disabled={isLoading} className="w-full">
              {isLoading ? "Connecting..." : "Connect Codeforces"}
            </Button>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

