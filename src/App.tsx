import { useState } from 'react'
import {
  LoginPage,
  RegisterPage,
  clearSession,
  getStoredSession,
} from './features/auth'
import type { AuthResponse } from './features/auth'
import { DashboardPage } from './features/dashboard'

type View = 'dashboard' | 'register'

function App() {
  const [session, setSession] = useState<AuthResponse | null>(() =>
    getStoredSession(),
  )
  const [view, setView] = useState<View>('dashboard')

  function handleLoginSuccess(data: AuthResponse) {
    setSession(data)
    setView('dashboard')
  }

  function handleLogout() {
    clearSession()
    setSession(null)
    setView('dashboard')
  }

  if (!session) {
    return <LoginPage onSuccess={handleLoginSuccess} />
  }

  if (view === 'register' && session.user.role === 'ADMIN') {
    return (
      <RegisterPage
        token={session.accessToken}
        onBack={() => setView('dashboard')}
      />
    )
  }

  return (
    <DashboardPage
      session={session}
      onLogout={handleLogout}
      onRegisterUser={() => setView('register')}
    />
  )
}

export default App
