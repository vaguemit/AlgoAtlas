"use client"

import React, { type ErrorInfo, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Oops, there was an error!</h1>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again?
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorToast() {
  const { toast } = useToast()

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      toast({
        title: "An error occurred",
        description: event.message,
        variant: "destructive",
      })
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [toast])

  return null
}

