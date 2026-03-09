"use client"

import { useState, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  containerClassName?: string
}

export function FloatingLabelInput({
  label,
  containerClassName,
  className,
  value,
  onChange,
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value !== undefined && value !== ""

  return (
    <div className={cn("relative group", containerClassName)}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full px-4 py-3 bg-navy-800/50 border border-purple-500/30 focus:border-purple-500/70 focus:ring-purple-500/20 rounded-md text-white transition-all",
            className,
          )}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            isFocused || hasValue ? "transform -translate-y-6 scale-75 text-purple-400 top-1" : "top-3 text-gray-400",
          )}
        >
          {label}
        </label>
      </div>
    </div>
  )
}

