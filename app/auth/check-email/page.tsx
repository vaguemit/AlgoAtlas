"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

// Content component that uses useSearchParams
function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [countdown, setCountdown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleResendEmail = async () => {
    if (!email || countdown > 0) return

    try {
      setIsResending(true)
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast({
        title: "Email sent",
        description: "We've sent another login link to your email",
      })
      
      // Reset countdown
      setCountdown(60)
    } catch (error) {
      console.error('Error resending email:', error)
      toast({
        title: "Failed to resend email",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6 rounded-xl bg-[#09061A]/90 backdrop-blur-sm border border-[#3A1E70]/30 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9A70E8] via-[#8265DC] to-[#9A70E8] animate-gradient">
            Check Your Email
          </h1>
          
          <div className="mb-8 bg-[#3A1E70]/10 p-4 rounded-lg border border-[#3A1E70]/20">
            <p className="text-white/80 mb-4">
              We've sent a sign-in link to:
            </p>
            <p className="font-medium text-lg text-white">
              {email}
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-white/70">
              Please check your email and click on the link to continue.
            </p>
            
            <p className="text-white/70 text-sm">
              {countdown > 0 ? (
                <>
                  Didn't receive an email? You can request another one in {countdown} seconds
                </>
              ) : (
                <>
                  Didn't receive an email? 
                  <Button 
                    variant="link" 
                    className="text-[#9A70E8] underline pl-1"
                    onClick={handleResendEmail}
                    disabled={isResending}
                  >
                    {isResending ? 'Sending...' : 'Resend email'}
                  </Button>
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="pt-4">
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="border-[#3A1E70]/30 hover:border-[#3A1E70]/70 text-white hover:bg-[#3A1E70]/10"
              onClick={() => window.location.href = "/"}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback for the Suspense boundary
function CheckEmailLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6 rounded-xl bg-[#09061A]/90 backdrop-blur-sm border border-[#3A1E70]/30 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9A70E8] via-[#8265DC] to-[#9A70E8] animate-gradient">
            Loading...
          </h1>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function CheckEmailPage() {
  return (
    <Suspense fallback={<CheckEmailLoading />}>
      <CheckEmailContent />
    </Suspense>
  )
}