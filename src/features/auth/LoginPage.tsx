import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthError, login, saveSession } from './auth.api'
import type { AuthResponse } from './auth.types'
import './LoginPage.css'

interface LoginPageProps {
  onSuccess: (data: AuthResponse) => void
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setError(null)
    setSubmitting(true)
    try {
      const data = await login({ email: email.trim(), password })
      saveSession(data)
      onSuccess(data)
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : 'Erro inesperado. Tente novamente.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <span className="dot" aria-hidden="true" />
          <span className="name">Fluxo Certo</span>
        </div>

        <h1>Bem-vindo de volta</h1>
        <p className="subtitle">Acesse sua conta para continuar.</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              minLength={6}
              required
            />
          </div>

          {error && (
            <div className="alert" role="alert">
              {error}
            </div>
          )}

          <button className="submit" type="submit" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="login-footer">© {new Date().getFullYear()} Fluxo Certo</p>
      </div>
    </div>
  )
}
