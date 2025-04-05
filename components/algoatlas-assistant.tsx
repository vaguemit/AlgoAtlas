"use client"

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, SendHorizonal, Bot, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
}

interface AlgoAtlasAssistantProps {
  embedded?: boolean
  hideFloatingButton?: boolean
  userConfig?: {
    model: string
    allowFallback: boolean
  }
}

export function AlgoAtlasAssistant({ embedded = false, hideFloatingButton = false, userConfig }: AlgoAtlasAssistantProps) {
  const [isOpen, setIsOpen] = useState(embedded ? true : false)
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState(userConfig?.model || 'llama3-70b-8192')
  const [isFallbackActive, setIsFallbackActive] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Add custom CSS for better code block handling
  useEffect(() => {
    // Add custom CSS for code blocks and pre tags
    const style = document.createElement('style')
    style.innerHTML = `
      .algoatlas-chat pre {
        max-width: 100%;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        background-color: #1e1a36;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 0.75rem 0;
      }
      
      .algoatlas-chat code {
        word-break: break-all;
        white-space: pre-wrap;
        font-family: 'JetBrains Mono', monospace, Menlo, Monaco, Consolas, 'Courier New';
        font-size: 0.9em;
        max-width: 100%;
        display: inline-block;
      }
      
      .algoatlas-chat p {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
        margin-bottom: 0.75rem;
        max-width: 100%;
      }
      
      .algoatlas-chat p:last-child {
        margin-bottom: 0;
      }
      
      .algoatlas-chat .overflow-wrap-anywhere {
        overflow-wrap: anywhere;
      }
      
      .algoatlas-chat ul, .algoatlas-chat ol {
        margin-left: 1.5rem;
        margin-bottom: 0.75rem;
        max-width: calc(100% - 1.5rem);
      }
      
      .algoatlas-chat li {
        margin-bottom: 0.25rem;
      }
      
      .algoatlas-chat * {
        max-width: 100%;
        overflow-wrap: break-word;
      }
      
      .algoatlas-chat a {
        word-break: break-all;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Scroll to bottom of chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

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
          userConfig
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

  return (
    <div className={embedded ? "h-full w-full" : "fixed bottom-4 right-4 z-50 flex flex-col items-end"}>
      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={embedded ? { opacity: 1, y: 0, height: 'auto' } : { opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={embedded ? { opacity: 1 } : { opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className={embedded 
              ? "w-full h-full flex flex-col bg-[#120A26] border border-purple-600/40 rounded-lg shadow-2xl shadow-purple-900/20"
              : "mb-2 w-[90vw] max-w-[450px] sm:max-w-[400px] md:max-w-[450px] bg-[#120A26] border border-purple-600/40 rounded-lg shadow-2xl shadow-purple-900/40 flex flex-col max-h-[600px]"
            }
          >
            {/* Chat Header - Only show in floating mode or if embedded but not showing toggle button */}
            {(!embedded || (embedded && !isOpen)) && (
              <div className="flex justify-between items-center p-3 border-b border-purple-600/40 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image 
                      src="/catt.png"
                      alt="Whiskers"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-white">Whiskers</span>
                </div>
                {!embedded && (
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close assistant"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className={`algoatlas-chat flex-1 overflow-y-auto p-4 flex flex-col gap-4 ${
                embedded ? "min-h-0" : "min-h-[300px] max-h-[500px]"
              } scrollbar-thin scrollbar-thumb-purple-600/30 scrollbar-track-transparent`}
            >
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <div className="max-w-sm space-y-4">
                    <div className="flex justify-center">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-purple-500/40 bg-purple-500/10 p-1">
                        <Image 
                          src="/catt.png"
                          alt="Whiskers"
                          fill
                          className="object-contain p-0"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Whiskers</h3>
                      <p className="text-gray-300">I'm your AlgoAtlas Assistant. Ask me about algorithms, data structures, or any programming questions you have!</p>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex flex-col",
                      message.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl max-w-[85%] shadow-md overflow-hidden",
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
                    <span className="text-xs text-gray-500 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-[#1A1035] text-white px-4 py-3 rounded-2xl rounded-tl-none flex items-center shadow-md border border-purple-500/20">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-purple-400" />
                    <span>Processing your request...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-purple-600/30 bg-[#150d2e]">
              <div className="flex items-start gap-2 max-w-full">
                <div className="flex-1 min-w-0 bg-[#1A1035] rounded-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-purple-500 border border-purple-500/30 focus-within:border-transparent shadow-inner">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onInput={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Whiskers anything..."
                    className="w-full bg-transparent resize-none px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto overflow-x-hidden text-sm"
                    rows={1}
                    style={{ 
                      overflowWrap: 'break-word', 
                      wordBreak: 'break-word',
                      textOverflow: 'ellipsis'
                    }}
                  />
                </div>
                <div className="flex-shrink-0">
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
              </div>
              <div className="mt-2 text-xs text-gray-500 flex justify-between items-center px-1">
                <span>Shift+Enter for new line</span>
                <span className={isFallbackActive ? "text-amber-400" : "text-gray-400"}>
                  Powered by <span className="font-medium">{currentModel}</span>
                  {isFallbackActive && " (Fallback)"}
                </span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle Button - Only show in non-embedded mode and when not hidden */}
      {!embedded && !hideFloatingButton && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-xl flex items-center gap-2 border border-purple-500/30"
        >
          <div className="relative w-5 h-5">
            <Image 
              src="/catt.png"
              alt="Whiskers"
              fill
              className="object-cover"
            />
          </div>
          <span className={cn("font-medium", isOpen && "hidden")}>Whiskers</span>
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </motion.button>
      )}
    </div>
  )
} 