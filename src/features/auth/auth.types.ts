export type UserRole = 'ADMIN' | 'WAITER'

export const USER_ROLES: ReadonlyArray<{ value: UserRole; label: string }> = [
  { value: 'WAITER', label: 'Garçom' },
  { value: 'ADMIN', label: 'Administrador' },
]

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface ApiErrorBody {
  statusCode?: number
  message?: string | string[]
  error?: string
}
