import React from "react"

interface PageHeaderProps {
  heading: string
  subheading?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, subheading, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
        {heading}
      </h1>
      {subheading && (
        <p className="text-lg text-blue-100/80 mb-4">
          {subheading}
        </p>
      )}
      {children}
    </div>
  )
} 