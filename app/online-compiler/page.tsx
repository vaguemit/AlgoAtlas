"use client"

import { OnlineCompiler } from "@/components/online-compiler"
import { useEffect } from "react"

export default function OnlineCompilerPage() {
  // Use a more aggressive approach to ensure scrolling to top
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0)
    
    // Secondary scroll after a small delay to handle any dynamic content
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      })
    }, 100)
    
    // Third scroll with a longer delay as a fallback
    const timer2 = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      })
    }, 500)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [])
  
  return (
    <div className="pt-20 pb-10">
      <OnlineCompiler disableAutoFocus={true} />
    </div>
  )
}

