'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputMask } from '@react-input/mask';
import styles from '../styles/gerar-proposta.module.css';

interface DadosClienteTabProps {
  formData: any;
  setFormData: (data: any) => void;
  supabase: any;
  nextTab: () => void;
}

export default function DadosClienteTab({ formData, setFormData, supabase, nextTab }: DadosClienteTabProps) {
  const [clientesSelecionados, setClientesSelecionados] = useState(['']);
  const [empresas, setEmpresas] = useState(['']);
  const { register, handleSubmit } = useForm({ defaultValues: formData.dadosCliente || {} });

  const addCliente = () => setClientesSelecionados([...clientesSelecionados, '']);
  const removeCliente = (index: number) => setClientesSelecionados(clientesSelecionados.filter((_, i) => i !== index));
  const addEmpresa = () => setEmpresas([...empresas, '']);
  const removeEmpresa = (index: number) => setEmpresas(empresas.filter((_, i) => i !== index));

  const onSubmit = (data: any) => {
    setFormData({
      ...formData,
      dadosCliente: {
        ...data,
        clientes: clientesSelecionados.filter((c) => c.trim()),
        empresas: empresas.filter((e) => e.trim()),
      },
    });
    nextTab();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['form-row']}>
        <div className={styles['form-group']}>
          <label>Tipo de negociação</label>
          <select {...register('tipoNegociacao')} className={styles['form-control']}>
            <option value="">Selecione</option>
            <option value="cliente-novo">Cliente novo</option>
            <option value="cliente-existente">Cliente existente</option>
          </select>
        </div>
        <div className={styles['form-group']}>
          <label>Status da negociação</label>
          <select {...register('statusNegociacao')} className={styles['form-control']}>
            <option value="">Selecione</option>
            <option value="em-negociacao">Em negociação</option>
            <option value="contratado">Contratado</option>
          </select>
        </div>
        <div className={styles['form-group']}>
          <label>Vendedor responsável</label>
          <select {...register('vendedorResponsavel')} className={styles['form-control']}>
            <option value="">Selecione</option>
            <option value="emerson">Emerson Silva</option>
          </select>
        </div>
      </div>

      <div className={styles['form-group']} style={{ marginBottom: '25px' }}>
        <label>Nome do cliente (pessoa de contato)</label>
        <div className={styles['dynamic-fields-container']}>
          {clientesSelecionados.map((cliente, index) => (
            <div key={index} className={styles['dynamic-field']}>
              <input
                type="text"
                className={styles['form-control']}
                placeholder="Adicionar novo cliente"
                value={cliente}
                onChange={(e) => {
                  const newClientes = [...clientesSelecionados];
                  newClientes[index] = e.target.value;
                  setClientesSelecionados(newClientes);
                }}
              />
              {index === clientesSelecionados.length - 1 ? (
                <button type="button" className={styles['btn-add-dynamic']} onClick={addCliente}>+</button>
              ) : (
                <button type="button" className={`${styles['btn-remove-dynamic']} ${styles['btn-danger']}`} onClick={() => removeCliente(index)}>x</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles['form-group']} style={{ marginBottom: '25px' }}>
        {/* APLICAÇÃO DA CLASSE CORRETA */}
        <label className={styles['label-with-button']}>
          <span>Nome da empresa</span>
          <button type="button" className={styles['btn-special']} onClick={() => window.open('/clientes', '_blank')}>
            CADASTRO DE CLIENTES
          </button>
        </label>
        <div className={styles['dynamic-fields-container']}>
          {empresas.map((empresa, index) => (
            <div key={index} className={styles['dynamic-field']}>
              <input
                type="text"
                className={styles['form-control']}
                placeholder="Adicionar nova empresa"
                value={empresa}
                onChange={(e) => {
                  const newEmpresas = [...empresas];
                  newEmpresas[index] = e.target.value;
                  setEmpresas(newEmpresas);
                }}
              />
              {index === empresas.length - 1 ? (
                <button type="button" className={styles['btn-add-dynamic']} onClick={addEmpresa}>+</button>
              ) : (
                <button type="button" className={`${styles['btn-remove-dynamic']} ${styles['btn-danger']}`} onClick={() => removeEmpresa(index)}>x</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles['form-row']}>
        <div className={styles['form-group']}>
          <label>Telefone / WhatsApp</label>
          <InputMask {...register('telefone')} component="input" mask="(__) _____-____" replacement={{ _: /\d/ }} className={styles['form-control']} placeholder="(00) 00000-0000" />
        </div>
        <div className={styles['form-group']}>
          <label>Data da Proposta</label>
          <input type="date" {...register('dataProposta')} className={styles['form-control']} defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <div className={styles['form-group']}>
          <label>Validade da proposta (dias)</label>
          <input type="number" {...register('validadeProposta')} className={styles['form-control']} placeholder="30" min="1" max="365" defaultValue="30" />
        </div>
      </div>

      <div className={styles['form-navigation']}>
        <button type="submit" className={`${styles['btn-nav']} ${styles['btn-next']}`}>
          Próximo
        </button>
      </div>
    </form>
  );
}
