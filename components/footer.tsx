"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Code, ArrowRight, Github, Twitter, Linkedin, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export function Footer() {
  const { user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle the newsletter signup here
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
    }, 3000)
  }

  const handleRegisterClick = () => {
    router.push("/register")
  }

  return (
    <footer className="relative mt-20 border-t border-purple-500/20 bg-navy-900">
      {/* Top gradient effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      {/* Final CTA Section - Only shown to non-logged in users */}
      {!user && (
        <div className="container mx-auto px-fluid-2 py-8 sm:py-12">
          <div className="relative mb-8 sm:mb-16 p-4 sm:p-8 rounded-xl overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-50"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-fluid-xl sm:text-fluid-2xl md:text-fluid-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  Ready to elevate your competitive programming journey?
                </h2>
                <p className="mt-2 text-fluid-base text-white/70 max-w-xl">
                  Join thousands of developers mastering algorithms and climbing the ranks.
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-md blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
                <Button 
                  onClick={handleRegisterClick}
                  className="relative rounded-md bg-gradient-to-r from-green-600 to-green-500 px-6 py-6 text-lg font-semibold text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 min-h-touch-target"
                >
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-fluid-2 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-center py-8 text-center">
          {/* Logo and Tagline */}
          <div className="space-y-4 max-w-2xl">
            <Link href="/" className="flex items-center space-x-2 group justify-center">
              <div className="relative">
                <Code className="h-6 w-6 text-purple-500" />
                <div className="absolute inset-0 bg-purple-500 blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                AlgoAtlas
              </span>
            </Link>
            <p className="text-white/70 text-fluid-sm">
              Your comprehensive platform for mastering algorithms and data structures. Practice, learn, and compete to
              become a better programmer.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-center py-6 text-fluid-sm text-white/50 text-center">
          <div>&copy; {new Date().getFullYear()} AlgoAtlas. All rights reserved.</div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-white/70 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
        
        {/* Name credit at bottom center */}
        <div className="text-center pb-6">
          <Link
            href="https://www.linkedin.com/in/mit-parikh-6aaba0333/"
            className="text-blue-300 hover:text-blue-200 transition-colors relative inline-block group"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by Mit Parikh
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

