// ARQUIVO COMPLETO E FINALÍSSIMO: app/login/page.tsx
'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Importação do Link

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(`Erro: ${error.message}`);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setMessage('Erro: Por favor, digite seu e-mail no campo acima e clique em "Esqueceu a senha?" novamente.');
      return;
    }
    setLoading(true);
    setMessage('');
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setMessage(`Erro: ${error.message}`);
    } else {
      setMessage('Sucesso! Se o e-mail existir em nossa base, um link para redefinir a senha foi enviado.');
    }
    setLoading(false);
  };

  return (
    <div className="login-split-container">
      <div className="login-form-wrapper">
        <div className="login-card">
          <Image
            className="login-logo"
            src="https://propostacontabil.com.br/wp-content/uploads/2025/07/proposta-contabil-fundo-transparente.png"
            alt="Proposta Contábil Logo"
            width={200}
            height={80}
            priority
          />
        </div>
        <div className="login-form-container">
          <h2 className="login-title">
            Acesse sua conta
          </h2>
          <form className="login-form" onSubmit={handleSignIn}>
            <div className="login-form-group">
              <label htmlFor="email">Endereço de e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e ) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>
            {message && (
              <p className={`login-message ${message.startsWith('Erro') ? 'error' : 'success'}`}>
                {message}
              </p>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <div className="forgot-password-wrapper">
                <button type="button" onClick={handlePasswordReset} className="forgot-password-link">
                  Esqueceu a senha?
                </button>
              </div>
            </div>
          </form>
          <p className="signup-text">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="signup-link">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
      <div className="login-branding-wrapper">
        <div className="branding-content">
          <h1 className="branding-title">
            A sua ferramenta para propostas contábeis de impacto.
          </h1>
          <p className="branding-subtitle">
            Padronize, agilize e converta mais clientes com propostas que impressionam.
          </p>
        </div>
      </div>
    </div>
  );
}
