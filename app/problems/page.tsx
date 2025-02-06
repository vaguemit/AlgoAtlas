import { Suspense } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import ProblemsTable from "./ProblemsTable"

export default function Problems() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Codeforces Problem Repository</h1>
      <Suspense fallback={<div>Loading problems...</div>}>
        <ProblemsTable />
      </Suspense>
    </div>
  )
}

