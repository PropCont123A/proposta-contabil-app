'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import './sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { href: '/', icon: 'fa-solid fa-chart-pie', text: 'Dashboard' },
  { href: '/propostas/nova', icon: 'fa-solid fa-plus-circle', text: 'Gerar nova proposta' },
  { href: '/propostas', icon: 'fa-solid fa-file-invoice-dollar', text: 'Minhas propostas' },
  { href: '/clientes', icon: 'fa-solid fa-users', text: 'Cadastro de clientes' },
  { href: '/configuracoes', icon: 'fa-solid fa-cog', text: 'Configurações' },
];

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <Link href="/" className="logo-link">
            <Image
              src="/images/logo-completa.png"
              alt="Proposta Contábil"
              width={200}
              height={55}
              priority
              className="logo-image logo-completa"
            />
            <Image
              src="/images/logo-simbolo.png"
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
            const isActive = pathname === item.href;
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

      {/* O botão de toggle agora está fora do sidebar-footer e será posicionado via CSS */}
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
