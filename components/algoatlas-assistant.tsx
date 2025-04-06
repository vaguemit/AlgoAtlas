"use client"

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, SendHorizonal, Bot, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from './login-prompt'

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
  const { user } = useAuth()
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
    const style = document.createElement('style')
    style.innerHTML = `
      .algoatlas-chat pre {
        max-width: 100%;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      
      .algoatlas-chat code {
        word-break: break-all;
        white-space: pre-wrap;
      }
      
      .algoatlas-chat p {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
      }
      
      .algoatlas-chat .overflow-wrap-anywhere {
        overflow-wrap: anywhere;
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
          const errorMessage: Message = {
            role: 'assistant',
            content: `⏱️ ${data.message || 'You\'re sending messages too quickly. Please wait before sending another message.'}`,
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, errorMessage])
          setIsLoading(false)
          return
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
      {/* Show chat button only if not embedded and not hidden */}
      {!embedded && !hideFloatingButton && user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6" />
        </motion.div>
      )}

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={embedded ? { opacity: 1, y: 0, height: 'auto' } : { opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={embedded ? { opacity: 1 } : { opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className={embedded 
              ? "w-full h-full flex flex-col bg-[#120A26] border border-purple-600/30 rounded-lg"
              : "mb-2 w-[350px] sm:w-[400px] md:w-[450px] bg-[#120A26] border border-purple-600/30 rounded-lg shadow-xl flex flex-col max-h-[600px]"
            }
          >
            {!user ? (
              <LoginPrompt feature="AI assistant" embedded={embedded} />
            ) : (
              <>
                {/* Chat Header */}
                {(!embedded || (embedded && !isOpen)) && (
                  <div className="flex justify-between items-center p-3 border-b border-purple-600/30 bg-gradient-to-r from-purple-800/30 to-blue-800/30">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-purple-400" />
                      <span className="font-medium text-white">Whiskers</span>
                    </div>
                    {!embedded && (
                      <button 
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
                
                {/* Chat Messages */}
                <div 
                  ref={chatContainerRef}
                  className={`algoatlas-chat flex-1 overflow-y-auto p-3 flex flex-col gap-3 ${
                    embedded ? "min-h-0" : "min-h-[300px] max-h-[500px]"
                  } scrollbar-thin scrollbar-thumb-purple-600/30 scrollbar-track-transparent`}
                >
                  {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                      <div className="max-w-sm text-gray-400">
                        <Bot className="h-10 w-10 mx-auto mb-2 text-purple-500/70" />
                        <p>Hi! I'm Whiskers, the AlgoAtlas Assistant. Ask me about algorithms, data structures, or programming help.</p>
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
                            "px-4 py-2 rounded-2xl max-w-[85%]",
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-none"
                              : "bg-[#1A1035] text-white rounded-tl-none"
                          )}
                        >
                          {message.role === "assistant" ? (
                            <div className="prose prose-invert prose-sm max-w-none break-words overflow-hidden">
                              <ReactMarkdown components={{
                                p: ({ children }) => <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{children}</p>,
                                code: ({ className, children }) => (
                                  <code className={`${className || ''} break-words overflow-wrap-anywhere`}>
                                    {children}
                                  </code>
                                ),
                                pre: ({ children }) => (
                                  <pre className="overflow-x-auto p-2 bg-gray-800 rounded-md whitespace-pre-wrap">
                                    {children}
                                  </pre>
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
                      <div className="bg-[#1A1035] text-white px-4 py-3 rounded-2xl rounded-tl-none flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin text-purple-400" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Chat Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-purple-600/30">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 bg-[#1A1035] rounded-lg overflow-hidden transition-all focus-within:ring-1 focus-within:ring-purple-500">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onInput={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about algorithms, code help..."
                        className="w-full bg-transparent resize-none px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto word-break break-word whitespace-pre-wrap"
                        rows={1}
                        style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className={cn(
                          "bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 h-10 w-10 rounded-full flex-shrink-0",
                          (!inputMessage.trim() || isLoading) && "opacity-70"
                        )}
                        size="icon"
                      >
                        <SendHorizonal className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                    <span>Shift+Enter for new line</span>
                    <span className={isFallbackActive ? "text-amber-500" : ""}>
                      Powered by Groq ({currentModel})
                      {isFallbackActive && " (Fallback mode)"}
                    </span>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}