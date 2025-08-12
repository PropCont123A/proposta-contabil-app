// app/propostas/nova/components/TabsContainer.tsx
'use client';
import { useState } from 'react';
import styles from '../styles/gerar-proposta.module.css';

// Importe todos os componentes de aba
import DadosClienteTab from './DadosClienteTab';
import ServicosTab from './ServicosTab';
import CondicoesTab from './CondicoesTab';
import ResumoTab from './ResumoTab';

// 1. ATUALIZE A INTERFACE DE PROPS PARA INCLUIR O ID OPCIONAL
interface TabsContainerProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  formData: any;
  setFormData: (data: any) => void;
  supabase: any;
  propostaId?: string; // ID opcional para o modo de edição
}

export default function TabsContainer({
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  supabase,
  propostaId, // Recebe a prop aqui
}: TabsContainerProps) {
  const tabs = [
    { id: 0, label: 'Dados do cliente', component: DadosClienteTab },
    { id: 1, label: 'Serviços', component: ServicosTab },
    { id: 2, label: 'Condições de pagamento', component: CondicoesTab },
    { id: 3, label: 'Resumo da proposta', component: ResumoTab },
  ];

  const nextTab = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div className={styles['tabs-container']}>
      {/* Cabeçalho das Abas */}
      <div className={styles['tabs-header']}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles['tab-button']} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Abas */}
      <div className={styles['tab-content']}>
        {tabs.map((tab) => {
          const Component = tab.component;
          return (
            <div
              key={tab.id}
              className={`${styles['tab-panel']} ${activeTab === tab.id ? styles.active : ''}`}
            >
              {activeTab === tab.id && (
                <Component
                  formData={formData}
                  setFormData={setFormData}
                  supabase={supabase}
                  nextTab={nextTab}
                  prevTab={prevTab}
                  isFirst={activeTab === 0}
                  isLast={activeTab === tabs.length - 1}
                  // 2. PASSE O ID DA PROPOSTA PARA O COMPONENTE DA ABA ATIVA
                  // O ResumoTab vai receber isso, os outros componentes vão ignorar
                  propostaId={propostaId}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
