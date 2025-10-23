// Caminho: app/dashboard/configuracoes/page.tsx
'use client';

import Link from 'next/link';
import Header from '../components/Header'; // ✅ 1. IMPORTA O NOVO HEADER

export default function ConfiguracoesPage() {
  return (
    <>
      {/* ✅ 2. O HEADER ANTIGO FOI REMOVIDO E SUBSTITUÍDO POR ESTE */}
      <Header title="Configurações" />

      <main className="content">
        <div className="config-buttons">
            <Link href="/dashboard/configuracoes/escritorio" className="config-button">
                <i className="fas fa-building"></i>
                <h3>Cadastro do Escritório</h3>
                <p>Gerencie as informações da sua empresa, logotipo e layout.</p>
            </Link>
            
            <Link href="/dashboard/configuracoes/usuarios" className="config-button">
                <i className="fas fa-user-friends"></i>
                <h3>Cadastro de Usuários</h3>
                <p>Gerencie os usuários com acesso à plataforma e suas permissões.</p>
            </Link>
            
            <Link href="/dashboard/configuracoes/servicos" className="config-button">
                <i className="fas fa-handshake"></i>
                <h3>Cadastro de Serviços</h3>
                <p>Adicione e organize os serviços contábeis oferecidos pela sua empresa.</p>
            </Link>
            
            <Link href="/dashboard/configuracoes/templates" className="config-button">
                <i className="fas fa-file-contract"></i>
                <h3>Templates</h3>
                <p>Personalize os modelos de propostas em PDF e link web.</p>
            </Link>
        </div>
      </main>
    </>
  );
}
