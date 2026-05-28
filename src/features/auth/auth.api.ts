import type {
  ApiErrorBody,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from './auth.types'

const API_BASE = '/api'
const TOKEN_KEY = 'fluxo-certo:token'
const USER_KEY = 'fluxo-certo:user'

export class AuthError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}

function extractMessage(body: ApiErrorBody | null, fallback: string): string {
  if (!body) return fallback
  const { message } = body
  if (Array.isArray(message)) return message.join(' ')
  if (typeof message === 'string' && message.length > 0) return message
  return fallback
}

interface RequestOptions {
  method: 'GET' | 'POST'
  path: string
  body?: unknown
  token?: string | null
  fallbackError: string
}

async function request<T>(opts: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (opts.token) {
    headers.Authorization = `Bearer ${opts.token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE}${opts.path}`, {
      method: opts.method,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    })
  } catch {
    throw new AuthError('Não foi possível conectar ao servidor.', 0)
  }

  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) {
    const message = extractMessage(body as ApiErrorBody | null, opts.fallbackError)
    throw new AuthError(message, response.status)
  }

  return body as T
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>({
    method: 'POST',
    path: '/auth/login',
    body: payload,
    fallbackError: 'Falha ao realizar login.',
  })
}

export function register(
  payload: RegisterPayload,
  token: string,
): Promise<AuthResponse> {
  return request<AuthResponse>({
    method: 'POST',
    path: '/auth/register',
    body: payload,
    token,
    fallbackError: 'Falha ao registrar usuário.',
  })
}

export function saveSession(data: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, data.accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredSession(): AuthResponse | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const rawUser = localStorage.getItem(USER_KEY)
  if (!token || !rawUser) return null
  try {
    return { accessToken: token, user: JSON.parse(rawUser) }
  } catch {
    return null
  }
}
