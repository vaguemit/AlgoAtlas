import * as React from "react"
import { X } from "lucide-react"

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}: MultiSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
        {value.length > 0 ? (
          value.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-secondary rounded-md"
            >
              {item}
              <button
                onClick={() => onChange(value.filter((v) => v !== item))}
                className="hover:text-destructive"
              >
                <X size={14} />
              </button>
            </span>
          ))
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>
      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
        {options
          .filter((option) => !value.includes(option.value))
          .map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 cursor-pointer hover:bg-secondary"
              onClick={() => onChange([...value, option.value])}
            >
              {option.label}
            </div>
          ))}
      </div>
    </div>
  )
} 