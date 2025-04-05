"use client"

import { usePathname } from "next/navigation"
import { AlgoAtlasAssistant } from "@/components/algoatlas-assistant"
import { useState, useEffect } from "react"

export function AssistantWrapper() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  // Use useEffect to prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Don't render the assistant if we're on the assistant page
  if (!mounted) return null
  
  // Don't show the floating button on assistant-related pages
  const isAssistantPath = pathname.startsWith("/assistant") || pathname === "/assistant"
  
  if (isAssistantPath) return null
  
  return <AlgoAtlasAssistant hideFloatingButton={false} />
} 