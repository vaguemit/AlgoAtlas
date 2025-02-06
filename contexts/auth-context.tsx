"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  handle: string | null
  login: (handle: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  handle: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [handle, setHandle] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedHandle = localStorage.getItem("codeforcesHandle")
      if (storedHandle) {
        setHandle(storedHandle)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  const login = (newHandle: string) => {
    try {
      localStorage.setItem("codeforcesHandle", newHandle)
      setHandle(newHandle)
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem("codeforcesHandle")
      setHandle(null)
      router.push("/")
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!handle,
        handle,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

