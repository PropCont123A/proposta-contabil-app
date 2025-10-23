'use client';

import { ProposalState, ProposalAction } from '../state';
import styles from '../styles/gerar-proposta.module.css';

interface EtapaCondicoesProps {
  state: ProposalState;
  dispatch: React.Dispatch<ProposalAction>;
}

export default function EtapaCondicoes({ state, dispatch }: EtapaCondicoesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const { recorrente, eventual } = state.valores;
  const servicosRecorrentes = state.servicosSelecionados.filter(s => s.categoria === 'Recorrente');
  const servicosEventuais = state.servicosSelecionados.filter(s => s.categoria === 'Eventual');

  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles['form-container']}>
      <div className={styles['summary-container']}>
        {servicosRecorrentes.length > 0 && (
          <div className={styles['summary-section']}>
            <h3 className={styles['summary-title']}>Serviços Recorrentes</h3>
            {servicosRecorrentes.map((s) => (
              <div key={s.idUnico} className={styles['summary-item']}>
                {/* CORREÇÃO 1: Adicionado hífen e espaços */}
                <span>{s.nome} - {formatCurrency(s.valor)}</span>
              </div>
            ))}
            <p className={styles['summary-total']}>
              {/* CORREÇÃO 2: Adicionado espaço após os dois pontos */}
              <strong>Valor total dos Serviços Recorrentes: </strong>
              <strong>{formatCurrency(recorrente)}</strong>
            </p>
          </div>
        )}

        {servicosEventuais.length > 0 && (
          <div className={styles['summary-section']}>
            <h3 className={styles['summary-title']}>Serviços Eventuais</h3>
            {servicosEventuais.map((s) => (
              <div key={s.idUnico} className={styles['summary-item']}>
                {/* CORREÇÃO 1: Adicionado hífen e espaços */}
                <span>{s.nome} - {formatCurrency(s.valor)}</span>
              </div>
            ))}
            <p className={styles['summary-total']}>
              {/* CORREÇÃO 2: Adicionado espaço após os dois pontos */}
              <strong>Valor total dos Serviços Eventuais: </strong>
              <strong>{formatCurrency(eventual)}</strong>
            </p>
          </div>
        )}
      </div>

      <div className={styles['text-fields-container']}>
        <div className={styles['form-group']}>
          <label htmlFor="textoCondicoes">Condições de Pagamento</label>
          <textarea
            id="textoCondicoes"
            className={styles['form-control']}
            rows={5}
            placeholder="Descreva as condições de pagamento, prazos, formas de pagamento aceitas, etc."
            value={state.condicoesPagamento}
            onChange={(e) => dispatch({ type: 'ATUALIZAR_CAMPO_PROPOSTA', payload: { campo: 'condicoesPagamento', valor: e.target.value } })}
          ></textarea>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="textoComplementares">Informações Complementares</label>
          <textarea
            id="textoComplementares"
            className={styles['form-control']}
            rows={5}
            placeholder="Informações adicionais, observações, termos especiais, etc."
            value={state.informacoesComplementares}
            onChange={(e) => dispatch({ type: 'ATUALIZAR_CAMPO_PROPOSTA', payload: { campo: 'informacoesComplementares', valor: e.target.value } })}
          ></textarea>
        </div>
      </div>

      <div className={`${styles['form-navigation']} ${styles['space-between']}`}>
        <button
          type="button"
          onClick={() => dispatch({ type: 'IR_PARA_ETAPA', payload: 2 })}
          className={`${styles['btn-nav']} ${styles['btn-prev']}`}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'IR_PARA_ETAPA', payload: 4 })}
          className={`${styles['btn-nav']} ${styles['btn-next']}`}
        >
          Próximo
        </button>
      </div>
    </form>
  );
}
