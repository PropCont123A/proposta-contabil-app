// Caminho: app/atualizar-senha/page.tsx
// ARQUIVO NOVO, COMPLETO (ETAPA 4 REVISADA)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../auth/confirm/confirm.module.css'; // Reutilizando estilos

export default function AtualizarSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/set-new-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível atualizar a senha.');
      }
      setMessage('Senha atualizada com sucesso! Você será redirecionado para o dashboard.');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Atualize sua Senha</h1>
        <p className={styles.description}>
          Por segurança, defina uma nova senha pessoal para acessar o sistema.
        </p>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
        {!message && (
          <form onSubmit={handlePasswordUpdate}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Nova Senha</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
