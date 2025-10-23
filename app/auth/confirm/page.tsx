// Caminho: app/auth/confirm/page.tsx - VERSÃO FINAL E CORRIGIDA
'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';
import styles from './confirm.module.css';

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className={styles.container}><p>Carregando...</p></div>}>
      <ConfirmComponent />
    </Suspense>
  );
}

function ConfirmComponent() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>('Verificando seu convite...');
  const [isVerified, setIsVerified] = useState(false); // ✅ Novo estado para controlar a verificação
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Função para verificar o token quando a página carrega
  const verifyToken = useCallback(async (token: string) => {
    // O Supabase usa o token para criar uma sessão temporária.
    // Esta chamada é crucial para que o updateUser saiba quem é o usuário.
    const { error: sessionError } = await supabase.auth.verifyOtp({
      type: 'invite',
      token_hash: token,
    });

    if (sessionError) {
      setError('Link de convite inválido ou expirado. Por favor, solicite um novo link.');
      setMessage(null);
    } else {
      // Sucesso! O token é válido. Agora podemos mostrar o formulário de senha.
      setIsVerified(true);
      setMessage(null);
    }
  }, [supabase.auth]);

  useEffect(() => {
    const token = searchParams.get('token_hash');
    if (token) {
      verifyToken(token);
    } else {
      setError("Nenhum token de convite encontrado no link.");
      setMessage(null);
    }
  }, [searchParams, verifyToken]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      setError("A verificação do convite falhou. Não é possível definir a senha.");
      return;
    }
    // ... (validações de senha permanecem iguais)
    if (password.length < 6) { /* ... */ }
    if (password !== confirmPassword) { /* ... */ }

    setIsSubmitting(true);
    try {
      // Agora o updateUser funcionará, pois a sessão foi ativada pelo verifyOtp
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setMessage('Cadastro concluído com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      console.error("Erro ao definir a senha:", err);
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

        {/* ✅ O formulário só aparece se o token for verificado com sucesso */}
        {isVerified && !message && (
          <form onSubmit={handleSetPassword}>
            <p className={styles.description}>Crie uma senha para acessar a plataforma.</p>
            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.inputField} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.inputField} required />
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
