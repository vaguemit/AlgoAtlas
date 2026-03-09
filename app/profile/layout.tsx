"use client"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-12 pb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Your Profile</h1>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-10"></div>
      
      <div className="min-h-[60vh]">
        {children}
      </div>
    </div>
  )
} 