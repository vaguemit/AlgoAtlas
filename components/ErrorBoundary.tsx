"use client"

import React, { type ErrorInfo, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl w-full">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Oops, there was an error!</h1>
            <p className="mb-4 text-gray-700">We're sorry, but something went wrong. Please try again later.</p>
            {this.state.error && (
              <div className="mb-4 p-4 bg-red-100 rounded">
                <p className="font-semibold">Error: {this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-sm overflow-auto">{this.state.errorInfo.componentStack}</pre>
                )}
              </div>
            )}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Page
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
      console.error("Caught error:", event.error)
      toast({
        title: "An error occurred",
        description: event.error?.message || "We're sorry, but something went wrong. Please try again later.",
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

