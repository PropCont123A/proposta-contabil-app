// app/page.tsx
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <>
      <header className="header">
        <h1>Dashboard</h1>
        <div className="user-info">
            <span>Bem-vindo, Emerson!</span>
            <div className="user-avatar">E</div>
        </div>
      </header>

      <main className="content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Propostas Enviadas</span>
              <div className="stat-icon icon-purple"><i className="fas fa-paper-plane"></i></div>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-change positive">+12% este mês</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Em Negociação</span>
              <div className="stat-icon icon-blue"><i className="fas fa-handshake"></i></div>
            </div>
            <div className="stat-value">8</div>
            <div className="stat-change positive">+3 esta semana</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Contratadas</span>
              <div className="stat-icon icon-green"><i className="fas fa-check-circle"></i></div>
            </div>
            <div className="stat-value">15</div>
            <div className="stat-change positive">+5 este mês</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Taxa de Conversão</span>
              <div className="stat-icon icon-orange"><i className="fas fa-percentage"></i></div>
            </div>
            <div className="stat-value">62.5%</div>
            <div className="stat-change positive">+8% este mês</div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <Link href="#" className="action-btn"><i className="fas fa-plus"></i> Nova Proposta</Link>
            <Link href="#" className="action-btn"><i className="fas fa-eye"></i> Ver Propostas</Link>
            <Link href="#" className="action-btn"><i className="fas fa-user-plus"></i> Novo Cliente</Link>
            <Link href="/configuracoes" className="action-btn"><i className="fas fa-cog"></i> Configurações</Link>
          </div>
        </div>
      </main>
    </>
  );
}
