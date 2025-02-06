import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

interface Problem {
  contestId: number
  index: string
  name: string
  type: string
  points: number
  rating: number
  tags: string[]
}

async function getProblems(): Promise<Problem[]> {
  const res = await fetch('https://codeforces.com/api/problemset.problems', { next: { revalidate: 3600 } })
  if (!res.ok) {
    throw new Error('Failed to fetch problems')
  }
  const data = await res.json()
  return data.result.problems
    .filter((problem: Problem) => problem.rating !== undefined)
    .sort((a: Problem, b: Problem) => a.rating - b.rating)
    .slice(0, 100)
}

// Function to determine the badge color based on difficulty
const getBadgeVariant = (difficulty: number) => {
  if (difficulty <= 1000) return "success"
  if (difficulty <= 1500) return "warning"
  if (difficulty <= 2000) return "destructive"
  return "default"
}

export default async function ProblemsTable() {
  const problems = await getProblems()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Tags</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {problems.map((problem) => (
          <TableRow key={`${problem.contestId}${problem.index}`}>
            <TableCell>{problem.contestId}{problem.index}</TableCell>
            <TableCell>
              <Link 
                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`} 
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {problem.name}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(problem.rating)}>
                {problem.rating}
              </Badge>
            </TableCell>
            <TableCell>{problem.tags.join(', ')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

