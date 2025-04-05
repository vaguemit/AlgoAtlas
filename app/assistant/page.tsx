"use client"

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/page-header'
import { AlgoAtlasAssistant } from '@/components/algoatlas-assistant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AssistantPage() {
  const [selectedModel, setSelectedModel] = useState('llama3-70b-8192')
  const [allowFallback, setAllowFallback] = useState(true)

  const handleModelChange = async (value: string) => {
    setSelectedModel(value)
    
    // Update the preferred model in local storage
    localStorage.setItem('preferredModel', value)
    
    // Update the model on the server
    try {
      const response = await fetch('/api/assistant/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          model: value,
          allowFallback 
        }),
      })
      
      if (!response.ok) {
        console.error('Failed to update model preference')
      }
    } catch (error) {
      console.error('Error updating model preference:', error)
    }
  }
  
  const handleFallbackChange = async (checked: boolean) => {
    setAllowFallback(checked)
    
    // Update the fallback preference in local storage
    localStorage.setItem('allowFallback', checked.toString())
    
    // Update the fallback setting on the server
    try {
      const response = await fetch('/api/assistant/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          model: selectedModel,
          allowFallback: checked 
        }),
      })
      
      if (!response.ok) {
        console.error('Failed to update fallback preference')
      }
    } catch (error) {
      console.error('Error updating fallback preference:', error)
    }
  }
  
  // Load preferences from local storage on client side
  useEffect(() => {
    const storedModel = localStorage.getItem('preferredModel')
    const storedFallback = localStorage.getItem('allowFallback')
    
    if (storedModel) setSelectedModel(storedModel)
    if (storedFallback !== null) setAllowFallback(storedFallback === 'true')
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        heading="Whiskers - AlgoAtlas Assistant"
        subheading="Get help with algorithms, data structures, and coding problems"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] overflow-hidden relative">
            <CardHeader className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 border-b border-purple-600/30">
              <CardTitle>Chat with Whiskers</CardTitle>
              <CardDescription className="text-gray-300">
                Ask questions about algorithms, data structures, or get help with coding problems
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-84px)]">
              <div className="h-full w-full p-6">
                <AlgoAtlasAssistant embedded={true} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assistant Settings</CardTitle>
              <CardDescription>Configure your AlgoAtlas Assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="model-select">Model</Label>
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger id="model-select">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama3-70b-8192">Llama3 70B (High Quality)</SelectItem>
                    <SelectItem value="llama3-8b-8192">Llama3 8B (Faster)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedModel === 'llama3-70b-8192' 
                    ? 'Llama3 70B provides more advanced reasoning and detailed responses'
                    : 'Llama3 8B is faster and uses less resources'}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="fallback-mode">Fallback Mode</Label>
                  <p className="text-xs text-gray-500">
                    Automatically switch to 8B model if 70B hits rate limits
                  </p>
                </div>
                <Switch 
                  id="fallback-mode" 
                  checked={allowFallback}
                  onCheckedChange={handleFallbackChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Usage Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="algorithms">
                <TabsList className="w-full">
                  <TabsTrigger value="algorithms" className="flex-1">Algorithms</TabsTrigger>
                  <TabsTrigger value="code" className="flex-1">Code Help</TabsTrigger>
                  <TabsTrigger value="problems" className="flex-1">Problems</TabsTrigger>
                </TabsList>
                <TabsContent value="algorithms" className="mt-4">
                  <ul className="space-y-2 text-sm">
                    <li>• Ask for algorithm explanations with examples</li>
                    <li>• Request time/space complexity analysis</li>
                    <li>• Compare different algorithmic approaches</li>
                    <li>• Explore algorithm variations and optimizations</li>
                  </ul>
                </TabsContent>
                <TabsContent value="code" className="mt-4">
                  <ul className="space-y-2 text-sm">
                    <li>• Debug your code snippets</li>
                    <li>• Convert algorithms between programming languages</li>
                    <li>• Improve code efficiency and readability</li>
                    <li>• Learn idiomatic patterns for your language</li>
                  </ul>
                </TabsContent>
                <TabsContent value="problems" className="mt-4">
                  <ul className="space-y-2 text-sm">
                    <li>• Break down complex problems step by step</li>
                    <li>• Discuss multiple solution strategies</li>
                    <li>• Get hints without full solutions</li>
                    <li>• Analyze test cases and edge conditions</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 