import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthError, register } from './auth.api'
import type { UserRole } from './auth.types'
import { USER_ROLES } from './auth.types'
import './LoginPage.css'

interface RegisterPageProps {
  token: string
  onBack: () => void
  onSuccess?: (createdUserEmail: string) => void
}

export function RegisterPage({ token, onBack, onSuccess }: RegisterPageProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<UserRole>('WAITER')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function resetForm() {
    setName('')
    setEmail('')
    setPassword('')
    setConfirm('')
    setRole('WAITER')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setError(null)
    setSuccess(null)

    if (name.trim().length < 2) {
      setError('Nome deve ter ao menos 2 caracteres.')
      return
    }
    if (password.length < 6) {
      setError('Senha deve ter ao menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não conferem.')
      return
    }

    setSubmitting(true)
    try {
      const data = await register(
        {
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        },
        token,
      )
      setSuccess(`Usuário ${data.user.email} criado com sucesso.`)
      onSuccess?.(data.user.email)
      resetForm()
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

        <h1>Criar novo usuário</h1>
        <p className="subtitle">
          Cadastre um novo membro da equipe. Disponível apenas para administradores.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              minLength={2}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="usuario@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="role">Perfil</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={submitting}
            >
              {USER_ROLES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              minLength={6}
              required
            />
            <span className="hint">Mínimo de 6 caracteres.</span>
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirmar senha</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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

          {success && (
            <div className="success" role="status">
              {success}
            </div>
          )}

          <button className="submit" type="submit" disabled={submitting}>
            {submitting ? 'Criando...' : 'Criar usuário'}
          </button>

          <div className="actions-row">
            <button
              type="button"
              className="link-button"
              onClick={onBack}
              disabled={submitting}
            >
              ← Voltar
            </button>
          </div>
        </form>

        <p className="login-footer">© {new Date().getFullYear()} Fluxo Certo</p>
      </div>
    </div>
  )
}
