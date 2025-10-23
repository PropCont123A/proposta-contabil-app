// Caminho: app/dashboard/components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createBrowserClient } from '@/lib/client'; // Importamos o client do Supabase
import ProfileMenu from './ProfileMenu';
import './Header.css';

export default function Header({ title }: { title: string }) {
  const { user } = useAuth();
  const supabase = createBrowserClient();

  // Novo estado para armazenar o nome de exibição do usuário
  const [displayName, setDisplayName] = useState('Visitante');
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para buscar o nome completo do usuário
  useEffect(() => {
    // Função para buscar o nome do perfil ou usar um fallback
    async function fetchUserName() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // 1. Tenta buscar o nome completo na tabela 'profiles'
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profileData && profileData.full_name) {
        setDisplayName(profileData.full_name);
      } else {
        // 2. Se não encontrar (ou se o nome estiver vazio), usa o email como fallback
        const namePart = user.email?.split('@')[0] || 'Usuário';
        const formattedName = namePart.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        setDisplayName(formattedName);
      }
      setIsLoading(false);
    }

    fetchUserName();
  }, [user, supabase]); // Roda sempre que o objeto 'user' mudar

  return (
    <header className="header-layout">
      <h1 className="header-title">{title}</h1>
      <div className="header-user-info">
        {/* Exibe a mensagem de boas-vindas com o nome buscado */}
        <span className="header-welcome-message">
          {isLoading ? 'Carregando...' : `Olá, ${displayName}!`}
        </span>
        <ProfileMenu />
      </div>
    </header>
  );
}
