"use client"

import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Not Signed In</h2>
        <p className="text-white/70 mb-6">Please sign in to access settings</p>
        <Button asChild>
          <a href="/login">Sign In</a>
        </Button>
      </div>
    )
  }
  
  const handleSaveSettings = async () => {
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem updating your preferences",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Profile Settings</CardTitle>
          <CardDescription className="text-white/70">
            Manage your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-black/40 border-purple-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={user.email || ""}
              disabled
              className="bg-black/40 border-purple-500/20 text-white/50"
            />
            <p className="text-xs text-white/50">Your email address is used for account-related notifications</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Notification Preferences</CardTitle>
          <CardDescription className="text-white/70">
            Control what notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="completion">Learning Path Completion</Label>
              <p className="text-sm text-white/50">
                Receive notifications when you complete a learning path module
              </p>
            </div>
            <Switch
              id="completion"
              checked={notifyOnCompletion}
              onCheckedChange={setNotifyOnCompletion}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders">Daily Reminders</Label>
              <p className="text-sm text-white/50">
                Get daily reminders to continue your learning
              </p>
            </div>
            <Switch
              id="reminders"
              checked={dailyReminders}
              onCheckedChange={setDailyReminders}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Account Management</CardTitle>
          <CardDescription className="text-white/70">
            Manage your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-white/70">
              Account actions such as changing your password or deleting your account.
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full sm:w-auto">
                Change Password
              </Button>
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 