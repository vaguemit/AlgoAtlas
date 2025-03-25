"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Set initial theme based on system preference or saved preference
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", isDarkMode ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden bg-navy-800/30 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-md"
      />
      <Sun
        className={`h-5 w-5 absolute transition-all duration-300 ease-spring text-yellow-300 ${
          isDarkMode ? "opacity-0 rotate-90 translate-y-full" : "opacity-100 rotate-0 translate-y-0"
        }`}
      />
      <Moon
        className={`h-5 w-5 absolute transition-all duration-300 ease-spring text-blue-300 ${
          isDarkMode ? "opacity-100 rotate-0 translate-y-0" : "opacity-0 -rotate-90 -translate-y-full"
        }`}
      />
    </Button>
  )
}

