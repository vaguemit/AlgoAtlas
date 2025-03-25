"use client"

import { useState, useRef, useEffect } from "react"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-2 bg-navy-800/30 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <Avatar className="h-8 w-8 border-2 border-purple-500/50">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">AA</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-md opacity-30"></div>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200 text-purple-400", isOpen && "rotate-180")}
        />
      </Button>

      {/* Dropdown Menu */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "absolute right-0 mt-2 w-56 rounded-md bg-navy-800/90 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/20 z-10 overflow-hidden",
          !isOpen && "pointer-events-none",
        )}
      >
        <div className="py-1">
          <div className="px-4 py-3 border-b border-purple-500/20">
            <p className="text-sm font-medium text-white">User Name</p>
            <p className="text-xs text-purple-300">user@example.com</p>
          </div>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors text-blue-300 hover:text-blue-200"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors text-blue-300 hover:text-blue-200"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors border-t border-purple-500/20 text-blue-300 hover:text-blue-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </a>
        </div>
      </motion.div>
    </div>
  )
}

