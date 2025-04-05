export const metadata = {
  title: 'AlgoAtlas Assistant',
  description: 'Get help with algorithms, data structures, and coding problems',
}

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-navy-950 min-h-screen">
      {children}
    </div>
  )
} 