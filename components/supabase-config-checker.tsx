'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, RefreshCw, Database, Key, Link, Copy } from 'lucide-react'

export function SupabaseConfigChecker() {
  const [isLoading, setIsLoading] = useState(false)
  const [configResults, setConfigResults] = useState<any>(null)
  const [connectionResults, setConnectionResults] = useState<any>(null)
  
  // Function to test configuration
  const testConfig = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/test-config')
      const data = await response.json()
      
      setConfigResults(data)
      
      // Also test basic connection
      testConnection()
    } catch (err: any) {
      setConfigResults({
        status: 'error',
        message: 'Failed to test configuration',
        error: err.message || 'Unknown error'
      })
      setIsLoading(false)
    }
  }
  
  // Function to test basic connection
  const testConnection = async () => {
    try {
      const response = await fetch('/api/test-basic-connection')
      const data = await response.json()
      
      setConnectionResults(data)
    } catch (err: any) {
      setConnectionResults({
        status: 'error',
        message: 'Failed to connect to Supabase',
        error: err.message || 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Auto-run the test on component mount
  useEffect(() => {
    testConfig()
  }, [])

  return (
    <Card className="border-blue-500/20 bg-black/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Supabase Configuration Check</span>
          <Button variant="outline" size="sm" onClick={testConfig} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retest
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Variables */}
        <div>
          <h3 className="text-lg font-medium mb-2">Environment Variables Check</h3>
          
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          ) : configResults ? (
            <div className="space-y-2">
              {configResults.status === 'success' ? (
                <>
                  {/* Public URL */}
                  <div className="flex items-center justify-between p-2 bg-black/30 rounded-md">
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
                    </div>
                    <div className="flex items-center">
                      {configResults.environment.NEXT_PUBLIC_SUPABASE_URL !== 'Not set' ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400">
                          {configResults.environment.NEXT_PUBLIC_SUPABASE_URL}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 ml-1" 
                            onClick={() => {
                              navigator.clipboard.writeText(configResults.environment.NEXT_PUBLIC_SUPABASE_URL)
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-400">
                          Not Set
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Public Key */}
                  <div className="flex items-center justify-between p-2 bg-black/30 rounded-md">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    </div>
                    <div className="flex items-center">
                      {configResults.environment.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'Not set' ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400">
                          {configResults.environment.NEXT_PUBLIC_SUPABASE_ANON_KEY}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-400">
                          Not Set
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Server URL */}
                  <div className="flex items-center justify-between p-2 bg-black/30 rounded-md">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      <span className="text-sm">SUPABASE_URL</span>
                    </div>
                    <div className="flex items-center">
                      {configResults.environment.SUPABASE_URL !== 'Not set' ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400">
                          {configResults.environment.SUPABASE_URL}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                          Not Set (Optional for server-side)
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Server Key */}
                  <div className="flex items-center justify-between p-2 bg-black/30 rounded-md">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      <span className="text-sm">SUPABASE_ANON_KEY</span>
                    </div>
                    <div className="flex items-center">
                      {configResults.environment.SUPABASE_ANON_KEY !== 'Not set' ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400">
                          {configResults.environment.SUPABASE_ANON_KEY}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                          Not Set (Optional for server-side)
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-2 p-3 bg-black/20 rounded-md text-xs">
                    <div className="flex justify-between mb-1">
                      <span>Environment:</span>
                      <span className="font-mono">{configResults.info.nodeEnv}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform:</span>
                      <span className="font-mono">{configResults.info.runningEnvironment}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-red-400">{configResults.message}</p>
                      {configResults.error && (
                        <p className="text-xs mt-1">Error: {configResults.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-black/30 rounded-md text-gray-400">
              No configuration results available.
            </div>
          )}
        </div>
        
        {/* Connection Check */}
        <div>
          <h3 className="text-lg font-medium mb-2">Connection Check</h3>
          
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          ) : connectionResults ? (
            <div className="space-y-2">
              <div className="flex items-center p-3 rounded-md bg-black/30">
                {connectionResults.connection === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-400">Successfully connected to Supabase</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="text-red-400">Failed to connect to Supabase</p>
                      {connectionResults.pingError && (
                        <p className="text-xs mt-1">Error: {connectionResults.pingError}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {connectionResults.connection === 'success' && connectionResults.tables && (
                <div className="p-3 rounded-md bg-black/30">
                  <h4 className="font-medium text-sm mb-2">Available Tables:</h4>
                  {connectionResults.tables.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {connectionResults.tables.map((table: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {table.table_name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-yellow-400">No tables found. Have you run the setup SQL?</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-black/30 rounded-md text-gray-400">
              No connection results available.
            </div>
          )}
        </div>
        
        {/* Troubleshooting */}
        {connectionResults && connectionResults.connection === 'error' && (
          <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20">
            <h4 className="font-medium text-sm mb-2">Troubleshooting:</h4>
            <ol className="list-decimal pl-5 text-sm space-y-1">
              <li>
                Check that your environment variables are properly set in <code className="bg-black/30 px-1 py-0.5 rounded">.env.local</code>
              </li>
              <li>
                Verify the URL format is correct (should be like <code className="bg-black/30 px-1 py-0.5 rounded">https://xxx.supabase.co</code>)
              </li>
              <li>
                Make sure your Supabase project is active and not paused
              </li>
              <li>
                Check for CORS issues in your browser's console
              </li>
              <li>
                Try running the setup SQL in the Supabase SQL Editor
              </li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 