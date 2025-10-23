// Caminho: app/dashboard/propostas/nova/components/EtapaResumo.tsx - VERSÃO FINAL CORRIGIDA
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import { ProposalState, ProposalAction } from '../state';
import styles from '../styles/gerar-proposta.module.css';

interface EtapaResumoProps {
  state: ProposalState;
  dispatch: React.Dispatch<ProposalAction>;
  onSave?: (state: ProposalState) => void;
  isEditing?: boolean;
}

export default function EtapaResumo({ state, dispatch, onSave, isEditing = false }: EtapaResumoProps) {
  const supabase = createBrowserClient();
  const { user } = useAuth();
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('dados');

  const toggleAccordion = (section: string) => { setOpenAccordion(openAccordion === section ? null : section); };
  const formatCurrency = (value: number = 0) => { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); };

  // ✅ CORREÇÃO 1: Esta é a função que PRECISA ser chamada.
  const handleSaveProposal = async () => {
    if (!user) {
      alert("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }

    // Adicionamos um bloco try...catch para capturar QUALQUER erro no processo.
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('escritorio_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || !profile.escritorio_id) {
        throw new Error('Não foi possível identificar o seu escritório. A proposta não pode ser salva.');
      }
      
      const isClienteInformado = state.clienteId !== null || (state.nomesEmpresa.length > 0 && state.nomesEmpresa[0].trim() !== '');
      if (!isClienteInformado) {
        throw new Error("Nenhum cliente foi informado para a proposta.");
      }

      const propostaPayload = {
        user_id: user.id,
        escritorio_id: profile.escritorio_id, // A adição crucial
        cliente_id: state.clienteId, 
        nome_cliente_avulso: state.nomesEmpresa.join(' / '),
        contato_cliente_avulso: state.nomesCliente.join(' / '),
        telefone_cliente_avulso: state.telefone,
        status: state.statusNegociacao,
        valor_recorrente: state.valores.recorrente,
        valor_eventual: state.valores.eventual,
        condicoes_pagamento: state.condicoesPagamento,
        informacoes_complementares: state.informacoesComplementares,
        validade_dias: state.validadeDias,
        data_proposta: state.dataProposta,
        tipo_negociacao: state.tipoNegociacao,
        vendedor_responsavel: state.vendedorResponsavel,
      };

      const { data: propostaData, error: propostaError } = await supabase.from('propostas').insert(propostaPayload).select('id').single();
      if (propostaError || !propostaData) {
        throw new Error(`Falha ao salvar a proposta. Erro: ${propostaError.message}`);
      }

      const propostaId = propostaData.id;
      if (state.servicosSelecionados.length > 0) {
        const itensParaSalvar = state.servicosSelecionados.map(servico => ({
          proposta_id: propostaId, 
          user_id: user.id, 
          escritorio_id: profile.escritorio_id, // A adição crucial aqui também
          servico_id: servico.id, 
          nome_servico: servico.nome,
          descricao_servico: Array.isArray(servico.descricao) ? servico.descricao.join('\n') : servico.descricao,
          valor_servico: servico.valor, 
          categoria_servico: servico.categoria,
        }));
        const { error: itensError } = await supabase.from('proposta_itens').insert(itensParaSalvar);
        if (itensError) {
          throw new Error(`Falha ao salvar os serviços da proposta. Erro: ${itensError.message}`);
        }
      }

      alert('Proposta salva com sucesso!');
      dispatch({ type: 'RESETAR_ESTADO' });
      router.push('/dashboard/propostas');

    } catch (error: any) {
      console.error("ERRO CAPTURADO NO PROCESSO DE SALVAR:", error);
      alert(`Ocorreu um erro: ${error.message}`);
    }
  };

  // ✅ CORREÇÃO 2: A função do clique agora chama a função correta.
  const handleSaveClick = async () => {
    setIsSaving(true);
    // Se estamos em modo de edição, chamamos a função do pai (onSave).
    if (isEditing && onSave) { 
      await onSave(state);
    } else { 
      // Se estamos criando, chamamos a função de salvar deste próprio arquivo.
      await handleSaveProposal();
    }
    setIsSaving(false);
  };

  return (
    <div>
      <h2 className={styles['review-main-title']}>Resumo da Proposta</h2>
      <div className={styles['accordion-container']}>
        <div className={styles['accordion-item']}>
          <button type="button" className={styles['accordion-header']} onClick={() => toggleAccordion('dados')}>
            Dados do Cliente
            <span className={`${styles['accordion-icon']} ${openAccordion === 'dados' ? styles.open : ''}`}>^</span>
          </button>
          {openAccordion === 'dados' && (
            <div className={styles['accordion-content']}>
              <p><strong>Nome da empresa:</strong> {state.clienteSelecionado?.razao_social || state.nomesEmpresa.join(' • ') || 'Não informado'}</p>
              <p><strong>Nome fantasia:</strong> {state.clienteSelecionado?.nome_fantasia || 'Não informado'}</p>
              <p><strong>CNPJ/CPF:</strong> {state.clienteSelecionado?.cnpj_ou_cpf || 'Não informado'}</p>
              <p><strong>Nome do cliente:</strong> {state.clienteSelecionado?.contato_nome || state.nomesCliente.join(' • ') || 'Não informado'}</p>
              <p><strong>Telefone / WhatsApp:</strong> {state.telefone || 'Não informado'}</p>
              <p><strong>Data da Proposta:</strong> {new Date(state.dataProposta + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
              <p><strong>Validade da Proposta:</strong> {state.validadeDias} dias</p>
              <p><strong>Nome do vendedor:</strong> {state.vendedorResponsavel || 'Não informado'}</p>
            </div>
          )}
        </div>
        <div className={styles['accordion-item']}>
          <button type="button" className={styles['accordion-header']} onClick={() => toggleAccordion('servicos')}>
            Serviços ({state.servicosSelecionados.length})
            <span className={`${styles['accordion-icon']} ${openAccordion === 'servicos' ? styles.open : ''}`}>^</span>
          </button>
          {openAccordion === 'servicos' && (
            <div className={styles['accordion-content']}>
              {state.servicosSelecionados.map((servico) => (
                <div key={servico.idUnico} className={styles['service-details-block']}>
                  <p><strong>{servico.nome} - {formatCurrency(servico.valor)}</strong> ({servico.categoria})</p>
                  <ul className={styles['service-description-list']}>
                    {(Array.isArray(servico.descricao) ? servico.descricao : [servico.descricao]).map((desc, index) => (
                      desc && <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles['accordion-item']}>
          <button type="button" className={styles['accordion-header']} onClick={() => toggleAccordion('condicoes')}>
            Valores e Condições
            <span className={`${styles['accordion-icon']} ${openAccordion === 'condicoes' ? styles.open : ''}`}>^</span>
          </button>
          {openAccordion === 'condicoes' && (
            <div className={styles['accordion-content']}>
              <p><strong>Total Recorrente:</strong> {formatCurrency(state.valores.recorrente)}</p>
              <p><strong>Total Eventual:</strong> {formatCurrency(state.valores.eventual)}</p>
              <hr style={{ margin: '1rem 0' }} />
              <p><strong>Condições de Pagamento:</strong></p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{state.condicoesPagamento || 'Nenhuma condição especificada.'}</p>
              <hr style={{ margin: '1rem 0' }} />
              <p><strong>Informações Complementares:</strong></p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{state.informacoesComplementares || 'Nenhuma informação complementar.'}</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles['actions-bar']}>
        <button type="button" className={styles['action-btn-pdf']} disabled><i className="fas fa-file-pdf"></i> Gerar PDF</button>
        <button type="button" className={styles['action-btn-link']} disabled><i className="fas fa-link"></i> Gerar Link</button>
      </div>
      <div className={`${styles['form-navigation']} ${styles['space-between']}`}>
        <button type="button" onClick={() => dispatch({ type: 'IR_PARA_ETAPA', payload: 3 })} className={`${styles['btn-nav']} ${styles['btn-prev']}`} disabled={isSaving}>
          Anterior
        </button>
        <button type="button" onClick={handleSaveClick} className={`${styles['btn-nav']} ${styles['btn-save']}`} disabled={isSaving}>
          {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Proposta')}
        </button>
      </div>
    </div>
  );
}
