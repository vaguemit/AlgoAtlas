"use client"

import { useState, useEffect } from "react"

export function useDeviceType() {
  // Default to mobile during SSR to ensure mobile-first approach
  const [isMobile, setIsMobile] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true)

    // Skip the rest of the effect during SSR
    if (typeof window === "undefined") return undefined

    // Use requestAnimationFrame to ensure the browser is ready
    const frameId = requestAnimationFrame(() => {
      // Function to check if the device is mobile
      const checkIfMobile = () => {
        const mobileBreakpoint = 768 // Standard mobile breakpoint
        setIsMobile(window.innerWidth < mobileBreakpoint)
      }

      // Check on initial load
      checkIfMobile()

      // Debounced resize handler
      let resizeTimer
      const handleResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          checkIfMobile()
        }, 100)
      }

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Return cleanup function
      return () => {
        window.removeEventListener("resize", handleResize)
        clearTimeout(resizeTimer)
      }
    })

    // Clean up the initial requestAnimationFrame
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return {
    isMobile,
    isDesktop: isMounted ? !isMobile : false,
  }
}

