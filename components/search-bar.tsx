"use client"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mock suggestions - in a real app, this would come from an API
  const mockSuggestions = [
    "Binary Search",
    "Dynamic Programming",
    "Graph Algorithms",
    "Sorting Algorithms",
    "Tree Traversal",
    "Greedy Algorithms",
    "Backtracking",
  ]

  useEffect(() => {
    if (query.length > 0) {
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search problems, tutorials…"
            className="pl-10 pr-4 h-10 w-full bg-navy-800/50 border-purple-500/30 focus:border-purple-500/70 focus:ring-purple-500/20 focus:bg-navy-800/80 transition-all text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <div
        ref={dropdownRef}
        className={cn(
          "absolute top-full left-0 right-0 mt-1 bg-navy-800/90 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10 z-10 overflow-hidden transition-all duration-200 ease-in-out",
          isFocused && suggestions.length > 0 ? "opacity-100 max-h-60" : "opacity-0 max-h-0 pointer-events-none",
        )}
      >
        <ul className="py-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-purple-500/20 cursor-pointer transition-colors"
              onClick={() => {
                setQuery(suggestion)
                setIsFocused(false)
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

