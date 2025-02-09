import { Suspense } from "react"
import { LevelSheet } from "@/components/LevelSheet"
import { ContestSelection } from "@/components/ContestSelection"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function TrainContest() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Train Contest</h1>
      <div className="space-y-8">
        <Suspense fallback={<LoadingSpinner />}>
          <LevelSheet />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ContestSelection />
        </Suspense>
      </div>
    </div>
  )
}

