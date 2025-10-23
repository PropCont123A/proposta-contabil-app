// app/page.tsx

'use client';

import { createBrowserClient } from '@/lib/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Efeito para redirecionar o usuário se ele já estiver logado
  useEffect(() => {
    // Só redireciona se o carregamento do usuário já terminou e o usuário existe
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Enquanto o estado do usuário está sendo verificado, não mostra nada para evitar um "flash" da tela de login
  if (loading || user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Carregando...</p>
      </div>
    );
  }

  // Se não estiver carregando e não houver usuário, mostra a interface de login
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Proposta Contábil</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']} // Você pode adicionar 'github', 'azure', etc.
          localization={{
            variables: {
              sign_in: {
                email_label: 'Seu email',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                social_provider_text: 'Entrar com {{provider}}',
              },
              sign_up: {
                email_label: 'Seu email',
                password_label: 'Crie uma senha',
                button_label: 'Registrar',
                social_provider_text: 'Registrar com {{provider}}',
              },
              forgotten_password: {
                link_text: 'Esqueceu sua senha?',
                email_label: 'Seu email',
                button_label: 'Enviar instruções',
              }
            },
          }}
        />
      </div>
    </div>
  );
}
