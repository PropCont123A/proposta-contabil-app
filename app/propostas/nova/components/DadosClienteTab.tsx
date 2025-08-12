// app/propostas/nova/components/DadosClienteTab.tsx
'use client';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Importe o Controller
import styles from '../styles/gerar-proposta.module.css';
import { IMaskInput } from 'react-imask'; // Importe o IMaskInput da nova biblioteca

interface DadosClienteTabProps {
  formData: any;
  setFormData: (data: any) => void;
  supabase: any;
  nextTab: () => void;
}

export default function DadosClienteTab({ formData, setFormData, nextTab, supabase }: DadosClienteTabProps) {
  const { register, handleSubmit, watch, control } = useForm({ // Adicione 'control'
    defaultValues: formData.dadosCliente || {},
  });

  const formValues = watch();

  useEffect(() => {
    const handler = setTimeout(() => {
      setFormData({
        ...formData,
        dadosCliente: formValues,
      });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [formValues, setFormData, formData]);

  const onSubmit = () => {
    nextTab();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['form-container']}>
      <div className={styles['form-grid']}>
        {/* Tipo de negociação */}
        <div className={styles['form-group']}>
          <label>Tipo de negociação</label>
          <select {...register('tipoNegociacao')} className={styles['form-control']}>
            <option value="">Selecione</option>
            <option value="cliente-novo">Cliente novo</option>
            <option value="cliente-existente">Cliente existente</option>
            <option value="cliente-outra-contabilidade">Cliente de outra contabilidade</option>
          </select>
        </div>

        {/* Status da negociação */}
        <div className={styles['form-group']}>
          <label>Status da negociação</label>
          <select {...register('statusNegociacao')} className={styles['form-control']}>
            <option value="">Selecione</option>
            <option value="Em negociação">Em negociação</option>
            <option value="Contratado">Contratado</option>
            <option value="Desistente">Desistente</option>
          </select>
        </div>

        {/* Vendedor responsável */}
        <div className={styles['form-group']}>
          <label>Vendedor responsável</label>
          <select {...register('vendedorResponsavel')} className={styles['form-control']}>
            <option value="">Selecione</option>
            <option value="emerson">Emerson Silva</option>
            <option value="maria">Maria Santos</option>
            <option value="joao">João Oliveira</option>
          </select>
        </div>
      </div>

      {/* Clientes e Empresas */}
      <div className={styles['form-group']}>
        <label>Nome do cliente (pessoa de contato)</label>
        <input
          type="text"
          {...register('clientes')}
          className={styles['form-control']}
          placeholder="Digite o nome do cliente"
        />
      </div>

      <div className={styles['form-group']}>
        <div className={styles['label-with-button']}>
          <label>Nome da empresa</label>
          <button type="button" className={styles['btn-special']}>
            <i className="fas fa-users"></i> CADASTRO DE CLIENTES
          </button>
        </div>
        <input
          type="text"
          {...register('empresas')}
          className={styles['form-control']}
          placeholder="Digite o nome da empresa"
        />
      </div>

      {/* Outros campos */}
      <div className={styles['form-grid']}>
        <div className={styles['form-group']}>
          <label>Telefone / WhatsApp</label>
          {/* ================================================================== */}
          {/*  A MUDANÇA PARA USAR react-imask */}
          {/* ================================================================== */}
          <Controller
            name="telefone"
            control={control}
            render={({ field }) => (
              <IMaskInput
                {...field}
                mask="(00) 00000-0000"
                placeholder="(00) 00000-0000"
                className={styles['form-control']}
                onAccept={(value: any) => field.onChange(value)}
              />
            )}
          />
          {/* ================================================================== */}
        </div>
        <div className={styles['form-group']}>
          <label>Data da Proposta</label>
          <input
            type="date"
            {...register('dataProposta')}
            className={styles['form-control']}
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className={styles['form-group']}>
          <label>Validade da proposta (dias)</label>
          <input
            type="number"
            {...register('validadeProposta')}
            className={styles['form-control']}
            placeholder="30"
            min="1"
            max="365"
            defaultValue="30"
          />
        </div>
      </div>

      {/* Navegação */}
      <div className={styles['form-navigation']}>
        <button type="submit" className={`${styles['btn-nav']} ${styles['btn-next']}`}>
          Próximo
        </button>
      </div>
    </form>
  );
}
