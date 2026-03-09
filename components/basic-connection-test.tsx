'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, RefreshCw, Link, Key } from 'lucide-react'

export function BasicConnectionTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  // Test basic connection
  const testConnection = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/simple-test')
      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setResult({
        status: 'error',
        message: 'Failed to execute test',
        error: err.message
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="border-blue-500/20 bg-black/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Basic Supabase Connection Test</span>
          <Button variant="outline" size="sm" onClick={testConnection} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Test
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            This test checks if your application can connect to Supabase without requiring any complex setup or tables.
          </p>
          
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Connection Status */}
              <div className="p-3 rounded-md bg-black/30">
                <div className="flex items-start">
                  {result.status === 'success' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-green-400 font-medium">Connection Successful!</p>
                        <p className="text-xs mt-1">{result.message}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium">Connection Failed</p>
                        <p className="text-xs mt-1">{result.message}</p>
                        {result.error && (
                          <p className="text-xs mt-1 text-red-300">Error: {result.error}</p>
                        )}
                        {result.statusCode && (
                          <p className="text-xs mt-1">Status: {result.statusCode} {result.statusText}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Environment Info */}
              {result.env && (
                <div className="p-3 rounded-md bg-black/30">
                  <h3 className="text-sm font-medium mb-2">Environment</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-xs">
                      <Link className="h-3 w-3 mr-1" />
                      <span>URL:</span>
                    </div>
                    <div className="text-xs font-mono">{result.env.url}</div>
                    
                    <div className="flex items-center text-xs">
                      <Key className="h-3 w-3 mr-1" />
                      <span>Key Length:</span>
                    </div>
                    <div className="text-xs font-mono">{result.env.keyLength} chars</div>
                  </div>
                </div>
              )}
              
              {/* Test Table Info */}
              {result.status === 'success' && (
                <div className="p-3 rounded-md bg-black/30">
                  <h3 className="text-sm font-medium mb-2">Test Table Check</h3>
                  {result.testTableExists ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <p className="text-xs text-green-400">
                        The test_connection table exists and is accessible
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                      <div>
                        <p className="text-xs text-yellow-400">
                          The test_connection table doesn't exist or isn't accessible
                        </p>
                        {result.testError && (
                          <p className="text-xs mt-1">Error: {result.testError}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Troubleshooting */}
              {result.status === 'error' && (
                <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                  <h3 className="text-sm font-medium mb-2">Troubleshooting Steps:</h3>
                  <ol className="list-decimal pl-5 text-xs space-y-1">
                    <li>Verify your <code className="bg-black/30 px-1 py-0.5 rounded">.env.local</code> file has the correct values</li>
                    <li>Check that your Supabase project is active (not paused)</li>
                    <li>Make sure the URL format is <code className="bg-black/30 px-1 py-0.5 rounded">https://projectid.supabase.co</code></li>
                    <li>Try running the minimal setup SQL script</li>
                    <li>Check your browser console for CORS errors</li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-black/30 rounded-md text-gray-400 text-center">
              Click "Run Test" to check your Supabase connection
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 