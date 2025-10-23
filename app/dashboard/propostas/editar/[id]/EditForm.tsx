// Caminho: app/dashboard/propostas/editar/[id]/EditForm.tsx - CORREÇÃO DE SINTAXE
'use client';

import { useReducer, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import { proposalReducer, ProposalState, initialState } from '../../nova/state';
import ProposalForm from '../../nova/components/ProposalForm';
// ✅ 1. Importando o Header padrão para manter a consistência
import Header from '../../../components/Header';

interface EditFormPageProps {
  id: string;
}

export default function EditFormPage({ id }: EditFormPageProps) {
  const supabase = createBrowserClient();
  const router = useRouter();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(proposalReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (a sua função 'fetchProposta' está perfeita e não precisa de alterações) ...
    const fetchProposta = async () => {
      const { data: proposta, error: propostaError } = await supabase.from('propostas').select('*, clientes(*)').eq('id', id).single();
      if (propostaError) { console.error('Erro ao buscar proposta:', propostaError); setLoading(false); return; }
      const { data: itens, error: itensError } = await supabase.from('proposta_itens').select('*').eq('proposta_id', id);
      if (itensError) { console.error('Erro ao buscar itens:', itensError); }
      const cliente = proposta.clientes;
      const dadosFormatados: Partial<ProposalState> = {
        clienteId: proposta.cliente_id,
        nomesEmpresa: [cliente?.nome_completo || proposta.nome_cliente_avulso || ''],
        nomesCliente: [cliente?.nome_completo || proposta.contato_cliente_avulso || ''],
        telefone: cliente?.telefone || proposta.telefone_cliente_avulso || '',
        tipoNegociacao: proposta.tipo_negociacao || 'cliente_novo',
        statusNegociacao: proposta.status || 'Rascunho',
        vendedorResponsavel: proposta.vendedor_responsavel || '',
        dataProposta: proposta.data_proposta,
        validadeDias: proposta.validade_dias,
        servicosSelecionados: itens?.map(item => ({ ...item, id: item.servico_id, idUnico: `item-${item.id}`, nome: item.nome_servico || '', descricao: (item.descricao_servico || '').split('\n'), valor: item.valor_servico || 0, categoria: item.categoria_servico || 'Eventual', })) || [],
        condicoesPagamento: proposta.condicoes_pagamento || '',
        informacoesComplementares: proposta.informacoes_complementares || '',
      };
      dispatch({ type: 'HIDRATAR_ESTADO', payload: dadosFormatados });
      setLoading(false);
    };
    fetchProposta();
  }, [id, supabase]);

  const handleUpdate = async (finalState: ProposalState) => {
    if (!user) { alert("Sessão expirada. Por favor, faça login novamente."); return; }
    try {
      const { data: profile, error: profileError } = await supabase.from('profiles').select('escritorio_id').eq('id', user.id).single();
      if (profileError || !profile || !profile.escritorio_id) { throw new Error('Não foi possível identificar o seu escritório para salvar as alterações.'); }
      const propostaPayload = {
        cliente_id: finalState.clienteId,
        nome_cliente_avulso: finalState.clienteId ? null : finalState.nomesEmpresa.join(' / '),
        contato_cliente_avulso: finalState.clienteId ? null : finalState.nomesCliente.join(' / '),
        telefone_cliente_avulso: finalState.clienteId ? null : finalState.telefone,
        status: finalState.statusNegociacao,
        valor_recorrente: finalState.valores.recorrente,
        valor_eventual: finalState.valores.eventual,
        condicoes_pagamento: finalState.condicoesPagamento,
        informacoes_complementares: finalState.informacoesComplementares,
        validade_dias: finalState.validadeDias,
        tipo_negociacao: finalState.tipoNegociacao,
        vendedor_responsavel: finalState.vendedorResponsavel,
      };
      const { error: updateError } = await supabase.from('propostas').update(propostaPayload).eq('id', id);
      if (updateError) { throw new Error(`Falha ao salvar as alterações na proposta. Erro: ${updateError.message}`); }
      await supabase.from('proposta_itens').delete().eq('proposta_id', id);
      if (finalState.servicosSelecionados.length > 0) {
        const itensParaSalvar = finalState.servicosSelecionados.map(servico => ({
          proposta_id: parseInt(id),
          user_id: user.id,
          escritorio_id: profile.escritorio_id,
          servico_id: servico.id,
          nome_servico: servico.nome,
          descricao_servico: Array.isArray(servico.descricao) ? servico.descricao.join('\n') : servico.descricao,
          valor_servico: servico.valor,
          categoria_servico: servico.categoria,
        }));
        const { error: insertItemsError } = await supabase.from('proposta_itens').insert(itensParaSalvar);
        if (insertItemsError) { throw new Error(`Falha ao salvar os novos serviços da proposta. Erro: ${insertItemsError.message}`); }
      }
      alert('Proposta atualizada com sucesso!');
      router.push('/dashboard/propostas');
    } catch (error: any) {
      console.error("ERRO AO ATUALIZAR PROPOSTA:", error);
      alert(`Ocorreu um erro: ${error.message}`);
    }
  };

  return (
    <>
      {/* ✅✅✅ CORREÇÃO DE SINTAXE APLICADA AQUI ✅✅✅ */}
      {/* O Header agora é o componente padrão e está fora do <main> */}
      <Header title={`Editar Proposta #${id}`} />
      
      <main className="content">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Carregando dados da proposta...</p>
        ) : (
          <ProposalForm state={state} dispatch={dispatch} onSave={handleUpdate} isEditing={true} />
        )}
      </main>
    </>
  );
}
