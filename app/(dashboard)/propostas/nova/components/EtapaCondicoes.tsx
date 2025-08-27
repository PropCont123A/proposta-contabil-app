// app/(dashboard)/propostas/nova/components/EtapaCondicoes.tsx
'use client';

import { ProposalState, ProposalAction } from '../state'; // Importando nossos tipos
import styles from '../styles/gerar-proposta.module.css';

interface EtapaCondicoesProps {
  state: ProposalState;
  dispatch: React.Dispatch<ProposalAction>;
}

export default function EtapaCondicoes({ state, dispatch }: EtapaCondicoesProps) {
  // Função para formatar valores como moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Os valores agora vêm diretamente do nosso estado centralizado
  const { recorrente, eventual } = state.valores;
  const servicosRecorrentes = state.servicosSelecionados.filter(s => s.categoria === 'Recorrente');
  const servicosEventuais = state.servicosSelecionados.filter(s => s.categoria === 'Eventual');

  return (
    // Usamos um <form> para agrupar, mas o submit é controlado pelos botões de navegação
    <form onSubmit={(e) => e.preventDefault()}>
      <div className={styles['summary-container']}>
        {/* Seção de Serviços Recorrentes */}
        <div className={styles['summary-section']}>
          <h3 className={styles['summary-title']}>Serviços Recorrentes</h3>
          {servicosRecorrentes.length > 0 ? (
            servicosRecorrentes.map((s) => (
              <p key={s.id} className={styles['summary-item']}>{s.nome} - {formatCurrency(s.valor)}</p>
            ))
          ) : (
            <p className={styles['summary-item-empty']}>Nenhum serviço recorrente selecionado.</p>
          )}
          <p className={styles['summary-total']}>Valor total dos Serviços Recorrentes: {formatCurrency(recorrente)}</p>
        </div>

        {/* Seção de Serviços Eventuais */}
        <div className={styles['summary-section']}>
          <h3 className={styles['summary-title']}>Serviços Eventuais</h3>
          {servicosEventuais.length > 0 ? (
            servicosEventuais.map((s) => (
              <p key={s.id} className={styles['summary-item']}>{s.nome} - {formatCurrency(s.valor)}</p>
            ))
          ) : (
            <p className={styles['summary-item-empty']}>Nenhum serviço eventual selecionado.</p>
          )}
          <p className={styles['summary-total']}>Valor total dos Serviços Eventuais: {formatCurrency(eventual)}</p>
        </div>
      </div>

      {/* Campos de Texto */}
      <div className={styles['text-fields-container']}>
        <div className={styles['form-group']}>
          <label htmlFor="textoCondicoes">Condições de Pagamento</label>
          <textarea
            id="textoCondicoes"
            className={styles['form-control']}
            rows={5}
            placeholder="Descreva as condições de pagamento, prazos, formas de pagamento aceitas, etc."
            // O valor vem do estado e a mudança dispara uma ação
            value={state.condicoesPagamento}
            onChange={(e) => dispatch({ type: 'ATUALIZAR_CONDICOES', payload: e.target.value })}
          ></textarea>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="textoComplementares">Informações Complementares</label>
          <textarea
            id="textoComplementares"
            className={styles['form-control']}
            rows={5}
            placeholder="Informações adicionais, observações, termos especiais, etc."
            // O valor vem do estado e a mudança dispara uma ação
            value={state.informacoesComplementares}
            onChange={(e) => dispatch({ type: 'ATUALIZAR_INFORMACOES', payload: e.target.value })}
          ></textarea>
        </div>
      </div>

      {/* Navegação */}
      <div className={`${styles['form-navigation']} ${styles['space-between']}`}>
        <button type="button" onClick={() => dispatch({ type: 'ETAPA_ANTERIOR' })} className={`${styles['btn-nav']} ${styles['btn-prev']}`}>
          Anterior
        </button>
        <button type="button" onClick={() => dispatch({ type: 'PROXIMA_ETAPA' })} className={`${styles['btn-nav']} ${styles['btn-next']}`}>
          Próximo
        </button>
      </div>
    </form>
  );
}
