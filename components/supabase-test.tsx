'use client'

import { useState, useEffect } from 'react'
import { useSupabaseQuery, useSupabaseMutation } from '@/hooks/use-supabase-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Check, AlertCircle, RefreshCw } from 'lucide-react'

export function SupabaseTest() {
  const [testId] = useState(`test-${Date.now().toString()}`)
  const [shouldRefresh, setShouldRefresh] = useState(0)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  
  // Test query to see if we can read from the database
  const { 
    data, 
    isLoading: queryLoading, 
    error: queryError,
    refetch,
    count 
  } = useSupabaseQuery({
    table: 'profiles',
    limit: 5,
    enabled: true
  })
  
  // Test mutation to verify if we can write to the database
  const { 
    insert, 
    update, 
    remove,
    isLoading: mutationLoading, 
    error: mutationError 
  } = useSupabaseMutation('test_entries')
  
  // Function to test the API endpoint
  const testApiEndpoint = async () => {
    setApiLoading(true)
    setApiError(null)
    
    try {
      const response = await fetch('/api/test-supabase')
      const data = await response.json()
      
      setApiResponse(data)
      
      if (data.status === 'error') {
        throw new Error(data.error || 'API test failed')
      }
      
      toast.success('API test successful', {
        description: 'The server-side Supabase connection is working.'
      })
    } catch (err: any) {
      setApiError(err.message || 'An unknown error occurred')
      toast.error('API test failed', {
        description: err.message || 'Failed to connect to the API endpoint.'
      })
    } finally {
      setApiLoading(false)
    }
  }
  
  // Function to test insert operation
  const handleTestInsert = async () => {
    try {
      const { data, error } = await insert({
        id: testId,
        created_at: new Date().toISOString(),
        message: 'Test insert successful'
      })
      
      if (error) throw error
      
      toast.success('Test insert successful', {
        description: 'The record was added to the database.'
      })
      
      setShouldRefresh(prev => prev + 1)
    } catch (err: any) {
      toast.error('Test insert failed', {
        description: err.message || 'An unknown error occurred'
      })
    }
  }
  
  // Function to test update operation
  const handleTestUpdate = async () => {
    try {
      const { data, error } = await update({
        message: `Test update successful - ${new Date().toLocaleTimeString()}`
      }, 'id', testId)
      
      if (error) throw error
      
      toast.success('Test update successful', {
        description: 'The record was updated in the database.'
      })
      
      setShouldRefresh(prev => prev + 1)
    } catch (err: any) {
      toast.error('Test update failed', {
        description: err.message || 'An unknown error occurred'
      })
    }
  }
  
  // Function to test delete operation
  const handleTestDelete = async () => {
    try {
      const { data, error } = await remove('id', testId)
      
      if (error) throw error
      
      toast.success('Test delete successful', {
        description: 'The record was removed from the database.'
      })
      
      setShouldRefresh(prev => prev + 1)
    } catch (err: any) {
      toast.error('Test delete failed', {
        description: err.message || 'An unknown error occurred'
      })
    }
  }
  
  // Automatically test the API endpoint on component mount
  useEffect(() => {
    testApiEndpoint()
  }, [])
  
  return (
    <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Supabase Query System Test</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Test Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">API Test (Server-side)</h3>
          <div className="bg-black/30 rounded-md p-4">
            {apiLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : apiError ? (
              <div className="text-red-500 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Error: {apiError}
              </div>
            ) : apiResponse ? (
              <div>
                <div className="flex items-center mb-2">
                  {apiResponse.status === 'success' ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>
                    {apiResponse.message || 'API test completed'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="text-xs bg-black/50 p-2 rounded">
                    <div className="font-semibold mb-1">Direct Client:</div>
                    <div className={apiResponse.direct_client?.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                      Status: {apiResponse.direct_client?.status || 'unknown'}
                    </div>
                    {apiResponse.direct_client?.count !== undefined && (
                      <div>Count: {apiResponse.direct_client.count}</div>
                    )}
                    {apiResponse.direct_client?.error && (
                      <div className="text-red-400">Error: {apiResponse.direct_client.error}</div>
                    )}
                  </div>
                  <div className="text-xs bg-black/50 p-2 rounded">
                    <div className="font-semibold mb-1">Server Client:</div>
                    <div className={apiResponse.server_client?.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                      Status: {apiResponse.server_client?.status || 'unknown'}
                    </div>
                    {apiResponse.server_client?.count !== undefined && (
                      <div>Count: {apiResponse.server_client.count}</div>
                    )}
                    {apiResponse.server_client?.error && (
                      <div className="text-red-400">Error: {apiResponse.server_client.error}</div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-right text-xs text-gray-500">
                  Tested at: {new Date(apiResponse.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="text-yellow-500">No API response data available</div>
            )}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testApiEndpoint} 
                disabled={apiLoading}
              >
                {apiLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test API Endpoint'
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Query Test Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Query Test (Client-side Read)</h3>
          <div className="bg-black/30 rounded-md p-4">
            {queryLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : queryError ? (
              <div className="text-red-500 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Error: {queryError.message}
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Query Success! Found {count} records</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">Sample data from 'profiles' table:</div>
                <div className="space-y-2">
                  {data && data.length > 0 ? (
                    data.map((item: any, index) => (
                      <div key={index} className="text-sm p-2 bg-black/50 rounded">
                        ID: {item.id?.substring(0, 8)}...
                        {item.username && <span> | Username: {item.username}</span>}
                        {item.created_at && <span> | Created: {new Date(item.created_at).toLocaleDateString()}</span>}
                      </div>
                    ))
                  ) : (
                    <div className="text-yellow-500">No records found in the profiles table</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Mutation Test Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Mutation Test (Client-side Write)</h3>
          <div className="grid gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Test ID: <Badge variant="outline">{testId}</Badge>
              </p>
              {mutationError && (
                <div className="text-red-500 text-sm mb-2">
                  Error: {mutationError.message}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={handleTestInsert}
                disabled={mutationLoading}
              >
                Test Insert
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestUpdate}
                disabled={mutationLoading}
              >
                Test Update
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestDelete}
                disabled={mutationLoading}
              >
                Test Delete
              </Button>
            </div>
          </div>
          
          {/* Test insert results */}
          <div className="bg-black/30 rounded-md p-4">
            {mutationLoading ? (
              <div className="flex items-center justify-center py-2">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <div className="text-sm">
                <div>
                  Status: <span className="text-blue-400">Ready to test</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Click the buttons above to test database write operations.
                  Results will appear here and in toast notifications.
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Overall Status */}
        <div className="mt-4 p-3 rounded-md bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm">
            <span className="font-semibold">Complete Test Sequence:</span> First check if the API test passed,
            then verify that the Query test is successful, and finally run the Mutation tests in order (Insert → Update → Delete).
            If all tests pass, your Supabase query system is working correctly!
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 