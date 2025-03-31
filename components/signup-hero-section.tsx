"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export function SignupHeroSection() {
  const router = useRouter()
  const { user } = useAuth()

  // Don't render the component if user is logged in
  if (user) {
    return null
  }

  const handleAssistantClick = () => {
    router.push("/assistant")
  }

  const handleRegisterClick = () => {
    router.push("/register")
  }

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background gradient effects - updated to darker purple */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#3A1E70] rounded-full blur-[180px] opacity-8 animate-pulse"></div>
      <div
        className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-[#2A1845] rounded-full blur-[150px] opacity-6 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9A70E8] via-[#8265DC] to-[#9A70E8] animate-gradient">
                Elevate Your Competitive Programming Journey
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-8">
                Join thousands of developers mastering algorithms, solving challenges, and climbing the ranks in the
                competitive programming world.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-6 text-lg font-semibold text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300"
                  onClick={handleRegisterClick}
                >
                  Register Now
                </Button>
                <Button
                  variant="outline"
                  className="border-[#3A1E70]/30 hover:border-[#3A1E70]/70 text-white hover:bg-[#3A1E70]/10"
                  onClick={handleAssistantClick}
                >
                  Try AlgoAtlas Assistant
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09061A] to-transparent"></div>
    </section>
  )
}

