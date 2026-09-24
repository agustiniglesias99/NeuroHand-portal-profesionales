import { UserRole, type UserRole as UserRoleValue } from '../types'
import { apiRequest } from './api'

interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface ApiCurrentUser {
  id: string
  email: string
  role: UserRoleValue
  status: string
  accountId: string | null
  profile: {
    type: string,
    id: string,
    firstName: string,
    lastName: string
  } | null
}

export interface AuthenticatedSession {
  accessToken: string
  expiresIn: number
  user: ApiCurrentUser
}

function isUserRole(value: unknown): value is UserRoleValue {
  return Object.values(UserRole).some((role) => role === value)
}

function isLoginResponse(value: unknown): value is LoginResponse {
  if (!value || typeof value !== 'object') return false
  const response = value as Partial<LoginResponse>
  return (
    typeof response.accessToken === 'string' &&
    response.accessToken.length > 0 &&
    response.tokenType === 'Bearer' &&
    Number.isSafeInteger(response.expiresIn) &&
    Number(response.expiresIn) > 0
  )
}

function isCurrentUser(value: unknown): value is ApiCurrentUser {
  if (!value || typeof value !== 'object') return false
  const user = value as Partial<ApiCurrentUser>
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    isUserRole(user.role) &&
    typeof user.status === 'string' &&
    (typeof user.accountId === 'string' || user.accountId === null)
  )
}

export async function authenticate(email: string, password: string): Promise<AuthenticatedSession> {
  const login = await apiRequest<unknown>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (!isLoginResponse(login)) {
    throw new Error('La API devolvió una respuesta de autenticación inválida.')
  }

  const currentUser = await apiRequest<unknown>('/api/auth/me', {
    headers: { Authorization: `${login.tokenType} ${login.accessToken}` },
  })
  if (!isCurrentUser(currentUser)) {
    throw new Error('La API devolvió un usuario autenticado inválido.')
  }

  return {
    accessToken: login.accessToken,
    expiresIn: login.expiresIn,
    user: currentUser,
  }
}
