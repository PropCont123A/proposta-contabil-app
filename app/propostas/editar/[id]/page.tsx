// app/propostas/editar/[id]/page.tsx
'use client';

// 1. IMPORTAR 'use' DO REACT
import { useState, useEffect, use } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import TabsContainer from '../../nova/components/TabsContainer';
import styles from '../../nova/styles/gerar-proposta.module.css';

// A assinatura da função muda um pouco para aceitar a Promise
export default function EditarPropostaPage({ params }: { params: Promise<{ id: string }> }) {
  // 2. USAR React.use() PARA ACESSAR O ID
  const { id } = use(params);

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPropostaData = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('propostas')
        .select('*')
        .eq('id', id) // Usa o 'id' que foi extraído com use()
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
        setLoading(false);
      }
    };

    fetchPropostaData();
  }, [id, supabase]); // A dependência agora é o 'id' extraído

  if (loading) {
    return <div>Carregando dados da proposta...</div>;
  }

  if (!formData) {
    return <div>Proposta com ID {id} não encontrada.</div>;
  }

  return (
    <>
      <header className="header">
        <h1>Editar Proposta #{id}</h1>
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
          propostaId={id} 
        />
      </main>
    </>
  );
}
