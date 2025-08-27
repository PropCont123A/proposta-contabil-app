// app/(dashboard)/propostas/editar/[id]/page.tsx (VERSÃO CORRIGIDA E SIMPLIFICADA)
'use client';

import { useState, useEffect } from 'react';
import ProposalForm from '../../nova/components/ProposalForm';
import { createClient } from '@/lib/client';
import { ProposalState } from '../../nova/state';

export default function EditarPropostaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<ProposalState> | undefined>(undefined);

  useEffect(() => {
    const fetchProposta = async () => {
      const { data: proposta, error: propostaError } = await supabase
        .from('propostas')
        .select('*')
        .eq('id', params.id)
        .single();

      if (propostaError || !proposta) {
        console.error('Erro ao buscar proposta:', propostaError);
        setLoading(false);
        return;
      }

      const { data: itens, error: itensError } = await supabase
        .from('proposta_itens')
        .select('*')
        .eq('proposta_id', params.id);

      if (itensError) {
        console.error('Erro ao buscar itens da proposta:', itensError);
        setLoading(false);
        return;
      }

      // Mapeia os dados do banco para o formato do nosso estado
      const dadosFormatados: Partial<ProposalState> = {
        clienteSelecionado: proposta.cliente_id ? { id: proposta.cliente_id, nome_fantasia_ou_nome: proposta.cliente_nome_avulso || '' } as any : null,
        servicosSelecionados: itens || [],
        condicoesPagamento: proposta.condicoes_pagamento || '',
        informacoesComplementares: proposta.informacoes_complementares || '',
        validadeDias: proposta.validade_dias || 30,
      };

      setInitialData(dadosFormatados);
      setLoading(false);
    };

    fetchProposta();
  }, [params.id, supabase]);

  return (
    <>
      <header className="header">
        <h1>Editar Proposta #{params.id}</h1>
        <div className="user-info">
          <span>Bem-vindo, Emerson!</span>
          <div className="user-avatar">E</div>
        </div>
      </header>
      <main className="content">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Carregando dados da proposta...</p>
        ) : (
          <ProposalForm initialData={initialData} /> // Passa os dados iniciais para o formulário
        )}
      </main>
    </>
  );
}
