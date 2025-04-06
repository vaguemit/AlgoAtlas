"use client"

import { useState, useEffect, useRef } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { SendHorizonal, Loader2, X, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
}

export default function AssistantPage() {
  const { user } = useAuth()
  const [selectedModel, setSelectedModel] = useState('llama3-70b-8192')
  const [allowFallback, setAllowFallback] = useState(true)
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState('llama3-70b-8192')
  const [isFallbackActive, setIsFallbackActive] = useState(false)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Add a new state for tracking screen size
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile when component mounts
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind
    };
    
    // Initial check
    checkMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle model change
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
  
  // Handle fallback change
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
  
  // Handle textarea height adjustment
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target) {
      e.target.style.height = 'auto'
      e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return
    
    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    
    // Add user message to chat
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)
    
    try {
      // Prepare conversation history for the API
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // Call API
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          history,
          userConfig: {
            model: selectedModel,
            allowFallback
          }
        })
      })
      
      const data = await response.json()
      
      // Handle rate limiting
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit error - show message to user but don't throw an error
          const errorMessage: Message = {
            role: 'assistant',
            content: `⏱️ ${data.message || 'You\'re sending messages too quickly. Please wait before sending another message.'}`,
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, errorMessage])
          setIsLoading(false)
          return; // Exit early without throwing an error
        } else {
          throw new Error('Failed to get response from assistant')
        }
      }
      
      // Check if fallback model was used
      if (data.fallbackUsed) {
        setIsFallbackActive(true)
        setCurrentModel(data.model)
      } else {
        setIsFallbackActive(false)
        setCurrentModel(data.model)
      }
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Sorry, I couldn\'t generate a response. Please try again.',
        timestamp: new Date(),
        model: data.model
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error sending message:', error)
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again later.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key to submit (with Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Scroll to bottom of chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])
  
  // Load preferences from local storage on client side
  useEffect(() => {
    // Add custom styling for markdown content
    const style = document.createElement('style')
    style.innerHTML = `
      .assistant-chat pre {
        max-width: 100%;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        background-color: #1e1a36;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 0.75rem 0;
      }
      
      .assistant-chat code {
        word-break: break-all;
        white-space: pre-wrap;
        font-family: 'JetBrains Mono', monospace, Menlo, Monaco, Consolas, 'Courier New';
        font-size: 0.9em;
        max-width: 100%;
        display: inline-block;
      }
      
      .assistant-chat p {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
        margin-bottom: 0.75rem;
        max-width: 100%;
      }
      
      .assistant-chat p:last-child {
        margin-bottom: 0;
      }
      
      .assistant-chat .overflow-wrap-anywhere {
        overflow-wrap: anywhere;
      }
      
      .assistant-chat ul, .assistant-chat ol {
        margin-left: 1.5rem;
        margin-bottom: 0.75rem;
        max-width: calc(100% - 1.5rem);
      }
      
      .assistant-chat li {
        margin-bottom: 0.25rem;
      }
      
      .assistant-chat * {
        max-width: 100%;
        overflow-wrap: break-word;
      }
      
      .assistant-chat a {
        word-break: break-all;
      }
      
      .assistant-chat table {
        border-collapse: collapse;
        margin: 1rem 0;
        overflow-x: auto;
        display: block;
        width: fit-content;
        max-width: 100%;
      }
      
      .assistant-chat th, .assistant-chat td {
        border: 1px solid #333;
        padding: 0.5rem;
      }
      
      .assistant-chat th {
        background-color: #1a1a2e;
      }
    `
    document.head.appendChild(style)
    
    const storedModel = localStorage.getItem('preferredModel')
    const storedFallback = localStorage.getItem('allowFallback')
    
    if (storedModel) setSelectedModel(storedModel)
    if (storedFallback !== null) setAllowFallback(storedFallback === 'true')
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Return LoginUI if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto py-12">
        <PageHeader
          heading="AlgoAtlas Assistant"
          subheading="Get help with algorithms, data structures, and coding problems"
        />
        
        <div className="flex justify-center mt-8">
          <div className="bg-black/60 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-purple-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
                Login Required
              </h3>
              
              <p className="text-gray-300 mb-6">
                You need to be logged in to access the AI assistant.
                Please sign in with your account to continue.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-purple-500/30 hover:bg-purple-500/20"
                >
                  <Link href="/register">
                    Register
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "container mx-auto py-6 space-y-8 pb-16",
      isMobile && "p-0 py-0 space-y-0" // Remove padding on mobile
    )}>
      {/* Header only visible on desktop */}
      <div className="hidden lg:block">
      <PageHeader
          heading="AlgoAtlas Assistant"
        subheading="Get help with algorithms, data structures, and coding problems"
      />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Area - Takes up full width on mobile */}
        <div className="lg:col-span-3 col-span-1">
          <Card className={cn(
            "shadow-xl border-purple-600/20 overflow-hidden",
            isMobile && "rounded-none border-0 shadow-none h-screen" // Full height on mobile, no borders
          )}>
            <CardHeader className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 border-b border-purple-600/30 flex flex-row items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-purple-500/40 bg-purple-500/10">
                <Image 
                  src="/catt.png"
                  alt="Whiskers"
                  fill
                  className="object-cover p-0.5"
                />
              </div>
              <div>
                <CardTitle>Whiskers</CardTitle>
              <CardDescription className="text-gray-300">
                  Your personal algorithm assistant
              </CardDescription>
              </div>
              {/* Close button only visible on mobile */}
              <div className="ml-auto lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-1"
                  onClick={() => window.location.href = "/"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <div className={cn(
              "flex flex-col h-[600px]",
              isMobile && "h-[calc(100vh-64px)]" // Adjust height on mobile (screen height - header)
            )}>
              {/* Chat Messages Area */}
              <div 
                ref={chatContainerRef}
                className={cn(
                  "assistant-chat flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#120A26]",
                  isMobile && "p-3 touch-auto overscroll-contain"
                )}
              >
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <div className="max-w-md space-y-6">
                      <div className="flex justify-center">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-purple-500/40 bg-purple-500/10 p-2">
                          <Image 
                            src="/catt.png"
                            alt="Whiskers"
                            fill
                            className="object-contain p-0"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Welcome to Whiskers</h3>
                        <p className="text-gray-300 mb-4">I'm your AlgoAtlas Assistant. Ask me about algorithms, data structures, or any programming questions you have!</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                          {[
                            "Explain the time complexity of quicksort",
                            "Write a function to check if a binary tree is balanced",
                            "What's the difference between BFS and DFS?",
                            "Help debug my recursive function"
                          ].map((suggestion, index) => (
                            <Button 
                              key={index}
                              variant="outline" 
                              className="bg-purple-900/20 border-purple-500/30 hover:bg-purple-800/30 text-left h-auto py-3 whitespace-normal"
                              onClick={() => {
                                setInputMessage(suggestion)
                                if (inputRef.current) {
                                  inputRef.current.focus()
                                  inputRef.current.style.height = 'auto'
                                  inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px'
                                }
                              }}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex flex-col max-w-[85%]",
                        message.role === "user" ? "items-end self-end" : "items-start self-start"
                      )}
                    >
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl shadow-md overflow-hidden",
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-none shadow-blue-900/20"
                            : "bg-[#1A1035] text-white rounded-tl-none shadow-purple-900/10 border border-purple-500/20"
                        )}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none break-words overflow-hidden">
                            <ReactMarkdown components={{
                              p: ({ children }) => <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full">{children}</p>,
                              code: ({ className, children }) => (
                                <code className={`${className || ''} break-words overflow-wrap-anywhere px-1 py-0.5 bg-gray-800 rounded text-gray-200 max-w-full inline-block`}>
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="overflow-x-auto p-3 bg-gray-800 rounded-md whitespace-pre-wrap border border-gray-700 max-w-full">
                                  {children}
                                </pre>
                              ),
                              h1: ({ children }) => <h1 className="text-xl font-bold my-3 text-purple-300 max-w-full break-words">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-lg font-bold my-2 text-purple-300 max-w-full break-words">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-md font-bold my-2 text-purple-300 max-w-full break-words">{children}</h3>,
                              ul: ({ children }) => <ul className="list-disc pl-5 my-2 max-w-[calc(100%-1.25rem)]">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-5 my-2 max-w-[calc(100%-1.25rem)]">{children}</ol>,
                              li: ({ children }) => <li className="mb-1 break-words">{children}</li>,
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" 
                                   className="text-blue-400 hover:text-blue-300 underline break-all">{children}</a>
                              ),
                              img: ({ src, alt }) => (
                                <img src={src} alt={alt || ""} className="max-w-full h-auto rounded-md my-2" />
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto max-w-full">
                                  <table className="border-collapse border border-gray-700 my-2">{children}</table>
                                </div>
                              ),
                            }}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                            {message.content}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.role === "assistant" && message.model && (
                          <span className="text-xs bg-purple-900/30 px-2 py-0.5 rounded-full text-purple-300">
                            {message.model}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start max-w-[85%]">
                    <div className="bg-[#1A1035] text-white px-4 py-3 rounded-2xl rounded-tl-none flex items-center shadow-md border border-purple-500/20">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin text-purple-400" />
                      <span>Processing your request...</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input Area */}
              <div className="p-4 border-t border-purple-600/30 bg-[#150d2e]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div className="flex items-start gap-2 max-w-full">
                    <div className="flex-1 min-w-0 bg-[#1A1035] rounded-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-purple-500 border border-purple-500/30 focus-within:border-transparent shadow-inner">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onInput={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Whiskers anything..."
                        className="w-full bg-transparent resize-none px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto overflow-x-hidden"
                        rows={1}
                        style={{ 
                          overflowWrap: 'break-word', 
                          wordBreak: 'break-word',
                          textOverflow: 'ellipsis'
                        }}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className={cn(
                        "bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 h-12 w-12 rounded-full flex-shrink-0 shadow-lg shadow-purple-900/30",
                        (!inputMessage.trim() || isLoading) && "opacity-70"
                      )}
                      size="icon"
                    >
                      <SendHorizonal className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                    <span>Shift+Enter for new line</span>
                    <span className={isFallbackActive ? "text-amber-400" : "text-gray-400"}>
                      {isLoading ? "Generating response..." : `Using ${currentModel}`}
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Settings and Help Section - Only visible on desktop */}
        <div className="space-y-6 hidden lg:block">
          <Card className="shadow-lg border-purple-600/20">
            <CardHeader>
              <CardTitle>Assistant Settings</CardTitle>
              <CardDescription>Configure your AI assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="model-select">Model</Label>
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger id="model-select" className="bg-[#1A1035] border-purple-500/30">
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
          
          <Card className="shadow-lg border-purple-600/20">
            <CardHeader>
              <CardTitle>Usage Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="algorithms">
                <TabsList className="w-full bg-[#1A1035]">
                  <TabsTrigger value="algorithms" className="flex-1 data-[state=active]:bg-purple-600">Algorithms</TabsTrigger>
                  <TabsTrigger value="code" className="flex-1 data-[state=active]:bg-purple-600">Code Help</TabsTrigger>
                  <TabsTrigger value="problems" className="flex-1 data-[state=active]:bg-purple-600">Problems</TabsTrigger>
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