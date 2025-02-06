"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterOptionsProps {
  tags: string[]
  onFilterChange: (minDifficulty: number, maxDifficulty: number, selectedTags: string[]) => void
}

export function FilterOptions({ tags, onFilterChange }: FilterOptionsProps) {
  const [minDifficulty, setMinDifficulty] = useState(800)
  const [maxDifficulty, setMaxDifficulty] = useState(3500)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const applyFilters = () => {
    onFilterChange(minDifficulty, maxDifficulty, selectedTags)
  }

  const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div>
          <Label htmlFor="minDifficulty">Min Difficulty</Label>
          <Input
            id="minDifficulty"
            type="number"
            value={minDifficulty}
            onChange={(e) => setMinDifficulty(Number(e.target.value))}
            min={800}
            max={3500}
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
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tags</Label>
        <Input
          type="text"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {filteredTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox id={tag} checked={selectedTags.includes(tag)} onCheckedChange={() => handleTagChange(tag)} />
                <Label htmlFor={tag}>{tag}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <Button onClick={applyFilters}>Apply Filters</Button>
    </div>
  )
}

