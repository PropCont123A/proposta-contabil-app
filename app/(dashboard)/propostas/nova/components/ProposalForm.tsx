// app/(dashboard)/propostas/nova/components/ProposalForm.tsx
'use client';

import React from 'react';
import { ProposalState, ProposalAction } from '../state';
import EtapaCliente from './EtapaCliente';
import EtapaServicos from './EtapaServicos';
import EtapaCondicoes from './EtapaCondicoes';
import EtapaResumo from './EtapaResumo';
import styles from '../styles/gerar-proposta.module.css';

interface ProposalFormProps {
  state: ProposalState;
  dispatch: React.Dispatch<ProposalAction>;
}

export default function ProposalForm({ state, dispatch }: ProposalFormProps) {
  const renderEtapa = () => {
    switch (state.etapa) {
      case 1: return <EtapaCliente state={state} dispatch={dispatch} />;
      case 2: return <EtapaServicos state={state} dispatch={dispatch} />;
      case 3: return <EtapaCondicoes state={state} dispatch={dispatch} />;
      case 4: return <EtapaResumo state={state} dispatch={dispatch} />;
      default: return <EtapaCliente state={state} dispatch={dispatch} />;
    }
  };

  const etapas = [
    'Dados do cliente',
    'Serviços', 
    'Condições de pagamento',
    'Resumo da proposta'
  ];

  const handleTabClick = (etapaIndex: number) => {
    dispatch({ type: 'IR_PARA_ETAPA', payload: etapaIndex + 1 });
  };

  return (
    <div className={styles['form-wizard-container']}>
      {/* Header com as abas clicáveis */}
      <div className={styles['tabs-header']}>
        {etapas.map((nome, index) => (
          <button
            key={index}
            className={`${styles['tab-button']} ${state.etapa === index + 1 ? styles.active : ''}`}
            onClick={() => handleTabClick(index)}
            type="button"
          >
            {nome}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div className={styles['tab-content']}>
        {renderEtapa()}
      </div>
    </div>
  );
}

