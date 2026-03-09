import { ContestsSection } from "@/components/contests-section"

export default function ContestsPage() {
  return (
    <div className="pt-16 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Competitive Programming Contests
          </h1>
          <p className="text-base sm:text-lg text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            Stay updated with upcoming contests from Codeforces, CodeChef, AtCoder, and more. Register, compete, and
            improve your competitive programming skills.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ContestsSection />
      </div>
    </div>
  )
}

