'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, CheckCircle, RefreshCw, Database, Key, Link, Table } from 'lucide-react'

export function SupabaseDiagnostics() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [environmentVars, setEnvironmentVars] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  })
  
  // Function to test SQL connection
  const testSqlConnection = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/test-sql')
      const data = await response.json()
      
      setTestResults(data)
    } catch (err: any) {
      setTestResults({
        status: 'error',
        message: 'Failed to execute SQL test',
        error: err.message || 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Mask the API key for display
  const maskApiKey = (key: string) => {
    if (!key) return 'Not set'
    if (key.length <= 8) return '********'
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
  }
  
  // Check if URL is valid
  const isValidUrl = (url: string) => {
    try {
      if (!url) return false
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  
  // Auto-run the test on component mount
  useEffect(() => {
    testSqlConnection()
  }, [])
  
  // Check if an expected table exists
  const tableExists = (tableName: string) => {
    if (!testResults?.tables || !Array.isArray(testResults.tables)) return false
    return testResults.tables.some((t: any) => t.table_name === tableName)
  }
  
  // Get badge class based on existence
  const getTableBadgeClass = (exists: boolean) => {
    return exists ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
  }
  
  return (
    <Card className="border-yellow-500/20 bg-black/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Supabase Connection Diagnostics</span>
          <Button variant="outline" size="sm" onClick={testSqlConnection} disabled={isLoading}>
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
          <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-black/30 rounded-md">
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
              </div>
              <div className="flex items-center">
                {isValidUrl(environmentVars.url) ? (
                  <Badge variant="outline" className="bg-green-500/10 text-green-400">
                    {environmentVars.url}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-500/10 text-red-400">
                    {environmentVars.url || 'Not Set'}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-black/30 rounded-md">
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              </div>
              <div className="flex items-center">
                {environmentVars.key ? (
                  <Badge variant="outline" className="bg-green-500/10 text-green-400">
                    {maskApiKey(environmentVars.key)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-500/10 text-red-400">
                    Not Set
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {(!environmentVars.url || !environmentVars.key) && (
            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium">Missing environment variables</p>
                  <p className="mt-1">
                    Make sure you have a <code className="bg-black/30 px-1 py-0.5 rounded">.env.local</code> file in your project root with the following variables:
                  </p>
                  <pre className="bg-black/30 p-2 mt-2 rounded text-xs overflow-auto">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{'\n'}
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* SQL Test Results */}
        <div>
          <h3 className="text-lg font-medium mb-2">Database Connection Test</h3>
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          ) : testResults ? (
            <div className="space-y-2">
              <div className="flex items-start p-3 rounded-md bg-black/30">
                {testResults.status === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-green-400">{testResults.message}</p>
                      
                      {testResults.profilesCount !== undefined && (
                        <p className="text-xs mt-1">Profiles Count: {testResults.profilesCount}</p>
                      )}
                      
                      {testResults.tables && testResults.tables.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Available Tables:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {testResults.tables.map((table: any, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {table.table_name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-red-400">{testResults.message}</p>
                      {testResults.error && (
                        <p className="text-xs mt-1">Error: {testResults.error}</p>
                      )}
                      {testResults.profilesError && (
                        <p className="text-xs mt-1">Profiles Error: {testResults.profilesError}</p>
                      )}
                      {testResults.tablesError && (
                        <p className="text-xs mt-1">Tables Error: {testResults.tablesError}</p>
                      )}
                      {testResults.supabaseUrl && (
                        <p className="text-xs mt-1">Supabase URL: {testResults.supabaseUrl}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {/* Required Tables Check */}
              {testResults.status === 'success' && (
                <div className="p-3 rounded-md bg-black/30">
                  <h4 className="font-medium text-sm mb-2">Required Tables Check:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between p-2 bg-black/40 rounded-md">
                      <div className="flex items-center">
                        <Table className="h-4 w-4 mr-2" />
                        <span className="text-xs">profiles</span>
                      </div>
                      <Badge variant="outline" className={getTableBadgeClass(tableExists('profiles'))}>
                        {tableExists('profiles') ? 'Found' : 'Missing'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-black/40 rounded-md">
                      <div className="flex items-center">
                        <Table className="h-4 w-4 mr-2" />
                        <span className="text-xs">codeforces_profiles</span>
                      </div>
                      <Badge variant="outline" className={getTableBadgeClass(tableExists('codeforces_profiles'))}>
                        {tableExists('codeforces_profiles') ? 'Found' : 'Missing'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-black/40 rounded-md">
                      <div className="flex items-center">
                        <Table className="h-4 w-4 mr-2" />
                        <span className="text-xs">codechef_profiles</span>
                      </div>
                      <Badge variant="outline" className={getTableBadgeClass(tableExists('codechef_profiles'))}>
                        {tableExists('codechef_profiles') ? 'Found' : 'Missing'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-black/40 rounded-md">
                      <div className="flex items-center">
                        <Table className="h-4 w-4 mr-2" />
                        <span className="text-xs">rating_history</span>
                      </div>
                      <Badge variant="outline" className={getTableBadgeClass(tableExists('rating_history'))}>
                        {tableExists('rating_history') ? 'Found' : 'Missing'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {testResults.status === 'error' && (
                <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                  <h4 className="font-medium text-sm mb-2">Troubleshooting Steps:</h4>
                  <ol className="list-decimal pl-5 text-sm space-y-1">
                    <li>Verify your Supabase URL and anon key in <code>.env.local</code> match your project</li>
                    <li>Check if your Supabase project is active and not paused</li>
                    <li>Confirm you've run the SQL setup script in Supabase SQL Editor</li>
                    <li>Check your browser console for CORS or other errors</li>
                    <li>Verify your project hasn't exceeded free tier limits</li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-black/30 rounded-md text-gray-400">
              No test results available. Click &quot;Test&quot; to check database connection.
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Quick Create Table */}
        <div>
          <h3 className="text-lg font-medium mb-2">Create Test Table</h3>
          <p className="text-sm text-gray-400 mb-3">
            Try creating a test table to verify write permissions.
          </p>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={async () => {
              try {
                const response = await fetch('/api/create-test-table', {
                  method: 'POST'
                });
                const data = await response.json();
                
                if (data.error) {
                  throw new Error(data.error);
                }
                
                alert('Test table check completed. ' + (data.message || ''));
                testSqlConnection(); // Refresh the data
              } catch (err: any) {
                alert(`Failed to create test table: ${err.message}`);
              }
            }}
          >
            <Database className="h-4 w-4 mr-2" />
            Create test_entries Table
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 