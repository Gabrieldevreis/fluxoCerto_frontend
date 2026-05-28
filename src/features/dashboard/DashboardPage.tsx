import type { AuthResponse } from '../auth'
import './DashboardPage.css'

interface DashboardPageProps {
  session: AuthResponse
  onLogout: () => void
  onRegisterUser?: () => void
}

interface StatCard {
  key: string
  label: string
  value: string
  hint: string
  accent: 'violet' | 'indigo' | 'emerald' | 'amber'
}

const STATS: StatCard[] = [
  {
    key: 'orders',
    label: 'Pedidos hoje',
    value: '0',
    hint: 'Aguardando integração',
    accent: 'violet',
  },
  {
    key: 'revenue',
    label: 'Receita do dia',
    value: 'R$ 0,00',
    hint: 'Aguardando integração',
    accent: 'emerald',
  },
  {
    key: 'low-stock',
    label: 'Itens em alerta',
    value: '0',
    hint: 'Estoque mínimo',
    accent: 'amber',
  },
  {
    key: 'menu',
    label: 'Itens no cardápio',
    value: '0',
    hint: 'Disponíveis para venda',
    accent: 'indigo',
  },
]

export function DashboardPage({
  session,
  onLogout,
  onRegisterUser,
}: DashboardPageProps) {
  const isAdmin = session.user.role === 'ADMIN'
  const initials = session.user.name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-name">Fluxo Certo</span>
        </div>

        <div className="user-area">
          <div className="user-info">
            <span className="user-name">{session.user.name}</span>
            <span className="user-role">{isAdmin ? 'Administrador' : 'Garçom'}</span>
          </div>
          <div className="avatar" aria-hidden="true">
            {initials || '?'}
          </div>
          <button type="button" className="ghost-button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="hero">
          <h1>Olá, {session.user.name.split(' ')[0]} 👋</h1>
          <p className="subtitle">
            Este é o seu painel do Fluxo Certo. Acompanhe as operações do
            restaurante em tempo real.
          </p>
        </section>

        <section className="stats-grid" aria-label="Indicadores">
          {STATS.map((stat) => (
            <article key={stat.key} className={`stat-card accent-${stat.accent}`}>
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
              <span className="stat-hint">{stat.hint}</span>
            </article>
          ))}
        </section>

        <section className="panels">
          <article className="panel">
            <header className="panel-header">
              <h2>Próximos passos</h2>
              <span className="badge">MVP</span>
            </header>
            <ul className="panel-list">
              <li>
                <span className="bullet" />
                Integrar lista de pedidos em andamento
              </li>
              <li>
                <span className="bullet" />
                Conectar painel financeiro (receitas e despesas)
              </li>
              <li>
                <span className="bullet" />
                Exibir alertas de estoque mínimo
              </li>
              <li>
                <span className="bullet" />
                Gestão de cardápio e categorias
              </li>
            </ul>
          </article>

          <article className="panel">
            <header className="panel-header">
              <h2>Ações rápidas</h2>
            </header>
            <div className="quick-actions">
              {isAdmin && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={onRegisterUser}
                >
                  Cadastrar novo usuário
                </button>
              )}
              <button type="button" className="secondary-button" disabled>
                Criar pedido (em breve)
              </button>
              <button type="button" className="secondary-button" disabled>
                Lançar despesa (em breve)
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
