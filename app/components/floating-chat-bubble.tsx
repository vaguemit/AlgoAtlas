"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-500 text-white rounded-full p-4 shadow-lg"
      >
        {isOpen ? "✕" : "💬"}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-80"
        >
          <div className="text-gray-800">
            <h3 className="font-bold mb-2">Need help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ask questions about algorithms, data structures, or get help with competitive programming problems.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg w-full hover:bg-purple-600 transition-colors"
            >
              Start Chat
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
} 