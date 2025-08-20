// app/propostas/nova/page.tsx
'use client';
import { useState } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // 1. LINHA ANTIGA REMOVIDA
import { createBrowserClient } from '@supabase/ssr'; // 1. LINHA NOVA ADICIONADA
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
  
  // 2. INICIALIZAÇÃO DO SUPABASE ATUALIZADA
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  //
  // ===== NENHUMA OUTRA MUDANÇA NECESSÁRIA =====
  // Todo o seu código, design e lógica abaixo permanecem intactos.
  //
  
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
