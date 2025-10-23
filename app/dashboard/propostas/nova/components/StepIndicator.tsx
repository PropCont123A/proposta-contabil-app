// app/(dashboard)/propostas/nova/components/StepIndicator.tsx
'use client';

import { ProposalAction, ProposalState } from '../state'; // Importamos os tipos
import styles from '../styles/gerar-proposta.module.css';

interface StepIndicatorProps {
  state: ProposalState; // Recebe o estado completo
  dispatch: React.Dispatch<ProposalAction>; // Recebe a função dispatch
  state: ProposalState;
}

const ETAPAS = [
  { id: 1, label: 'Dados do cliente' },
  { id: 2, label: 'Serviços' },
  { id: 3, label: 'Condições de pagamento' },
  { id: 4, label: 'Resumo da proposta' },
];

export default function StepIndicator({ etapaAtual, dispatch, state }: StepIndicatorProps) {
  // Determina a etapa máxima que o usuário pode acessar
  const etapaMaximaAlcancada = () => {
    if (!state.clienteSelecionado?.nome_fantasia_ou_nome) return 1;
    if (state.servicosSelecionados.length === 0) return 2;
    // Adicione mais validações se necessário
    return 4; // Se tudo estiver ok, pode navegar para todas
  };

  const maxStep = etapaMaximaAlcancada();

  const handleStepClick = (etapaId: number) => {
    // Permite o clique apenas se a etapa de destino for menor ou igual à máxima permitida
    if (etapaId <= maxStep) {
      dispatch({ type: 'IR_PARA_ETAPA', payload: etapaId });
    } else {
      alert('Por favor, complete a etapa atual antes de avançar.');
    }
  };

  return (
    <div className={styles['tabs-header']}>
      {ETAPAS.map((etapa) => {
        const isClickable = etapa.id <= maxStep;
        return (
          <button
            key={etapa.id}
            className={`
              ${styles['tab-button']} 
              ${state.etapa === etapa.id ? styles.active : ''}
              ${isClickable ? '' : styles.disabled}
            `}
            onClick={() => handleStepClick(etapa.id)}
            disabled={!isClickable && state.etapa < etapa.id}
          >
            {etapa.label}
          </button>
        );
      })}
    </div>
  );
}
