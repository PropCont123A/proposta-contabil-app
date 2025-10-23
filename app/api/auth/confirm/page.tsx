// Caminho: app/auth/confirm/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';
import styles from './confirm.module.css'; // Vamos precisar criar este CSS

// Componente principal que usa Suspense para aguardar os parâmetros da URL
export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className={styles.container}><p>Carregando...</p></div>}>
      <ConfirmComponent />
    </Suspense>
  );
}

// O componente que contém toda a lógica
function ConfirmComponent() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    // Se for um convite, não fazemos nada aqui, apenas esperamos o usuário definir a senha.
    // Se for outro tipo de confirmação (como e-mail), podemos redirecionar.
    if (type && type !== 'invite') {
      // Lógica para outros tipos de confirmação no futuro
    }
    
    if (!token_hash) {
        setError("Link de convite inválido ou expirado. Por favor, solicite um novo link ao seu gestor.");
    }
  }, [searchParams]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
        try {
      // 1. Atualiza a senha do usuário
      const token_hash = searchParams.get('token_hash');
      if (!token_hash) throw new Error("Token não encontrado na URL.");

      // Chamamos a API que você já tem, que sabe como lidar com o token
      const response = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token_hash, // Passamos o token
          password: password  // Passamos a nova senha
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao aceitar o convite.');
      }

      // Se a API funcionou, o usuário foi criado e o perfil atualizado.
      setMessage('Cadastro concluído com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      console.error("Erro ao concluir o cadastro:", err);
      setError(err.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Concluir Cadastro</h1>
        
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        {!message && (
          <form onSubmit={handleSetPassword}>
            <p className={styles.description}>
              Crie uma senha para acessar a plataforma Proposta Contábil.
            </p>
            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar e Acessar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
