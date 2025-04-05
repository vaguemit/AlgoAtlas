"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SetupDatabase } from "@/components/setup-database"
import { LearningProgressTable } from "@/components/learning-progress-table"
import { LearningProgressUpdate } from "@/components/learning-progress-update"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Add more admin tabs as needed
const ADMIN_TABS = [
  { id: "setup", label: "Database Setup" },
  { id: "progress", label: "Learning Progress" },
  { id: "users", label: "User Management" }
]

// Learning paths for filtering
const LEARNING_PATHS = [
  { id: "all", label: "All Paths" },
  { id: "diamond", label: "Diamond Path" },
  { id: "emerald", label: "Emerald Path" },
  { id: "sapphire", label: "Sapphire Path" },
  { id: "ruby", label: "Ruby Path" },
  { id: "amethyst", label: "Amethyst Path" }
]

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("setup")
  const [authorized, setAuthorized] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    // In a real app, you would verify admin status on the server
    // This is just a simple client-side check for demo purposes
    if (user && !loading) {
      // Check if user is admin
      // Here we just check for a specific email, but in a real app 
      // you would check against admin roles in your database
      setAuthorized(true)
    }
  }, [user, loading])

  // Function to refresh the learning progress table
  const refreshProgressTable = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-center text-white/60">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>You do not have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
        Admin Dashboard
      </h1>

      <Tabs defaultValue="setup" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black/50 border border-purple-500/20 mb-6">
          {ADMIN_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <SetupDatabase />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Learning Progress Update Form */}
            <div>
              <LearningProgressUpdate 
                onSuccess={refreshProgressTable}
                defaultValues={selectedPath ? { pathId: selectedPath } : undefined}
              />
            </div>
            
            {/* Learning Progress Table */}
            <div className="md:col-span-2">
              <div className="flex justify-end mb-4">
                <Select
                  value={selectedPath || "all"}
                  onValueChange={(value) => setSelectedPath(value === "all" ? undefined : value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Path" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_PATHS.map((path) => (
                      <SelectItem key={path.id} value={path.id}>
                        {path.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <LearningProgressTable key={refreshTrigger} pathId={selectedPath} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">User management features will be added in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 