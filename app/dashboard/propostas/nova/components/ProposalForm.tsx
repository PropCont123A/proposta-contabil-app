// Caminho: app/dashboard/propostas/nova/components/ProposalForm.tsx
// VERSÃO COMPLETA E CORRIGIDA

'use client';

import React from 'react';
import { ProposalState, ProposalAction } from '../state';
import EtapaCliente from './EtapaCliente';
import EtapaServicos from './EtapaServicos';
import EtapaCondicoes from './EtapaCondicoes';
import EtapaResumo from './EtapaResumo';
import styles from '../styles/gerar-proposta.module.css';

// ✅ CORREÇÃO 1: Adiciona a prop 'profile' à interface
interface ProposalFormProps {
  state: ProposalState;
  dispatch: React.Dispatch<ProposalAction>;
  onSave?: (state: ProposalState) => void;
  isEditing?: boolean;
  profile: any; // Recebe o perfil do usuário logado
}

// ✅ CORREÇÃO 2: O componente agora aceita 'profile' como prop
export default function ProposalForm({ state, dispatch, onSave, isEditing, profile }: ProposalFormProps) {
  const renderEtapa = () => {
    switch (state.etapa) {
      // ✅ CORREÇÃO 3: A prop 'profile' é passada para o componente EtapaCliente
      case 1: return <EtapaCliente state={state} dispatch={dispatch} profile={profile} />;
      case 2: return <EtapaServicos state={state} dispatch={dispatch} />;
      case 3: return <EtapaCondicoes state={state} dispatch={dispatch} />;
      case 4: return <EtapaResumo state={state} dispatch={dispatch} onSave={onSave} isEditing={isEditing} />;
      // O default também precisa passar a prop para consistência
      default: return <EtapaCliente state={state} dispatch={dispatch} profile={profile} />;
    }
  };

  const etapas = ['Dados do cliente', 'Serviços', 'Condições de pagamento', 'Resumo da proposta'];
  const handleTabClick = (etapaIndex: number) => dispatch({ type: 'IR_PARA_ETAPA', payload: etapaIndex + 1 });

  return (
    <div className={styles['form-wizard-container']}>
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
      <div className={styles['tab-content']}>
        {renderEtapa()}
      </div>
    </div>
  );
}
