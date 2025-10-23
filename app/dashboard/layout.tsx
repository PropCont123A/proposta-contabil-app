// Caminho: app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import './layout.css'; // ✅ Importa o CSS que criamos para o layout

// O layout recebe 'children', que representa a página atual (ex: Clientes, Propostas).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    // ✅ A classe principal que define o layout flex
    <div className="dashboard-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* ✅ Esta div é a área de conteúdo que se ajusta ao sidebar */}
      <div className={`main-content-area ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* O 'children' (a página com seu Header e Main) é renderizado aqui */}
        {children}
      </div>
    </div>
  );
}
