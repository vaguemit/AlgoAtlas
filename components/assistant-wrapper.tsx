"use client"

import { usePathname } from "next/navigation"
import { AlgoAtlasAssistant } from "@/components/algoatlas-assistant"
import { useAuth } from "@/contexts/AuthContext"
import { LoginPrompt } from "./login-prompt"

export function AssistantWrapper() {
  const pathname = usePathname()
  const { user } = useAuth()
  const hideAssistant = pathname === "/assistant"
  
  // If user is not logged in, show the login prompt instead
  if (!user) {
    return <LoginPrompt feature="AI assistant" embedded={true} />
  }
  
  // Otherwise, show the assistant as normal
  return <AlgoAtlasAssistant hideFloatingButton={hideAssistant} />
}