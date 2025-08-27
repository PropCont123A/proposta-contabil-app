// app/(dashboard)/propostas/nova/components/EtapaResumo.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// LINHA 1 CORRIGIDA: Importa 'createClient'
import { createClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import { ProposalState, ProposalAction } from '../state';
import styles from '../styles/gerar-proposta.module.css';

interface EtapaResumoProps {
  state: ProposalState;
  dispatch: React.Dispatch<ProposalAction>;
}

export default function EtapaResumo({ state, dispatch }: EtapaResumoProps) {
  // LINHA 2 CORRIGIDA: Usa a função 'createClient'
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('dados');

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSaveProposal = async () => {
    if (!user) {
      alert("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }
    if (!state.clienteSelecionado || !state.clienteSelecionado.nome_fantasia_ou_nome) {
      alert("Nenhum cliente foi informado para a proposta.");
      return;
    }

    setIsSaving(true);

    const isClienteAvulso = state.clienteSelecionado.id === 0;
    const propostaPayload = {
      user_id: user.id,
      cliente_id: isClienteAvulso ? null : state.clienteSelecionado.id,
      nome_cliente_avulso: isClienteAvulso ? state.clienteSelecionado.nome_fantasia_ou_nome : null,
      status: 'Rascunho',
      valor_recorrente: state.valores.recorrente,
      valor_eventual: state.valores.eventual,
      condicoes_pagamento: state.condicoesPagamento,
      informacoes_complementares: state.informacoesComplementares,
      validade_dias: state.validadeDias,
    };

    const { data: propostaData, error: propostaError } = await supabase
      .from('propostas')
      .insert(propostaPayload)
      .select('id')
      .single();

    if (propostaError || !propostaData) {
      console.error('Erro ao salvar proposta:', propostaError);
      alert(`Falha ao salvar a proposta. Erro: ${propostaError?.message}`);
      setIsSaving(false);
      return;
    }

    const propostaId = propostaData.id;

    const itensParaSalvar = state.servicosSelecionados.map(servico => ({
      proposta_id: propostaId,
      user_id: user.id,
      servico_id: servico.id,
      nome_servico: servico.nome,
      descricao_servico: Array.isArray(servico.descricao) ? servico.descricao.join('\n') : servico.descricao,
      valor_servico: servico.valor,
      categoria_servico: servico.categoria,
    }));

    const { error: itensError } = await supabase.from('proposta_itens').insert(itensParaSalvar);

    if (itensError) {
      console.error('Erro ao salvar itens da proposta:', itensError);
      alert(`Falha ao salvar os serviços da proposta. Erro: ${itensError.message}`);
      setIsSaving(false);
      return;
    }

    alert('Proposta salva com sucesso!');
    dispatch({ type: 'RESETAR_ESTADO' });
    router.push('/dashboard/propostas');
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
              <p><strong>Cliente:</strong> {state.clienteSelecionado?.nome_fantasia_ou_nome || 'Não informado'}</p>
              {state.clienteSelecionado?.id !== 0 && (
                <p><strong>CNPJ/CPF:</strong> {state.clienteSelecionado?.cnpj_cpf || 'Não informado'}</p>
              )}
              <p><strong>Validade da Proposta:</strong> {state.validadeDias} dias</p>
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
                <div key={servico.id} className={styles['service-details-block']}>
                  <p><strong>{servico.nome} - {formatCurrency(servico.valor)}</strong> ({servico.categoria})</p>
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
        <button type="button" onClick={() => dispatch({ type: 'ETAPA_ANTERIOR' })} className={`${styles['btn-nav']} ${styles['btn-prev']}`} disabled={isSaving}>
          Anterior
        </button>
        <button type="button" onClick={handleSaveProposal} className={`${styles['btn-nav']} ${styles['btn-save']}`} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Proposta'}
        </button>
      </div>
    </div>
  );
}
