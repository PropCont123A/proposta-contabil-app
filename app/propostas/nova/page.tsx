'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import TabsContainer from './components/TabsContainer';
import styles from './styles/gerar-proposta.module.css';

export default function GerarNovaProposta() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    dadosCliente: {},
    servicos: [],
    condicoes: {},
    resumo: {},
  });
  const supabase = createClientComponentClient();

  return (
    // CORREÇÃO: Usando a sintaxe de colchetes para nomes de classe com hífen
    <div className={styles['gerar-proposta-container']}>
      <header className={styles.header}>
        <h1>Gerar Nova Proposta</h1>
      </header>

      <main className={styles.content}>
        <TabsContainer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          setFormData={setFormData}
          supabase={supabase}
        />
      </main>
    </div>
  );
}
