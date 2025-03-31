"use client"

import { usePathname } from "next/navigation"
import { AlgoAtlasAssistant } from "@/components/algoatlas-assistant"

export function AssistantWrapper() {
  const pathname = usePathname()
  const hideAssistant = pathname === "/assistant"

  return <AlgoAtlasAssistant hideFloatingButton={hideAssistant} />
} 