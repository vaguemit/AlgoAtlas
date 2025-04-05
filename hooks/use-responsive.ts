"use client"

import { useState, useEffect } from "react"

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
}

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Only run on client side
    if (typeof window === "undefined") return

    // Function to update window size
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize, { passive: true })

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Check if window width is greater than or equal to a breakpoint
  const isAbove = (breakpoint: Breakpoint): boolean => {
    if (!isMounted) return false
    return windowSize.width >= breakpoints[breakpoint]
  }

  // Check if window width is less than a breakpoint
  const isBelow = (breakpoint: Breakpoint): boolean => {
    if (!isMounted) return false
    return windowSize.width < breakpoints[breakpoint]
  }

  // Check if window width is between two breakpoints
  const isBetween = (minBreakpoint: Breakpoint, maxBreakpoint: Breakpoint): boolean => {
    if (!isMounted) return false
    return windowSize.width >= breakpoints[minBreakpoint] && windowSize.width < breakpoints[maxBreakpoint]
  }

  // Get current active breakpoint
  const current = (): Breakpoint => {
    if (!isMounted) return "md" // Default for SSR

    if (windowSize.width < breakpoints.xs) return "xs"
    if (windowSize.width < breakpoints.sm) return "sm"
    if (windowSize.width < breakpoints.md) return "md"
    if (windowSize.width < breakpoints.lg) return "lg"
    if (windowSize.width < breakpoints.xl) return "xl"
    return "2xl"
  }

  return {
    width: windowSize.width,
    height: windowSize.height,
    isAbove,
    isBelow,
    isBetween,
    current,
    isMobile: isBelow("md"),
    isTablet: isBetween("md", "lg"),
    isDesktop: isAbove("lg"),
  }
}

