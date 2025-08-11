'use client';
import { useState } from 'react';
import styles from '../styles/gerar-proposta.module.css';

// Interfaces para garantir que os dados do formData sejam lidos corretamente
interface Servico {
  nome: string;
  valor: number;
  descricoes: { texto: string }[];
}

// 1. ATUALIZAÇÃO DA INTERFACE DE PROPS
interface ResumoTabProps {
  formData: any;
  setFormData: (data: any) => void;
  supabase: any;
  prevTab: () => void;
  propostaId?: string; // ID opcional para o modo de edição
}

// 2. ATUALIZAÇÃO DA ASSINATURA DA FUNÇÃO
export default function ResumoTab({ formData, setFormData, supabase, prevTab, propostaId }: ResumoTabProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>('dados');

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const { dadosCliente, servicos, condicoes, resumo } = formData;

  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // 3. ATUALIZAÇÃO DA LÓGICA DE SALVAMENTO
  const handleSaveProposal = async () => {
    alert('Salvando proposta, por favor aguarde...');

    const propostaParaSalvar = {
      tipo_negociacao: dadosCliente?.tipoNegociacao,
      status_negociacao: dadosCliente?.statusNegociacao,
      vendedor_responsavel: dadosCliente?.vendedorResponsavel,
      clientes_contato: dadosCliente?.clientes,
      empresas: dadosCliente?.empresas,
      telefone: dadosCliente?.telefone,
      data_proposta: dadosCliente?.dataProposta,
      validade_dias: parseInt(dadosCliente?.validadeProposta, 10) || 30,
      servicos_detalhes: servicos,
      condicoes_pagamento: condicoes?.textoCondicoes,
      informacoes_complementares: condicoes?.textoComplementares,
      valor_total_recorrente: resumo?.totalRecorrente,
      valor_total_eventual: resumo?.totalEventual,
      status: dadosCliente?.statusNegociacao || 'Em negociação'
    };

    if (propostaId) {
      // MODO UPDATE: Se um ID de proposta foi passado, atualizamos a existente.
      const { data, error } = await supabase
        .from('propostas')
        .update(propostaParaSalvar)
        .eq('id', propostaId) // A condição WHERE para saber qual proposta atualizar
        .select();

      if (error) {
        console.error('Erro ao atualizar proposta:', error);
        alert(`Falha ao atualizar a proposta. Erro: ${error.message}`);
      } else {
        console.log('Proposta atualizada com sucesso:', data);
        alert('Proposta atualizada com sucesso!');
        // Redireciona para a lista de propostas após a edição
        window.location.href = '/propostas';
      }
    } else {
      // MODO INSERT: Se não há ID, criamos uma nova proposta.
      const { data, error } = await supabase
        .from('propostas')
        .insert([propostaParaSalvar])
        .select();

      if (error) {
        console.error('Erro ao salvar nova proposta:', error);
        alert(`Falha ao salvar a proposta. Erro: ${error.message}`);
      } else {
        console.log('Proposta salva com sucesso:', data);
        alert('Proposta salva com sucesso!');
        // Redireciona para a lista de propostas após a criação
        window.location.href = '/propostas';
      }
    }
  };

  return (
    <div>
      <h2 className={styles['review-main-title']}>Resumo da Proposta</h2>

      {/* --- ACORDEÃO --- */}
      <div className={styles['accordion-container']}>
        {/* Seção Dados do Cliente */}
        <div className={styles['accordion-item']}>
          <button type="button" className={styles['accordion-header']} onClick={() => toggleAccordion('dados')}>
            Dados do Cliente
            <span className={`${styles['accordion-icon']} ${openAccordion === 'dados' ? styles.open : ''}`}>^</span>
          </button>
          {openAccordion === 'dados' && (
            <div className={styles['accordion-content']}>
              <p><strong>Vendedor:</strong> {dadosCliente?.vendedorResponsavel || 'Não informado'}</p>
              <p><strong>Cliente:</strong> {dadosCliente?.clientes?.join(', ') || 'Não informado'}</p>
              <p><strong>Empresa:</strong> {dadosCliente?.empresas?.join(', ') || 'Não informado'}</p>
              <p><strong>Telefone:</strong> {dadosCliente?.telefone || 'Não informado'}</p>
              <p><strong>Data da proposta:</strong> {dadosCliente?.dataProposta ? new Date(dadosCliente.dataProposta).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não informado'}</p>
              <p><strong>Validade:</strong> {dadosCliente?.validadeProposta ? `${dadosCliente.validadeProposta} dias` : 'Não informado'}</p>
            </div>
          )}
        </div>

        {/* Seção Serviços */}
        <div className={styles['accordion-item']}>
          <button type="button" className={styles['accordion-header']} onClick={() => toggleAccordion('servicos')}>
            Serviços
            <span className={`${styles['accordion-icon']} ${openAccordion === 'servicos' ? styles.open : ''}`}>^</span>
          </button>
          {openAccordion === 'servicos' && (
            <div className={styles['accordion-content']}>
              {servicos?.map((servico: Servico, index: number) => (
                <div key={index} className={styles['service-details-block']}>
                  <p><strong>{servico.nome} - {formatCurrency(servico.valor)}</strong></p>
                  <ul>
                    {servico.descricoes.map((desc, i) => (
                      <li key={i}>{desc.texto}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção Condições de Pagamento */}
        <div className={styles['accordion-item']}>
          <button type="button" className={styles['accordion-header']} onClick={() => toggleAccordion('condicoes')}>
            Condições de Pagamento
            <span className={`${styles['accordion-icon']} ${openAccordion === 'condicoes' ? styles.open : ''}`}>^</span>
          </button>
          {openAccordion === 'condicoes' && (
            <div className={styles['accordion-content']}>
              <p><strong>Serviços Recorrentes:</strong> {formatCurrency(resumo?.totalRecorrente)}</p>
              <p><strong>Serviços Eventuais:</strong> {formatCurrency(resumo?.totalEventual)}</p>
                

              <p><strong>Condições de Pagamento:</strong> {condicoes?.textoCondicoes || 'N/A'}</p>
              <p><strong>Informações Complementares:</strong> {condicoes?.textoComplementares || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>

      {/* --- BARRA DE AÇÕES INFERIOR --- */}
      <div className={styles['actions-bar']}>
        <button type="button" className={styles['action-btn-pdf']}><i className="fas fa-file-pdf"></i> Gerar PDF</button>
        <button type="button" className={styles['action-btn-link']}><i className="fas fa-link"></i> Gerar Link</button>
        <button type="button" className={styles['action-btn-whatsapp']}><i className="fab fa-whatsapp"></i> Compartilhar via WhatsApp</button>
        <button type="button" className={styles['action-btn-email']}><i className="fas fa-envelope"></i> Enviar por E-mail</button>
      </div>

      {/* --- NAVEGAÇÃO FINAL --- */}
      <div className={`${styles['form-navigation']} ${styles['space-between']}`}>
        <button type="button" onClick={prevTab} className={`${styles['btn-nav']} ${styles['btn-prev']}`}>
          Anterior
        </button>
        <button type="button" onClick={handleSaveProposal} className={`${styles['btn-nav']} ${styles['btn-save']}`}>
          {/* O texto do botão muda se estivermos em modo de edição */}
          {propostaId ? 'Atualizar Proposta' : 'Salvar Proposta'}
        </button>
      </div>
    </div>
  );
}
