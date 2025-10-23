// Caminho: app/redefinir-senha/page.tsx
// VERSÃO DE DEPURAÇÃO - Para descobrir o que está acontecendo com a sessão

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';
import styles from '../auth/confirm/confirm.module.css';

function RedefinirSenhaComponent() {
  const router = useRouter();
  const supabase = createBrowserClient();
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  // ✅✅✅ MODO DE DEPURAÇÃO ATIVADO ✅✅✅
  useEffect(() => {
    const checkSession = async () => {
      console.log("--- INICIANDO DEPURAÇÃO DA SESSÃO ---");
      
      // 1. Vamos ver o que getSession() nos retorna.
      const { data, error: sessionError } = await supabase.auth.getSession();

      // 2. Imprimimos o resultado COMPLETO no console para análise.
      console.log("Resultado de getSession():", data);
      
      if (sessionError) {
        console.error("Erro ao buscar sessão:", sessionError);
      }

      // 3. Verificamos a condição que deveria habilitar o botão.
      if (data.session && data.session.user.aud === 'authenticated') {
        console.log("✅ SUCESSO: Sessão de recuperação detectada. Habilitando o botão.");
        setIsSessionReady(true);
      } else {
        console.log("❌ FALHA: Nenhuma sessão de recuperação válida foi encontrada.");
        // Vamos imprimir o porquê da falha
        if (!data.session) {
          console.log("Motivo: data.session é nulo.");
        } else {
          console.log("Motivo: data.session.user.aud NÃO é 'authenticated'. Valor atual:", data.session.user.aud);
        }
      }
      console.log("--- FIM DA DEPURAÇÃO DA SESSÃO ---");
    };

    checkSession();
  }, [supabase]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSessionReady) {
      setError("Sessão de recuperação inválida. Por favor, use o link novamente.");
      return;
    }
    // ... (resto da função inalterado)
    setIsSubmitting(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Senha alterada com sucesso! Você será redirecionado para o login em 3 segundos.");
      setTimeout(() => router.push('/login'), 3000);
    }
    setIsSubmitting(false);
  };

  // O JSX permanece o mesmo
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Redefinir sua Senha</h1>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
        {!message && (
          <form onSubmit={handlePasswordUpdate}>
            <p className={styles.description}>Digite sua nova senha abaixo.</p>
            <div className={styles.formGroup}>
              <label htmlFor="password">Nova Senha</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting || !isSessionReady}>
              {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenhaComponent />
    </Suspense>
  );
}
