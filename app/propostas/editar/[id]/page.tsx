// app/propostas/editar/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// Caminhos ajustados para a nova estrutura
import TabsContainer from '../../nova/components/TabsContainer';
import styles from '../../nova/styles/gerar-proposta.module.css';

export default function EditarPropostaPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPropostaData = async () => {
      if (!params.id) return; // Guarda de segurança

      const { data, error } = await supabase
        .from('propostas')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Erro ao buscar dados da proposta:', error);
        alert('Não foi possível carregar os dados da proposta.');
        setLoading(false);
      } else if (data) {
        const loadedFormData = {
          dadosCliente: {
            tipoNegociacao: data.tipo_negociacao,
            statusNegociacao: data.status_negociacao,
            vendedorResponsavel: data.vendedor_responsavel,
            clientes: data.clientes_contato,
            empresas: data.empresas,
            telefone: data.telefone,
            dataProposta: data.data_proposta,
            validadeProposta: data.validade_dias,
          },
          servicos: data.servicos_detalhes || [],
          condicoes: {
            textoCondicoes: data.condicoes_pagamento,
            textoComplementares: data.informacoes_complementares,
          },
          resumo: {
            totalRecorrente: data.valor_total_recorrente,
            totalEventual: data.valor_total_eventual,
          },
        };
        setFormData(loadedFormData);
        setLoading(false);
      } else {
        setLoading(false); // Caso não encontre dados
      }
    };

    fetchPropostaData();
  }, [params.id, supabase]);

  if (loading) {
    return <div>Carregando dados da proposta...</div>;
  }

  if (!formData) {
    return <div>Proposta com ID {params.id} não encontrada.</div>;
  }

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
        <TabsContainer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          setFormData={setFormData}
          supabase={supabase}
          propostaId={params.id} 
        />
      </main>
    </>
  );
}
