"use client"

import { usePathname } from "next/navigation"
import { AlgoAtlasAssistant } from "@/components/algoatlas-assistant"
import { useAuth } from "@/contexts/AuthContext"

export function AssistantWrapper() {
  const pathname = usePathname()
  const { user } = useAuth()
  const hideAssistant = pathname === "/assistant"
  
  // If user is not logged in, don't show anything
  if (!user) {
    return null;
  }
  
  // Only show the assistant when user is logged in
  return <AlgoAtlasAssistant hideFloatingButton={hideAssistant} />
}