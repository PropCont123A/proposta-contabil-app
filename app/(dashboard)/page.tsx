// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // LINHA ANTIGA REMOVIDA
import { createBrowserClient } from '@supabase/ssr'; // LINHA NOVA ADICIONADA
import ProfileMenu from './components/ProfileMenu';

// Interface para definir o formato dos dados que vamos receber
interface DashboardStats {
  total_propostas: number;
  em_negociacao: number;
  contratadas: number;
  taxa_conversao: number;
  novas_negociacao_semana: number;
  novas_contratadas_mes: number;
  variacao_propostas_mes: number;
  variacao_conversao_mes: number;
}

export default function DashboardPage() {
  // Estado para armazenar os dados e o status de carregamento
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // INICIALIZAÇÃO DO SUPABASE ATUALIZADA
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  //
  // ===== TODO O RESTO DO SEU CÓDIGO PERMANECE IDÊNTICO =====
  //

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Chamada à nossa nova função de banco de dados!
      const { data, error } = await supabase.rpc('get_dashboard_stats');

      if (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        alert('Não foi possível carregar os dados do dashboard.');
      } else if (data && data.length > 0) {
        // O resultado vem como um array, pegamos o primeiro item
        setStats(data[0]);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [supabase]);

  // Função auxiliar para formatar os textos de variação
  const formatChangeText = (value: number | null | undefined, unit: string) => {
    if (loading || value === null || typeof value === 'undefined') {
      return <span className="stat-change-placeholder">&nbsp;</span>;
    }
    const isPositive = value >= 0;
    const colorClass = isPositive ? 'positive' : 'negative';
    const sign = isPositive ? '+' : '';
    return (
      <span className={`stat-change ${colorClass}`}>
        {sign}{value.toFixed(1)}% {unit}
      </span>
    );
  };

  return (
    <>
      <header className="header">
        <h1>Dashboard</h1>
        {/* O componente ProfileMenu substitui o user-info estático */}
        <ProfileMenu />
      </header>

      <main className="content">
        <div className="stats-grid">
          {/* Card 1: Propostas Enviadas */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Propostas Enviadas</span>
              <div className="stat-icon icon-purple"><i className="fas fa-paper-plane"></i></div>
            </div>
            <div className="stat-value">{loading ? '...' : stats?.total_propostas ?? 0}</div>
            {formatChangeText(stats?.variacao_propostas_mes, 'este mês')}
          </div>

          {/* Card 2: Em Negociação */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Em Negociação</span>
              <div className="stat-icon icon-blue"><i className="fas fa-handshake"></i></div>
            </div>
            <div className="stat-value">{loading ? '...' : stats?.em_negociacao ?? 0}</div>
            <div className="stat-change positive">+{loading ? '...' : stats?.novas_negociacao_semana ?? 0} esta semana</div>
          </div>

          {/* Card 3: Contratadas */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Contratadas</span>
              <div className="stat-icon icon-green"><i className="fas fa-check-circle"></i></div>
            </div>
            <div className="stat-value">{loading ? '...' : stats?.contratadas ?? 0}</div>
            <div className="stat-change positive">+{loading ? '...' : stats?.novas_contratadas_mes ?? 0} este mês</div>
          </div>

          {/* Card 4: Taxa de Conversão */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Taxa de Conversão</span>
              <div className="stat-icon icon-orange"><i className="fas fa-percentage"></i></div>
            </div>
            <div className="stat-value">{loading ? '...' : `${(stats?.taxa_conversao ?? 0).toFixed(1)}%`}</div>
            {formatChangeText(stats?.variacao_conversao_mes, 'este mês')}
          </div>
        </div>

        <div className="quick-actions">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            {/* Links corrigidos para usar as rotas do Next.js */}
            <Link href="/propostas/nova" className="action-btn"><i className="fas fa-plus"></i> Nova Proposta</Link>
            <Link href="/propostas" className="action-btn"><i className="fas fa-eye"></i> Ver Propostas</Link>
            <Link href="/clientes" className="action-btn"><i className="fas fa-user-plus"></i> Novo Cliente</Link>
            <Link href="/configuracoes" className="action-btn"><i className="fas fa-cog"></i> Configurações</Link>
          </div>
        </div>
      </main>
    </>
  );
}
