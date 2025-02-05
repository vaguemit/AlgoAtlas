import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays" },
  { id: 2, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 3, title: "Merge K Sorted Lists", difficulty: "Hard", category: "Linked Lists" },
  // Add more problems here
]

export default function Problems() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Problem Repository</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <TableRow key={problem.id}>
              <TableCell>{problem.id}</TableCell>
              <TableCell>
                <Link href={`/problems/${problem.id}`} className="text-blue-500 hover:underline">
                  {problem.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    problem.difficulty === "Easy"
                      ? "success"
                      : problem.difficulty === "Medium"
                        ? "warning"
                        : "destructive"
                  }
                >
                  {problem.difficulty}
                </Badge>
              </TableCell>
              <TableCell>{problem.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

