"use client"

import { Home, BookOpen, Dumbbell, Trophy, Terminal, Bot } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/learn", label: "Learn", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/gym", label: "Gym", icon: <Dumbbell className="h-5 w-5" /> },
    { href: "/contests", label: "Contests", icon: <Trophy className="h-5 w-5" /> },
    { href: "/online-compiler", label: "Compiler", icon: <Terminal className="h-5 w-5" /> },
    { href: "/assistant", label: "Assistant", icon: <Bot className="h-5 w-5" /> },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-navy-900 border-t border-purple-500/20">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
                isActive ? "text-purple-400" : "text-gray-400 hover:text-purple-300",
              )}
            >
              <div className={cn("p-1 rounded-full mb-1", isActive && "bg-purple-500/10")}>{link.icon}</div>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

