"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function PistonTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runTest() {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/execute-code/test')
      const data = await response.json()
      
      setTestResult(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred during testing')
      console.error('Test error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Piston API Test</h1>
      <p className="mb-6 text-gray-600">
        This page tests the integration with Piston API, which is used for the online compiler.
      </p>
      
      <div className="mb-6">
        <Button onClick={runTest} disabled={loading}>
          {loading ? 'Testing...' : 'Run Test'}
        </Button>
      </div>
      
      {error && (
        <div className="p-4 mb-4 border border-red-300 bg-red-50 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {testResult && (
        <div className="border rounded-md overflow-hidden">
          <div className={`p-4 flex items-center ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className={`mr-3 h-6 w-6 rounded-full flex items-center justify-center ${testResult.success ? 'bg-green-200' : 'bg-red-200'}`}>
              {testResult.success ? '✓' : '✗'}
            </div>
            <span className="font-semibold">{testResult.message || (testResult.success ? 'Test passed!' : 'Test failed')}</span>
          </div>
          
          {testResult.testDetails && (
            <div className="p-4 border-t border-gray-200 bg-white">
              <h3 className="font-semibold mb-2">Test Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Language:</strong> {testResult.testDetails.language}</p>
                  <p><strong>Expected Output:</strong> {testResult.testDetails.expectedOutput}</p>
                  <p><strong>Execution Time:</strong> {testResult.testDetails.executionTime}s</p>
                </div>
                <div>
                  <p><strong>Output:</strong></p>
                  <pre className="p-2 bg-gray-100 rounded text-sm">{testResult.testDetails.output || '(No output)'}</pre>
                  
                  {testResult.testDetails.error && (
                    <>
                      <p className="mt-2"><strong>Error:</strong></p>
                      <pre className="p-2 bg-gray-100 rounded text-sm text-red-600">{testResult.testDetails.error}</pre>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <details>
              <summary className="cursor-pointer text-sm text-gray-600">View raw API response</summary>
              <pre className="mt-2 p-3 bg-black text-green-400 text-xs overflow-auto max-h-80 rounded">
                {JSON.stringify(testResult.apiResponse, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  )
} 