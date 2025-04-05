"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Code } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./search-bar"
import { UserMenu } from "./user-menu"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { user, loading } = useAuth()

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/learn/learning-paths", label: "Learning Paths" },
    { href: "/gym", label: "Gym" },
    { href: "/contests", label: "Contests" },
    { href: "/online-compiler", label: "Online Compiler" },
    { href: "/assistant", label: "Assistant" },
  ]

  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Initial check
    handleScroll()

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Only render animations after component has mounted on client
  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900 h-16">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">{/* Static placeholder for SSR */}</div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#0F0822]"
          : pathname === "/"
            ? "bg-transparent"
            : "bg-[#0F0822]/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/compass-logo.png"
              alt="AlgoAtlas Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-lg sm:text-xl font-bold text-white/90">
              AlgoAtlas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium relative group py-2",
                  pathname === link.href ? "text-purple-400" : "text-white hover:text-purple-400",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                  )}
                ></span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>

            {/* User Menu - Hidden on mobile */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-purple-300 hover:bg-purple-900/20 p-2 rounded-md border border-purple-500/30"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#0F0822] border-t border-purple-500/20"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <div className="mb-6">
                <SearchBar />
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors",
                      pathname === link.href
                        ? "bg-purple-500/20 text-purple-400"
                        : "text-white hover:bg-purple-500/10 hover:text-purple-400",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile User Menu */}
              <div className="mt-6 pt-6 border-t border-purple-500/20">
                <div className="flex justify-center">
                  <UserMenu />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
