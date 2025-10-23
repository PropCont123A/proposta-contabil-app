// NOVO ARQUIVO: app/cadastro/page.tsx
'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CadastroPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Poderíamos adicionar: const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui podemos adicionar validações, como verificar se as senhas coincidem
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`Erro: ${error.message}`);
    } else {
      setMessage('Cadastro realizado! Verifique seu e-mail para ativar sua conta.');
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
            Crie sua conta
          </h2>
          <form className="login-form" onSubmit={handleSignUp}>
            {/* Futuramente, podemos adicionar um campo de Nome aqui */}
            <div className="login-form-group">
              <label htmlFor="email">Seu melhor e-mail</label>
              <input id="email" name="email" type="email" value={email} onChange={(e ) => setEmail(e.target.value)} required className="login-input" />
            </div>
            <div className="login-form-group">
              <label htmlFor="password">Crie uma senha</label>
              <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="login-input" />
            </div>
            {/* Futuramente, podemos adicionar um campo de Confirmar Senha aqui */}
            {message && (
              <p className={`login-message ${message.startsWith('Erro') ? 'error' : 'success'}`}>
                {message}
              </p>
            )}
            <div>
              <button type="submit" disabled={loading} className="login-button">
                {loading ? 'Criando conta...' : 'Criar minha conta'}
              </button>
            </div>
          </form>
          <p className="signup-text">
            Já tem uma conta?{' '}
            <Link href="/login" className="signup-link">
              Faça o login
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
