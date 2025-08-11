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
    <>
      {/* Cabeçalho Padrão da Página */}
      <header className="header">
        <h1>Gerar Nova Proposta</h1>
        <div className="user-info">
            <span>Bem-vindo, Emerson!</span>
            <div className="user-avatar">E</div>
        </div>
      </header>

      {/* Conteúdo Principal da Página */}
      <main className="content">
        {/*
          CORREÇÃO:
          Removemos o HTML duplicado das abas daqui.
          Agora, apenas o componente <TabsContainer /> é responsável
          por renderizar tanto o cabeçalho das abas quanto o seu conteúdo.
          Isso garante que ele apareça apenas uma vez.
        */}
        <TabsContainer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          setFormData={setFormData}
          supabase={supabase}
        />
      </main>
    </>
  );
}
