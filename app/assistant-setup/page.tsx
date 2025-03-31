"use client"

import { useState } from 'react'
import { Bot, Check, Copy, Key, AlertTriangle, RefreshCw } from 'lucide-react'

export default function AssistantSetupPage() {
  const [apiKey, setApiKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [isTestLoading, setIsTestLoading] = useState(false)
  const [testResponse, setTestResponse] = useState('')
  const [setupStatus, setSetupStatus] = useState<'pending' | 'success' | 'error'>('pending')
  
  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return
    
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/assistant/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })
      
      if (response.ok) {
        setSetupStatus('success')
      } else {
        setSetupStatus('error')
      }
    } catch (error) {
      console.error('Error saving API key:', error)
      setSetupStatus('error')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleTestAssistant = async () => {
    if (!testMessage.trim()) return
    
    setIsTestLoading(true)
    setTestResponse('')
    
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: testMessage, history: [] }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestResponse(data.response || 'No response received')
      } else {
        setTestResponse('Error: Failed to get response from assistant')
      }
    } catch (error) {
      console.error('Error testing assistant:', error)
      setTestResponse('Error: Failed to connect to the assistant API')
    } finally {
      setIsTestLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Configure Whiskers - AlgoAtlas Assistant
          </h1>
          <p className="text-lg text-blue-100/80">
            Configure your Groq-powered AlgoAtlas Assistant with llama3-70b-8192 model
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* API Key Configuration */}
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Key className="text-purple-400 h-5 w-5" />
              <h2 className="text-xl font-semibold">API Key Configuration</h2>
            </div>
            
            <p className="text-gray-300 mb-4">
              Enter your Groq API key to power the AlgoAtlas Assistant. You can get an API key from the 
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 ml-1"
              >
                Groq Console
              </a>.
            </p>
            
            <div className="mb-4">
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-1">
                Groq API Key
              </label>
              <div className="relative">
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {setupStatus === 'success' && (
                  <span className="flex items-center text-green-400">
                    <Check className="h-4 w-4 mr-1" />
                    API key saved
                  </span>
                )}
                {setupStatus === 'error' && (
                  <span className="flex items-center text-red-400">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Failed to save API key
                  </span>
                )}
              </div>
              
              <button
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim() || isSaving}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save API Key'
                )}
              </button>
            </div>
          </div>
          
          {/* Test Assistant */}
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="text-purple-400 h-5 w-5" />
              <h2 className="text-xl font-semibold">Test Assistant</h2>
            </div>
            
            <p className="text-gray-300 mb-4">
              Send a test message to verify that your AlgoAtlas Assistant is working properly with the Groq API.
            </p>
            
            <div className="mb-4">
              <label htmlFor="test-message" className="block text-sm font-medium text-gray-300 mb-1">
                Test Message
              </label>
              <textarea
                id="test-message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Ask a question about algorithms or data structures..."
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[100px]"
              />
            </div>
            
            <div className="mb-4">
              <button
                onClick={handleTestAssistant}
                disabled={!testMessage.trim() || isTestLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {isTestLoading ? (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Test Assistant'
                )}
              </button>
            </div>
            
            {testResponse && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-300">Response</h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(testResponse)}
                    className="text-gray-400 hover:text-white"
                    title="Copy response"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="bg-navy-900/50 border border-purple-500/20 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{testResponse}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-purple-400 mb-2">API Integration</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Uses Groq API with llama3-70b-8192 model</li>
                <li>Implemented with the official Groq Node.js SDK</li>
                <li>Maintains conversation history for context</li>
                <li>Custom system prompt for programming assistance</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-purple-400 mb-2">UI Components</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Floating chat interface on all pages</li>
                <li>Markdown support for code snippets</li>
                <li>Responsive design for all screen sizes</li>
                <li>Syntax highlighting for code blocks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 