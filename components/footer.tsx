"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Code, ArrowRight, Github, Twitter, Linkedin, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
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

  return (
    <footer className="relative mt-20 border-t border-purple-500/20 bg-navy-900">
      {/* Top gradient effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      {/* Final CTA Section */}
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
              <Button className="relative rounded-md bg-gradient-to-r from-green-600 to-green-500 px-6 py-6 text-lg font-semibold text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 min-h-touch-target">
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
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

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
                { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
                { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-full bg-navy-800/50 border border-purple-500/20 text-purple-400 hover:text-purple-300 hover:border-purple-500/40 transition-colors touch-target"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Credits Section */}
          <div>
            <h3 className="text-fluid-lg font-semibold text-white mb-4">Credits</h3>
            <ul className="space-y-2">
              {[
                { label: "Design by AlgoAtlas Team", href: "#" },
                { label: "Icons by Lucide React", href: "https://lucide.dev" },
                { label: "Built with Next.js", href: "https://nextjs.org" },
                { label: "Powered by Vercel", href: "https://vercel.com" },
                { label: "UI Components by shadcn/ui", href: "https://ui.shadcn.com" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-blue-300 hover:text-blue-200 transition-colors relative group touch-target py-1 block"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 text-fluid-sm text-white/50">
          <div>&copy; {new Date().getFullYear()} AlgoAtlas. All rights reserved.</div>

          <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-4 md:mt-0">
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
      </div>
    </footer>
  )
}

