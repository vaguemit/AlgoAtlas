"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            AlgoAtlas
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/learning-paths">Learning Paths</Link>
            <Link href="/problems">Problems</Link>
            <Link href="/train-contest">Train Contest</Link>
            <Link href="/dashboard">Dashboard</Link>
            <ModeToggle />
            {/* Remove the sign-in/sign-out buttons */}
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-3">
            <Link href="/learning-paths" className="block py-2">
              Learning Paths
            </Link>
            <Link href="/problems" className="block py-2">
              Problems
            </Link>
            <Link href="/train-contest" className="block py-2">
              Train Contest
            </Link>
            <Link href="/dashboard" className="block py-2">
              Dashboard
            </Link>
            <div className="flex items-center justify-between py-2">
              <ModeToggle />
              {/* Remove the sign-in/sign-out buttons */}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

