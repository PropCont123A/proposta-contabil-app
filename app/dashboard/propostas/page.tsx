// Caminho: app/dashboard/propostas/page.tsx
// VERSÃO CORRIGIDA - PRONTA PARA GERAR PDF

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import Header from '../components/Header';
import ProposalsTable from '../components/ProposalsTable'; // Assumindo que este componente será corrigido a seguir

// ✅ 1. ADICIONADO 'share_id' À INTERFACE
export interface Proposta {
  id: number;
  share_id: string; // Essencial para criar o link do PDF
  cliente_nome: string | null;
  data_proposta: string;
  status: string;
  valor_total_recorrente: number;
  valor_total_eventual: number;
  vendedor_nome: string;
}

export default function MinhasPropostasPage() {
  const supabase = createBrowserClient();
  const { profile, loading: authLoading } = useAuth();

  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropostas = useCallback(async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    // ✅ 2. ADICIONADO 'share_id' À QUERY
    let query = supabase
      .from('propostas')
      .select(`
        id,
        share_id, 
        data_proposta,
        status,
        valor_recorrente,
        valor_eventual,
        nome_cliente_avulso,
        clientes ( nome_fantasia_ou_nome ),
        vendedor:vendedor_responsavel ( full_name )
      `);

    if (profile.role !== 'GESTOR') {
      query = query.eq('vendedor_responsavel', profile.id);
    }

    const { data, error: fetchError } = await query.order('id', { ascending: false });

    if (fetchError) {
      console.error('Erro detalhado ao buscar propostas:', fetchError);
      setError('Falha ao carregar as propostas.');
      setPropostas([]);
    } else if (data) {
      const propostasFormatadas = data.map(p => ({
        id: p.id,
        share_id: p.share_id, // ✅ 3. PASSANDO O 'share_id' PARA O OBJETO
        cliente_nome: p.clientes?.nome_fantasia_ou_nome || p.nome_cliente_avulso || 'Cliente não informado',
        data_proposta: p.data_proposta,
        status: p.status,
        valor_total_recorrente: p.valor_recorrente || 0,
        valor_total_eventual: p.valor_eventual || 0,
        vendedor_nome: p.vendedor?.full_name || 'Vendedor não atribuído',
      }));
      setPropostas(propostasFormatadas);
    }
    setLoading(false);
  }, [supabase, profile]);

  useEffect(() => {
    if (!authLoading) {
      fetchPropostas();
    }
  }, [authLoading, fetchPropostas]);

  const handleDelete = async (id: number) => {
    if (confirm(`Tem certeza que deseja excluir a proposta #${id}?`)) {
      const { error } = await supabase.from('propostas').delete().match({ id });

      if (error) {
        alert('Falha ao excluir a proposta.');
      } else {
        setPropostas(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  return (
    <>
      <Header title="Minhas Propostas" />
      <main className="content">
        <div className="content-box">
          <ProposalsTable
            propostas={propostas}
            onDelete={handleDelete}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </>
  );
}
