// app/(dashboard)/propostas/editar/[id]/page.tsx - CÓDIGO COMPLETO COM TODOS OS IMPORTS CORRIGIDOS
'use client';

import { useState, useEffect, use } from 'react';
// 1. IMPORTS CORRIGIDOS COM BASE NA SUA ESTRUTURA DE PASTAS
import { createSupabaseBrowserClient } from '../../../../../lib/supabaseClient';
import { useAuth } from '../../../../context/AuthContext';
import TabsContainer from '../../nova/components/TabsContainer';
import styles from '../../nova/styles/gerar-proposta.module.css';

export default function EditarPropostaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const supabase = createSupabaseBrowserClient();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchPropostaData = async () => {
      if (!id || !user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('propostas')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar dados da proposta:', error);
        alert('Não foi possível carregar os dados da proposta. Você tem permissão para vê-la?');
        setLoading(false);
      } else if (data) {
        const loadedFormData = {
          dadosCliente: { tipoNegociacao: data.tipo_negociacao, statusNegociacao: data.status_negociacao, vendedorResponsavel: data.vendedor_responsavel, clientes: data.clientes_contato, empresas: data.empresas, telefone: data.telefone, dataProposta: data.data_proposta, validadeProposta: data.validade_dias, },
          servicos: data.servicos_detalhes || [],
          condicoes: { textoCondicoes: data.condicoes_pagamento, textoComplementares: data.informacoes_complementares, },
          resumo: { totalRecorrente: data.valor_total_recorrente, totalEventual: data.valor_total_eventual, },
        };
        setFormData(loadedFormData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPropostaData();
    }
  }, [id, user, authLoading, supabase]);

  if (loading || authLoading) {
    return <div style={{ padding: '2rem' }}>Carregando dados da proposta...</div>;
  }

  if (!formData) {
    return <div style={{ padding: '2rem' }}>Proposta com ID {id} não encontrada ou você não tem permissão para acessá-la.</div>;
  }

  return (
    <>
      <header className="header">
        <h1>Editar Proposta #{id}</h1>
        <div className="user-info">
            <span>Bem-vindo, {user?.email}!</span>
            <div className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</div>
        </div>
      </header>

      <main className="content">
        <TabsContainer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          setFormData={setFormData}
          supabase={supabase}
          propostaId={parseInt(id, 10)}
        />
      </main>
    </>
  );
}
