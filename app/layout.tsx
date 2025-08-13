'use client';

import './globals.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar'; // Caminho CORRETO

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estado para controlar se o menu está recolhido ou não (inicia revelado)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Função para alternar o estado do menu, passada para o componente Sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* O Next.js gerencia o <head>, mas manteremos o Font Awesome aqui por simplicidade */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <div className="flex-container">
          {/* ===== MENU LATERAL DINÂMICO ===== */}
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

          {/* ===== ÁREA PRINCIPAL ===== */}
          {/* A classe 'sidebar-collapsed' é adicionada dinamicamente para ajustar a margem */}
          <main className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            {children} {/* Aqui entra o conteúdo da página atual */}
          </main>
        </div>
      </body>
    </html>
   );
}
