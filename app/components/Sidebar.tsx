// app/components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const menuItems = [
    { href: '/dashboard', icon: 'fa-chart-line', text: 'Dashboard' },
    { href: '/propostas/nova', icon: 'fa-plus-circle', text: 'Gerar nova proposta' },
    { href: '/clientes', icon: 'fa-users', text: 'Cadastro de clientes' },
    { href: '/configuracoes', icon: 'fa-cog', text: 'Configurações' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header"><div className="logo">Proposta Contábil</div></div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={`menu-item ${pathname.startsWith(item.href) ? 'active' : ''}`}>
            <i className={`fas ${item.icon}`}></i>
            <span className="menu-text">{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
