import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserRole } from '../types'

export interface CurrentUser {
  email: string
  role: UserRole
  doctorId?: string
  displayName: string
}

interface AuthContextType {
  user: CurrentUser | null
  isAuthenticated: boolean
  login: (user: CurrentUser) => void
  logout: () => void
  updateUser: (partial: Partial<CurrentUser>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)

  function login(nextUser: CurrentUser) {
    setUser(nextUser)
  }

  function logout() {
    setUser(null)
  }

  function updateUser(partial: Partial<CurrentUser>) {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev))
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
