'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/client';
import { ProposalState, ProposalAction, Cliente } from '../state';
import styles from '../styles/gerar-proposta.module.css';
import { IMaskInput } from 'react-imask';
import DynamicInputList from './DynamicInputList';
import FormRow from './FormRow';
import ClientSelectionModal from './ClientSelectionModal'; // O modal de BUSCA

// CORREÇÃO FINAL E DEFINITIVA: Importa o arquivo da mesma pasta.
import ClientModal from './ClientModal'; 

export default function EtapaCliente({ state, dispatch }: { state: ProposalState, dispatch: React.Dispatch<ProposalAction> }) {
  const supabase = createClient();
  const [vendedores, setVendedores] = useState<{ id: string, full_name: string }[]>([]);
  
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  
  const handleUpdateField = (campo: keyof ProposalState, valor: any) => {
    dispatch({ type: 'ATUALIZAR_CAMPO_PROPOSTA', payload: { campo, valor } });
  };

  useEffect(() => {
    const fetchVendedores = async () => {
      const { data } = await supabase.from('profiles').select('id, full_name');
      if (data) setVendedores(data);
    };
    fetchVendedores();
  }, [supabase]);

  const handleSelectClient = (cliente: Cliente) => {
    dispatch({ type: 'VINCULAR_CLIENTE', payload: cliente });
    setIsSelectionModalOpen(false);
  };

  const handleOpenFormModal = () => {
    setIsSelectionModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleSaveClient = async (clienteData: Partial<Cliente>) => {
    console.log("Salvando cliente:", clienteData);
    // Lógica de salvar no Supabase aqui...
    setIsFormModalOpen(false);
    alert("Cliente salvo com sucesso! (simulação)");
  };

  return (
    <div className={styles['etapa-container']}>
      <FormRow>
        <div className={styles['form-group']}>
          <label htmlFor="tipoNegociacao">Tipo de negociação</label>
          <select id="tipoNegociacao" className={styles['form-control']} value={state.tipoNegociacao} onChange={(e) => handleUpdateField('tipoNegociacao', e.target.value)}>
            <option value="cliente_novo">Cliente novo</option>
            <option value="cliente_existente">Cliente existente</option>
            <option value="cliente_outra_contabilidade">Cliente de outra contabilidade</option>
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="statusNegociacao">Status da negociação</label>
          <select id="statusNegociacao" className={styles['form-control']} value={state.statusNegociacao} onChange={(e) => handleUpdateField('statusNegociacao', e.target.value)}>
            <option value="Rascunho">Rascunho</option>
            <option value="Em negociação">Em negociação</option>
            <option value="Contratado">Contratado</option>
            <option value="Desistente">Desistente</option>
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="vendedorResponsavel">Vendedor responsável</label>
          <select id="vendedorResponsavel" className={styles['form-control']} value={state.vendedorResponsavel} onChange={(e) => handleUpdateField('vendedorResponsavel', e.target.value)}>
            <option value="">Selecione</option>
            {vendedores.map(v => <option key={v.id} value={v.id}>{v.full_name}</option>)}
          </select>
        </div>
      </FormRow>
      
      <DynamicInputList label="Nome do cliente (pessoa de contato)" items={state.nomesCliente} onUpdate={(newItems) => handleUpdateField('nomesCliente', newItems)} onDesvincular={() => dispatch({ type: 'DESVINCULAR_CLIENTE' })} />
      <DynamicInputList label="Nome da empresa" items={state.nomesEmpresa} onUpdate={(newItems) => handleUpdateField('nomesEmpresa', newItems)} onDesvincular={() => dispatch({ type: 'DESVINCULAR_CLIENTE' })} />
      
      <button type="button" className={styles['btn-client-action']} onClick={() => setIsSelectionModalOpen(true)}>
        <i className="fas fa-search"></i> BUSCAR / CADASTRAR CLIENTE
      </button>

      <FormRow>
        <div className={styles['form-group']}>
          <label htmlFor="telefone">Telefone / WhatsApp</label>
          <IMaskInput id="telefone" mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} className={styles['form-control']} value={state.telefone} onAccept={(value: any) => handleUpdateField('telefone', value)} />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="dataProposta">Data da proposta</label>
          <input id="dataProposta" type="date" className={styles['form-control']} value={state.dataProposta} onChange={(e) => handleUpdateField('dataProposta', e.target.value)} />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="validadeDias">Validade da proposta (dias)</label>
          <input id="validadeDias" type="number" className={styles['form-control']} value={state.validadeDias} onChange={(e) => handleUpdateField('validadeDias', Number(e.target.value))} />
        </div>
      </FormRow>

      <div className={styles['form-navigation']}>
        <button type="button" onClick={() => dispatch({ type: 'IR_PARA_ETAPA', payload: 2 })} className={`${styles['btn-nav']} ${styles['btn-next']}`}>
          Próximo
        </button>
      </div>

      <ClientSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        onSelectClient={handleSelectClient}
        onAddNewClient={handleOpenFormModal}
      />
      
      <ClientModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={null}
      />
    </div>
  );
}
