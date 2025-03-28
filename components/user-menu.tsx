"use client"

import { useState, useRef, useEffect } from "react"
import { User, Settings, LogOut, ChevronDown, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the current session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      subscription.unsubscribe()
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // If the user is not logged in, show login button
  if (!loading && !user) {
    return (
      <Link href="/login">
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
        >
          <LogIn className="h-4 w-4 mr-1" />
          Login
        </Button>
      </Link>
    )
  }

  // For logged in users, show the user menu
  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-2 bg-navy-800/30 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <Avatar className="h-8 w-8 border-2 border-purple-500/50">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
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
            <p className="text-sm font-medium text-white">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-purple-300">{user?.email || ''}</p>
          </div>
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors text-blue-300 hover:text-blue-200"
            onClick={() => setIsOpen(false)}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/profile/cp-connect"
            className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors text-blue-300 hover:text-blue-200"
            onClick={() => setIsOpen(false)}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 22L12 20L8 22V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6.5L13 9.5L16 10L14 12.5L14.5 15.5L12 14L9.5 15.5L10 12.5L8 10L11 9.5L12 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            CP Profiles
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors text-blue-300 hover:text-blue-200"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setIsOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-purple-500/20 transition-colors border-t border-purple-500/20 text-blue-300 hover:text-blue-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      </motion.div>
    </div>
  )
}

