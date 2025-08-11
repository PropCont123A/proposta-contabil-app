'use client';
import { useForm } from 'react-hook-form';
import styles from '../styles/gerar-proposta.module.css';

// Interface para os serviços que vêm da aba anterior
interface ServicoNaProposta {
  nome: string;
  valor: number;
  categoria: string; // Usaremos 'recorrente' ou 'eventual' aqui
}

interface CondicoesTabProps {
  formData: any;
  setFormData: (data: any) => void;
  nextTab: () => void;
  prevTab: () => void;
}

export default function CondicoesTab({ formData, setFormData, nextTab, prevTab }: CondicoesTabProps) {
  // Inicializa o formulário com os dados já existentes ou valores padrão
  const { register, handleSubmit } = useForm({
    defaultValues: formData.condicoes || {
      textoCondicoes: '',
      textoComplementares: '',
    },
  });

  // Filtra e calcula os totais dos serviços selecionados
  const servicosRecorrentes = formData.servicos?.filter((s: ServicoNaProposta) => s.categoria.toLowerCase() === 'recorrente') || [];
  const servicosEventuais = formData.servicos?.filter((s: ServicoNaProposta) => s.categoria.toLowerCase() === 'eventual') || [];

  const totalRecorrente = servicosRecorrentes.reduce((acc: number, s: ServicoNaProposta) => acc + s.valor, 0);
  const totalEventual = servicosEventuais.reduce((acc: number, s: ServicoNaProposta) => acc + s.valor, 0);

  // Função para formatar valores como moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Salva os dados no estado principal e avança para a próxima aba
  const onSubmit = (data: any) => {
    setFormData({
      ...formData,
      condicoes: data,
      // Salva também os totais calculados para uso futuro
      resumo: {
        ...formData.resumo,
        totalRecorrente,
        totalEventual,
      }
    });
    nextTab();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['summary-container']}>
        {/* Seção de Serviços Recorrentes */}
        <div className={styles['summary-section']}>
          <h3 className={styles['summary-title']}>Serviços Recorrentes</h3>
          {servicosRecorrentes.length > 0 ? (
            servicosRecorrentes.map((s: ServicoNaProposta, index: number) => (
              <p key={index} className={styles['summary-item']}>{s.nome} - {formatCurrency(s.valor)}</p>
            ))
          ) : (
            <p className={styles['summary-item-empty']}>Nenhum serviço recorrente selecionado.</p>
          )}
          <p className={styles['summary-total']}>Valor total dos Serviços Recorrentes: {formatCurrency(totalRecorrente)}</p>
        </div>

        {/* Seção de Serviços Eventuais */}
        <div className={styles['summary-section']}>
          <h3 className={styles['summary-title']}>Serviços Eventuais</h3>
          {servicosEventuais.length > 0 ? (
            servicosEventuais.map((s: ServicoNaProposta, index: number) => (
              <p key={index} className={styles['summary-item']}>{s.nome} - {formatCurrency(s.valor)}</p>
            ))
          ) : (
            <p className={styles['summary-item-empty']}>Nenhum serviço eventual selecionado.</p>
          )}
          <p className={styles['summary-total']}>Valor total dos Serviços Eventuais: {formatCurrency(totalEventual)}</p>
        </div>
      </div>

      {/* Campos de Texto */}
      <div className={styles['text-fields-container']}>
        <div className={styles['form-group']}>
          <label htmlFor="textoCondicoes">Condições de Pagamento</label>
          <textarea
            id="textoCondicoes"
            {...register('textoCondicoes')}
            className={styles['form-control']}
            rows={5}
            placeholder="Descreva as condições de pagamento, prazos, formas de pagamento aceitas, etc."
          ></textarea>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="textoComplementares">Informações Complementares</label>
          <textarea
            id="textoComplementares"
            {...register('textoComplementares')}
            className={styles['form-control']}
            rows={5}
            placeholder="Informações adicionais, observações, termos especiais, etc."
          ></textarea>
        </div>
      </div>

      {/* Navegação */}
      <div className={`${styles['form-navigation']} ${styles['space-between']}`}>
        <button type="button" onClick={prevTab} className={`${styles['btn-nav']} ${styles['btn-prev']}`}>
          Anterior
        </button>
        <button type="submit" className={`${styles['btn-nav']} ${styles['btn-next']}`}>
          Próximo
        </button>
      </div>
    </form>
  );
}
