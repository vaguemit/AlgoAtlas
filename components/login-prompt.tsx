"use client"

import { motion } from 'framer-motion'
import { Lock, LogIn, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface LoginPromptProps {
  feature: string
  embedded?: boolean
}

export function LoginPrompt({ feature, embedded = false }: LoginPromptProps) {
  return (
    <motion.div 
      className={`${embedded ? 'h-full' : 'py-12'} flex flex-col items-center justify-center`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-black/60 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-purple-400" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Login Required
          </h3>
          
          <p className="text-gray-300 mb-6">
            You need to be logged in to access the {feature}.
            Please sign in with your account to continue.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="w-full border-purple-500/30 hover:bg-purple-500/20"
            >
              <Link href="/register">
                <User className="mr-2 h-4 w-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
