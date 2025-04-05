import LearningPathDetails from "@/components/learning-path-details"

interface PageParams {
  id: string
}

export default function LearningPathPage({
  params,
}: {
  params: PageParams
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <LearningPathDetails pathId={params.id} />
    </div>
  )
} 