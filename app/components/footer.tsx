"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black/20 border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm">
            © 2024 AlgoAtlas. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/about" className="text-white/60 hover:text-white text-sm">
              About
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-white text-sm">
              Contact
            </Link>
            <Link href="/privacy" className="text-white/60 hover:text-white text-sm">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 