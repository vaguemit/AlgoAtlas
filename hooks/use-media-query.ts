"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  // Default to false during SSR
  const [matches, setMatches] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true)

    // Skip the rest of the effect during SSR
    if (typeof window === "undefined") return undefined

    // Use requestAnimationFrame to ensure the browser is ready
    const frameId = requestAnimationFrame(() => {
      // Create media query
      let media: MediaQueryList | null = null

      try {
        media = window.matchMedia(query)
        // Set initial value
        setMatches(media.matches)
      } catch (e) {
        console.error("Error creating media query:", e)
        return
      }

      // Create event listener function
      const updateMatches = (e: MediaQueryListEvent) => {
        setMatches(e.matches)
      }

      // Add event listener with modern API if available
      if (media.addEventListener) {
        media.addEventListener("change", updateMatches)
      } else if (media.addListener) {
        // Fallback for older browsers
        media.addListener(updateMatches)
      }

      // Return cleanup function
      return () => {
        if (!media) return

        if (media.removeEventListener) {
          media.removeEventListener("change", updateMatches)
        } else if (media.removeListener) {
          media.removeListener(updateMatches)
        }
      }
    })

    // Clean up the initial requestAnimationFrame
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [query])

  // During SSR or before hydration, provide a default value
  if (!isMounted) {
    // Default values based on common breakpoints
    if (query.includes("min-width: 1024px")) return false // Desktop
    if (query.includes("min-width: 768px")) return false // Tablet
    return true // Mobile first approach
  }

  return matches
}

