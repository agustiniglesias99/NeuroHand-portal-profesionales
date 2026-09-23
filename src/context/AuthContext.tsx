import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authenticate } from '../lib/auth'
import { UserRole, type UserRole as UserRoleValue } from '../types'

export interface CurrentUser {
  id: string
  email: string
  role: UserRoleValue
  accountId: string | null
  doctorId?: string
  displayName: string
}

interface AuthContextType {
  user: CurrentUser | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<CurrentUser>
  logout: () => void
  updateUser: (partial: Partial<CurrentUser>) => void
}

interface Session {
  user: CurrentUser
  accessToken: string
  expiresAt: number
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!session) return
    const remaining = session.expiresAt - Date.now()
    const timeout = window.setTimeout(
      () => setSession(null),
      Math.max(remaining, 0),
    )
    return () => window.clearTimeout(timeout)
  }, [session])

  async function login(email: string, password: string): Promise<CurrentUser> {
    const authenticated = await authenticate(email, password)
    if (
      authenticated.user.role !== UserRole.ACCOUNT_ADMIN &&
      authenticated.user.role !== UserRole.THERAPIST
    ) {
      throw new Error('Tu rol todavía no está habilitado para acceder al Portal Médico.')
    }

    const user: CurrentUser = {
      id: authenticated.user.id,
      email: authenticated.user.email,
      role: authenticated.user.role,
      accountId: authenticated.user.accountId,
      displayName: authenticated.user.profile?.firstName && authenticated.user.profile?.lastName
        ? `${authenticated.user.profile.firstName} ${authenticated.user.profile.lastName}`
        : authenticated.user.email,
    }
    setSession({
      user,
      accessToken: authenticated.accessToken,
      expiresAt: Date.now() + authenticated.expiresIn * 1000,
    })
    return user
  }

  function logout() {
    setSession(null)
  }

  function updateUser(partial: Partial<CurrentUser>) {
    setSession((previous) =>
      previous
        ? { ...previous, user: { ...previous.user, ...partial } }
        : previous,
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        isAuthenticated: session !== null,
        login,
        logout,
        updateUser,
      }}
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
