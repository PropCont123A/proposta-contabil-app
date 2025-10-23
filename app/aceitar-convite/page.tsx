// Caminho: app/aceitar-convite/page.tsx

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// Reutilizaremos o estilo da sua página de cadastro original
import styles from '../auth/confirm/confirm.module.css';

function AcceptInviteComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Link de convite inválido ou não encontrado. Por favor, use o link fornecido no convite.");
    }
  }, [searchParams]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token de convite não encontrado.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/auth/accept-invite', { // ✅ Aponta para a nova API
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, password, token }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Cadastro realizado com sucesso! Você será redirecionado para o login em 3 segundos.");
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setError(data.error || "Ocorreu um erro no cadastro.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Finalize seu Cadastro</h1>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        {!message && (
          <form onSubmit={handleSignUp}>
            <p className={styles.description}>
              Você foi convidado para a plataforma Proposta Contábil. Preencha seus dados para criar sua conta.
            </p>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Seu Nome Completo</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Seu E-mail</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Crie uma Senha</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className={styles.authButton} disabled={isSubmitting || !token}>
              {isSubmitting ? 'Criando conta...' : 'Criar Conta e Acessar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AcceptInviteComponent />
    </Suspense>
  );
}
