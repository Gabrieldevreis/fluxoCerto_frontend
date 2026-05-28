import { useState } from 'react'
import {
  LoginPage,
  RegisterPage,
  clearSession,
  getStoredSession,
} from './features/auth'
import type { AuthResponse } from './features/auth'
import './features/auth/LoginPage.css'

type View = 'session' | 'register'

function App() {
  const [session, setSession] = useState<AuthResponse | null>(() =>
    getStoredSession(),
  )
  const [view, setView] = useState<View>('session')

  function handleLogout() {
    clearSession()
    setSession(null)
    setView('session')
  }

  if (!session) {
    return <LoginPage onSuccess={setSession} />
  }

  if (view === 'register' && session.user.role === 'ADMIN') {
    return (
      <RegisterPage
        token={session.accessToken}
        onBack={() => setView('session')}
      />
    )
  }

  return (
    <div className="login-shell">
      <div className="session-card">
        <div className="header">
          <h2>Olá, {session.user.name}</h2>
          <span className="role-pill">{session.user.role}</span>
        </div>
        <p className="muted">Você está autenticado no Fluxo Certo.</p>

        <div className="session-info">
          <div className="row">
            <span className="key">E-mail</span>
            <span className="value">{session.user.email}</span>
          </div>
          <div className="row">
            <span className="key">Perfil</span>
            <span className="value">{session.user.role}</span>
          </div>
          <div className="row">
            <span className="key">ID</span>
            <span className="value">{session.user.id}</span>
          </div>
        </div>

        <div className="actions">
          {session.user.role === 'ADMIN' && (
            <button
              type="button"
              className="submit"
              onClick={() => setView('register')}
            >
              Cadastrar novo usuário
            </button>
          )}
          <button type="button" className="logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
