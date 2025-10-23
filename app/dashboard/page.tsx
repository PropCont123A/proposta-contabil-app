// Caminho: app/dashboard/page.tsx
// VERSÃO FINAL COMPLETA - Com Header Padrão e Lógica de Stats Corrigida

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import Header from './components/Header'; // ✅ Importando o Header padrão

// A interface agora reflete exatamente o que a nova função SQL retorna.
interface DashboardStats {
  total_propostas: number;
  em_negociacao: number;
  contratadas: number;
  taxa_conversao: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient();
  const { user, loading: authLoading } = useAuth(); // Usamos 'user' para a chamada RPC

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // ✅ LÓGICA CORRIGIDA: A chamada RPC agora passa o ID do usuário logado.
      // A função no Supabase fará a diferenciação entre GESTOR e REGULAR.
      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        p_user_id: user.id
      });

      if (error) throw error;
      if (data && data.length > 0) setStats(data[0]);

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    if (authLoading) return;
    fetchDashboardData();
  }, [authLoading, fetchDashboardData]);

  // Lógica de renderização do loading da página
  if (authLoading || loading) {
    return (
      <>
        {/* Mostra o Header mesmo durante o carregamento para uma melhor UX */}
        <Header title="Dashboard" description="Visão geral das suas atividades." />
        <main className="content">
          <div className="content-box" style={{textAlign: 'center', padding: '2rem'}}>Carregando...</div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* ✅ HEADER PADRÃO IMPLEMENTADO */}
      <Header title="Dashboard" description="Visão geral das suas atividades e desempenho." />

      <main className="content">
        <div className="stats-grid">
          {/* Card 1: Propostas Enviadas */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Propostas Enviadas</span>
              <div className="stat-icon icon-purple"><i className="fas fa-paper-plane"></i></div>
            </div>
            <div className="stat-value">{stats?.total_propostas ?? 0}</div>
          </div>

          {/* Card 2: Em Negociação */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Em Negociação</span>
              <div className="stat-icon icon-blue"><i className="fas fa-handshake"></i></div>
            </div>
            <div className="stat-value">{stats?.em_negociacao ?? 0}</div>
          </div>

          {/* Card 3: Contratadas */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Contratadas</span>
              <div className="stat-icon icon-green"><i className="fas fa-check-circle"></i></div>
            </div>
            <div className="stat-value">{stats?.contratadas ?? 0}</div>
          </div>

          {/* Card 4: Taxa de Conversão */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Taxa de Conversão</span>
              <div className="stat-icon icon-orange"><i className="fas fa-percentage"></i></div>
            </div>
            <div className="stat-value">{`${(stats?.taxa_conversao ?? 0).toFixed(1)}%`}</div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <Link href="/dashboard/propostas/nova" className="action-btn"><i className="fas fa-plus"></i> Nova Proposta</Link>
            <Link href="/dashboard/propostas" className="action-btn"><i className="fas fa-eye"></i> Ver Propostas</Link>
            <Link href="/dashboard/clientes" className="action-btn"><i className="fas fa-user-plus"></i> Novo Cliente</Link>
            <Link href="/dashboard/configuracoes" className="action-btn"><i className="fas fa-cog"></i> Configurações</Link>
          </div>
        </div>
      </main>
    </>
  );
}
