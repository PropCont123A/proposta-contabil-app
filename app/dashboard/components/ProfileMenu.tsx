// Caminho: app/dashboard/components/ProfileMenu.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import './ProfileMenu.css';

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserInitial(user.email.charAt(0).toUpperCase());
      }
    };
    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button className="user-avatar-button" onClick={() => setIsOpen(!isOpen)}>
        {userInitial}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <p className="dropdown-text-bold">Minha Conta</p>
          </div>
          {/* ✅✅✅ CORREÇÃO APLICADA AQUI ✅✅✅ */}
          <Link href="/dashboard/configuracoes/perfil" className="dropdown-item">
            <i className="fa-solid fa-user-cog"></i>
            <span>Meus Dados</span>
          </Link>
          {/* ✅✅✅ E AQUI TAMBÉM ✅✅✅ */}
          <Link href="/dashboard/configuracoes/escritorio" className="dropdown-item">
            <i className="fa-solid fa-building"></i>
            <span>Dados do Escritório</span>
          </Link>
          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item dropdown-item-logout">
            <i className="fa-solid fa-sign-out-alt"></i>
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}
