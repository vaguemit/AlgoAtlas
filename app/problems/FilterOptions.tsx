"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface FilterOptionsProps {
  tags: string[]
  onFilterChange: (minDifficulty: number, maxDifficulty: number, selectedTags: string[]) => void
}

export function FilterOptions({ tags, onFilterChange }: FilterOptionsProps) {
  const [minDifficulty, setMinDifficulty] = useState(800)
  const [maxDifficulty, setMaxDifficulty] = useState(3500)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const applyFilters = () => {
    onFilterChange(minDifficulty, maxDifficulty, selectedTags)
  }

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minDifficulty">Min Difficulty</Label>
          <Input
            id="minDifficulty"
            type="number"
            value={minDifficulty}
            onChange={(e) => setMinDifficulty(Number(e.target.value))}
            min={800}
            max={3500}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="maxDifficulty">Max Difficulty</Label>
          <Input
            id="maxDifficulty"
            type="number"
            value={maxDifficulty}
            onChange={(e) => setMaxDifficulty(Number(e.target.value))}
            min={800}
            max={3500}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <Input
          type="text"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1"
        />
        <ScrollArea className="h-[200px] mt-2 border rounded-md p-2">
          <div className="flex flex-wrap gap-2 p-2">
            {filteredTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setSelectedTags([])}>
          Clear Tags
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  )
}

