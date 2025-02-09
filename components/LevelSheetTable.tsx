"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface LevelInfo {
  level: number
  duration: number
  performance: number
  p1Rating: number
  p2Rating: number
  p3Rating: number
  p4Rating: number
}

const levelData: LevelInfo[] = [
  { level: 1, duration: 120, performance: 900, p1Rating: 800, p2Rating: 800, p3Rating: 800, p4Rating: 800 },
  { level: 2, duration: 120, performance: 950, p1Rating: 800, p2Rating: 800, p3Rating: 800, p4Rating: 900 },
  { level: 3, duration: 120, performance: 1000, p1Rating: 800, p2Rating: 800, p3Rating: 900, p4Rating: 900 },
  // ... (all 109 levels)
  { level: 109, duration: 180, performance: 4000, p1Rating: 3500, p2Rating: 3500, p3Rating: 3500, p4Rating: 3500 },
]

export function LevelSheetTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLevels = levelData.filter(
    (level) => level.level.toString().includes(searchTerm) || level.performance.toString().includes(searchTerm),
  )

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by level or performance..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm mx-auto font-mono"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono">
          <thead>
            <tr className="border border-border">
              <th className="p-4 text-left border border-border">Level</th>
              <th className="p-4 text-left border border-border">Duration</th>
              <th className="p-4 text-left border border-border">Performance</th>
              <th className="p-4 text-left border border-border">P1 rating</th>
              <th className="p-4 text-left border border-border">P2 rating</th>
              <th className="p-4 text-left border border-border">P3 rating</th>
              <th className="p-4 text-left border border-border">P4 rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredLevels.map((level) => (
              <tr key={level.level} className="border-b border-border hover:bg-muted/50">
                <td className="p-4 border border-border">{level.level}</td>
                <td className="p-4 border border-border">{level.duration} min</td>
                <td className="p-4 border border-border">{level.performance}</td>
                <td className="p-4 border border-border">{level.p1Rating}</td>
                <td className="p-4 border border-border">{level.p2Rating}</td>
                <td className="p-4 border border-border">{level.p3Rating}</td>
                <td className="p-4 border border-border">{level.p4Rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

