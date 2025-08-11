'use client';
import { useState } from 'react';
import DadosClienteTab from './DadosClienteTab';
import ServicosTab from './ServicosTab';
import CondicoesTab from './CondicoesTab';
import ResumoTab from './ResumoTab';

// Importando os estilos como um módulo
import styles from '../styles/gerar-proposta.module.css';

// Interface de propriedades
interface TabsContainerProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  formData: any;
  setFormData: (data: any) => void;
  supabase: any;
}

export default function TabsContainer({
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  supabase,
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
    // CORREÇÃO: Usando a sintaxe de colchetes para as classes
    <div className={styles['tabs-container']}>
      <div className={styles['tabs-header']}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            // A lógica para a classe 'active' também usa a sintaxe de colchetes
            className={`${styles['tab-button']} ${
              activeTab === tab.id ? styles.active : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles['tab-content']}>
        {tabs.map((tab) => {
          const Component = tab.component;
          return (
            <div
              key={tab.id}
              className={`${styles['tab-panel']} ${
                activeTab === tab.id ? styles.active : ''
              }`}
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
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
