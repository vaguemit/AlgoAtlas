import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Codeforces problems with actual links
const problems = [
  { id: "4A", title: "Watermelon", difficulty: 800, category: "Implementation" },
  { id: "71A", title: "Way Too Long Words", difficulty: 800, category: "Strings" },
  { id: "158A", title: "Next Round", difficulty: 800, category: "Implementation" },
  { id: "50A", title: "Domino piling", difficulty: 800, category: "Math" },
  { id: "231A", title: "Team", difficulty: 800, category: "Brute Force" },
  { id: "282A", title: "Bit++", difficulty: 800, category: "Implementation" },
  { id: "112A", title: "Petya and Strings", difficulty: 800, category: "Implementation" },
  { id: "339A", title: "Helpful Maths", difficulty: 800, category: "Greedy" },
  { id: "281A", title: "Word Capitalization", difficulty: 800, category: "Strings" },
  { id: "236A", title: "Boy or Girl", difficulty: 800, category: "Strings" },
  { id: "791A", title: "Bear and Big Brother", difficulty: 800, category: "Implementation" },
  { id: "546A", title: "Soldier and Bananas", difficulty: 800, category: "Math" },
  { id: "617A", title: "Elephant", difficulty: 800, category: "Math" },
  { id: "977A", title: "Wrong Subtraction", difficulty: 800, category: "Implementation" },
  { id: "116A", title: "Tram", difficulty: 800, category: "Implementation" },
]

// Sort problems by difficulty (ascending order)
const sortedProblems = [...problems].sort((a, b) => a.difficulty - b.difficulty)

// Function to determine the badge color based on difficulty
const getBadgeVariant = (difficulty: number) => {
  if (difficulty <= 1000) return "success"
  if (difficulty <= 1500) return "warning"
  return "destructive"
}

export default function Problems() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Codeforces Problem Repository</h1>
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
          {sortedProblems.map((problem) => (
            <TableRow key={problem.id}>
              <TableCell>{problem.id}</TableCell>
              <TableCell>
                <Link
                  href={`https://codeforces.com/problemset/problem/${problem.id.slice(0, -1)}/${problem.id.slice(-1)}`}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(problem.difficulty)}>{problem.difficulty}</Badge>
              </TableCell>
              <TableCell>{problem.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

