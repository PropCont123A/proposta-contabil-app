// app/login/page.tsx
'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

  const handleSignUp = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`Erro: ${error.message}`);
    } else {
      setMessage('Cadastro realizado! Verifique seu e-mail para confirmação.');
    }
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <Image
          className="login-logo"
          src="https://propostacontabil.com.br/wp-content/uploads/2025/07/proposta-contabil-fundo-transparente.png"
          alt="Proposta Contábil Logo"
          width={200}
          height={80}
          priority
        />
        <h2 className="login-title">
          Acesse sua conta
        </h2>
      </div>

      <div className="login-form-container">
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Senha</label>
              <a href="#" className="forgot-password-link">
                Esqueceu a senha?
              </a>
            </div>
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
          </div>
        </form>

        <p className="signup-text">
          Não é um membro?{' '}
          <button onClick={handleSignUp} className="signup-link">
            Cadastre-se agora
          </button>
        </p>
      </div>
    </div>
  );
}
