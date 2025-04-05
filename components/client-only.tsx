"use client"

import { useState, useEffect } from "react"

// Client-only wrapper to avoid hydration issues
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  return <>{children}</>
} 