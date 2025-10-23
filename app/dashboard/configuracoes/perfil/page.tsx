// Caminho: app/dashboard/configuracoes/perfil/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/dashboard/components/Header';
import styles from './perfil.module.css';

export default function PerfilPage() {
  const supabase = createBrowserClient();
  const { user } = useAuth();

  // Estados para os campos do formulário
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Função para buscar os dados da tabela 'profiles'
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    // MUDANÇA PRINCIPAL: Buscamos dados da nossa tabela 'profiles'
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single(); // .single() pega um único registro ou retorna erro se não achar/achar mais de um

    if (data) {
      setFullName(data.full_name || '');
    } else if (error && error.code !== 'PGRST116') { 
      // PGRST116 é o código para "nenhuma linha encontrada", o que é normal para um novo usuário.
      // Se for outro erro, mostramos no console.
      console.error('Erro ao buscar perfil:', error);
    }

    setLoading(false);
  }, [user, supabase]);

  // Busca os dados quando a página carrega
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Função para salvar as alterações na tabela 'profiles'
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    // MUDANÇA PRINCIPAL: Usamos 'upsert' para criar ou atualizar o perfil.
    // 'upsert' é uma combinação de INSERT + UPDATE.
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, // A chave primária para identificar a linha
        full_name: fullName,
        updated_at: new Date().toISOString() // Boa prática para saber quando foi a última atualização
      });

    setIsSaving(false);
    if (error) {
      alert('Erro ao atualizar o perfil: ' + error.message);
    } else {
      alert('Perfil atualizado com sucesso!');
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Meus Dados" />
        <main className="content">
          <p>Carregando perfil...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Meus Dados" />
      <main className="content">
        <div className={styles.profileContainer}>
          <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
            <h2 className={styles.formTitle}>Informações Pessoais</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled // O email não pode ser alterado
                className={styles.inputField}
              />
            </div>

            {/* MUDANÇA NO FORMULÁRIO: Simplificado para um único campo 'Nome Completo' */}
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Nome Completo</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className={styles.inputField}
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton} disabled={isSaving || loading}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
