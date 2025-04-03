"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CatDemoPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to home page
    router.push("/")
  }, [router])
  
  return (
    <div className="container mx-auto py-16 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg text-white/80 mb-4">Redirecting to home page...</p>
      </div>
    </div>
  )
} 