// app/dashboard/components/Sidebar.tsx (ou onde ele estiver)

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import './sidebar.css';

import logoCompleta from '@/public/images/logo-completa.png';
import logoSimbolo from '@/public/images/logo-simbolo.png';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

// ✅✅✅ CORREÇÃO DEFINITIVA DOS LINKS DO MENU ✅✅✅
const menuItems = [
  // O link do Dashboard principal agora aponta para /dashboard
  { href: '/dashboard', icon: 'fa-solid fa-chart-pie', text: 'Dashboard' },
  // Todos os outros links recebem o prefixo /dashboard
  { href: '/dashboard/propostas/nova', icon: 'fa-solid fa-plus-circle', text: 'Gerar Nova Proposta' },
  { href: '/dashboard/propostas', icon: 'fa-solid fa-file-invoice-dollar', text: 'Minhas Propostas' },
  { href: '/dashboard/clientes', icon: 'fa-solid fa-users', text: 'Cadastro de Clientes' },
  { href: '/dashboard/configuracoes', icon: 'fa-solid fa-cog', text: 'Configurações' },
];

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          {/* O logo agora leva para o dashboard, não mais para a raiz (login) */}
          <Link href="/dashboard" className="logo-link">
            <Image
              src={logoCompleta}
              alt="Proposta Contábil"
              width={200}
              height={55}
              priority
              className="logo-image logo-completa"
            />
            <Image
              src={logoSimbolo}
              alt="Proposta Contábil Símbolo"
              width={45}
              height={45}
              priority
              className="logo-image logo-simbolo"
            />
          </Link>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            // Lógica de ativação melhorada para funcionar com sub-rotas
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.text}
                href={item.href}
                className={`menu-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.text : undefined}
              >
                <i className={item.icon}></i>
                <span className="menu-text">{item.text}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        className="toggle-btn"
        onClick={toggleSidebar}
        title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
    </aside>
  );
}
