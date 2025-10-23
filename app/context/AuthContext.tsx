// Caminho: app/context/AuthContext.tsx
// VERSÃO FINAL CORRIGIDA PARA ELIMINAR O LOOP E CARREGAR O PERFIL

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { createBrowserClient } from '@/lib/client'; 
import { User } from '@supabase/supabase-js';

// Tipagem (sem alterações)
export type UserProfile = {
  id: string;
  full_name: string;
  role: 'GESTOR' | 'USUARIO_REGULAR';
  escritorio_id: number;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  // ✅ CORREÇÃO 1: Memoriza o cliente Supabase para evitar recriação
  const supabase = useMemo(() => createBrowserClient(), []);
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar o perfil do usuário
    const fetchUserProfile = async (userToFetch: User) => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id, full_name, role, escritorio_id')
        .eq('id', userToFetch.id)
        .single();
      setProfile(userProfile as UserProfile | null);
    };

    // Listener para mudanças de autenticação (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        
        if (sessionUser) {
          await fetchUserProfile(sessionUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Limpa o listener quando o componente é desmontado
    return () => {
      authListener?.subscription.unsubscribe();
    };

    // ✅ CORREÇÃO 2: O array de dependências garante que o useEffect execute apenas uma vez
  }, [supabase]);

  const value = { user, profile, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
