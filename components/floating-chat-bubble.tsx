"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X } from "lucide-react"

interface Message {
  text: string
  sender: "user" | "ai"
}

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sample conversation about competitive programming
  const conversation: Message[] = [
    { text: "Have you seen the new graph algorithm challenges?", sender: "user" },
    { text: "Yes! The new Dijkstra's algorithm problem set is quite challenging.", sender: "ai" },
    { text: "I'm stuck on the minimum spanning tree problem. Any tips?", sender: "user" },
    { text: "Try using Kruskal's algorithm with a union-find data structure for better efficiency.", sender: "ai" },
    { text: "Thanks! I'll check out the tutorial section for more details.", sender: "user" },
  ]

  // Only run animations after component has mounted on the client
  useEffect(() => {
    // Skip during SSR
    if (typeof window === "undefined") return

    // Use requestAnimationFrame to ensure the browser is ready
    const frameId = requestAnimationFrame(() => {
      setIsMounted(true)
    })

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  // Animate messages appearing one by one when bubble is opened
  useEffect(() => {
    // Skip if not mounted or not open
    if (!isMounted || !isOpen) return

    // Reset messages
    setVisibleMessages([])

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev.length < conversation.length) {
          return [...prev, conversation[prev.length]]
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        return prev
      })
    }, 800)

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isOpen, isMounted, conversation.length])

  // Don't render anything during SSR
  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40">
      {/* Chat bubble toggle button */}
      <motion.button
        className="relative group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-md transition-opacity duration-300 ${
            isHovered ? "opacity-70" : "opacity-40"
          }`}
        ></div>
        <div className="relative flex items-center justify-center w-14 h-14 bg-navy-800 rounded-full border border-purple-500/30 shadow-lg">
          {isOpen ? <X className="h-6 w-6 text-purple-400" /> : <MessageSquare className="h-6 w-6 text-purple-400" />}
        </div>
      </motion.button>

      {/* Chat bubble content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 rounded-2xl overflow-hidden"
          >
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-md"></div>

              {/* Main content container */}
              <div className="relative bg-navy-800/90 backdrop-blur-sm border border-purple-500/30 rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 px-4 py-3 flex items-center justify-between border-b border-purple-500/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <h3 className="text-sm font-medium text-white">AlgoAtlas Assistant</h3>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Messages */}
                <div className="p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                  <div className="space-y-3">
                    {visibleMessages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                            message.sender === "user"
                              ? "bg-purple-600/40 text-white rounded-tr-none"
                              : "bg-blue-600/30 text-white rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator when not all messages are shown */}
                    {isOpen && visibleMessages.length < conversation.length && (
                      <div className="flex justify-start">
                        <div className="bg-blue-600/30 px-4 py-2 rounded-2xl rounded-tl-none">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input area */}
                <div className="border-t border-purple-500/30 p-3 bg-navy-900/50">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Ask about algorithms..."
                      className="flex-1 bg-navy-800/50 border border-purple-500/30 rounded-full px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    />
                    <button className="ml-2 p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

