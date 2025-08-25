// app/context/AuthContext.tsx - CÓDIGO COMPLETO E CORRIGIDO

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// 1. Importa a FUNÇÃO em vez da variável
import { createSupabaseBrowserClient } from '../../lib/supabaseClient'; 
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  // 2. Cria a instância do Supabase DENTRO do provedor
  const supabase = createSupabaseBrowserClient(); 
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
    // Adiciona 'supabase' como dependência do useEffect
  }, [supabase]); 

  const value = {
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
