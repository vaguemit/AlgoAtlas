'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, ArrowRight, Database } from 'lucide-react'

export function SetupDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const setupTables = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Create profiles table
      const profilesResponse = await fetch('/api/create-profiles-table')
      if (!profilesResponse.ok) {
        throw new Error('Failed to create profiles table')
      }

      // Create CP tables
      const cpResponse = await fetch('/api/create-cp-tables')
      if (!cpResponse.ok) {
        throw new Error('Failed to create CP tables')
      }
      
      // Create learning progress table
      const learningResponse = await fetch('/api/create-learning-progress-table')
      if (!learningResponse.ok) {
        throw new Error('Failed to create learning progress table')
      }

      setSuccess('Database tables created successfully!')
    } catch (err) {
      console.error('Error setting up tables:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Setup
        </CardTitle>
        <CardDescription>Create required database tables for AlgoAtlas</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-white/80 mb-4">
          This will create the following tables in your Supabase database:
        </p>
        <ul className="list-disc pl-5 text-sm text-white/70 space-y-1.5">
          <li>Profiles table (user profile information)</li>
          <li>Codeforces profiles (Codeforces account data)</li>
          <li>Rating history (competitive programming rating history)</li>
          <li>Learning progress (track learning path progress)</li>
        </ul>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 bg-green-500/20 border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={setupTables}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Setting up...' : 'Setup Database'}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
} 