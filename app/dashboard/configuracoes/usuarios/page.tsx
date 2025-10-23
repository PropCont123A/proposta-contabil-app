// Caminho: app/dashboard/configuracoes/usuarios/page.tsx
// VERSÃO FINAL E COMPLETA - NENHUMA ALTERAÇÃO NECESSÁRIA

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import styles from './usuarios.module.css';
import { FaEdit, FaTrash, FaKey, FaCopy } from 'react-icons/fa';

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: 'GESTOR' | 'REGULAR';
};

export default function UsuariosPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isGestor = profile?.role === 'GESTOR';
  const [modalState, setModalState] = useState<{ type: 'edit' | 'delete' | null; data: UserProfile | null }>({ type: null, data: null });
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!profile) return;
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error((await response.json()).error || 'Falha ao buscar usuários.');
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      console.error("Erro em fetchUsers:", err.message);
      setUsers([]);
    }
  }, [profile]);

  useEffect(() => {
    if (authLoading) { setIsLoading(true); return; }
    fetchUsers().finally(() => setIsLoading(false));
  }, [authLoading, fetchUsers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteLink(null);
    setInviteError(null);
    setCopied(false);
    try {
      const response = await fetch('/api/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: inviteEmail }), });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setInviteLink(data.link);
      setInviteEmail('');
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    const userToChange = users.find(u => u.id === targetUserId);
    if (!confirm(`Tem certeza que deseja alterar o nível de ${userToChange?.full_name} para ${newRole}?`)) { fetchUsers(); return; }
    const originalUsers = [...users];
    setUsers(prevUsers => prevUsers.map(u => u.id === targetUserId ? { ...u, role: newRole as UserProfile['role'] } : u));
    try {
      const response = await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUserId, role: newRole }), });
      if (!response.ok) throw new Error((await response.json()).error);
      alert('Nível de acesso atualizado com sucesso!');
    } catch (error: any) {
      alert(`Erro ao atualizar: ${error.message}`);
      setUsers(originalUsers);
    }
  };

  const handleUpdateUser = async () => {
    if (!modalState.data || !newName.trim()) return alert("O nome não pode estar em branco.");
    const targetUserId = modalState.data.id;
    const originalUsers = [...users];
    setIsSubmitting(true);
    setUsers(prevUsers => prevUsers.map(u => u.id === targetUserId ? { ...u, full_name: newName.trim() } : u));
    try {
      const response = await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUserId, fullName: newName.trim() }), });
      if (!response.ok) throw new Error((await response.json()).error);
      alert('Nome atualizado com sucesso!');
      closeModal();
    } catch (error: any) {
      alert(`Erro ao editar: ${error.message}`);
      setUsers(originalUsers);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (targetUser: UserProfile) => {
    if (!confirm(`Tem certeza que deseja gerar uma NOVA SENHA PROVISÓRIA para ${targetUser.full_name}? A senha antiga deixará de funcionar.`)) return;
    setIsSubmitting(true);
    setRecoveryPassword(null);
    setRecoveryError(null);
    try {
      const response = await fetch('/api/users/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUserId: targetUser.id }), });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ocorreu um erro desconhecido');
      setRecoveryPassword(data.temporaryPassword);
      alert('Senha provisória gerada com sucesso! Ela será exibida abaixo da tabela.');
    } catch (error: any) {
      setRecoveryError(error.message);
      alert(`Erro ao gerar senha: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!modalState.data) return;
    const targetUserId = modalState.data.id;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      if (!response.ok) throw new Error((await response.json()).error);
      alert('Usuário excluído com sucesso!');
      closeModal();
      setUsers(prevUsers => prevUsers.filter(u => u.id !== targetUserId));
    } catch (error: any) {
      alert(`Erro ao excluir: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (type: 'edit' | 'delete', data: UserProfile) => {
    setModalState({ type, data });
    if (type === 'edit') setNewName(data.full_name);
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
    setIsSubmitting(false);
  };

  if (authLoading || isLoading) {
    return (
      <>
        <Header title="Gerenciar Usuários" />
        <main className="content"><div className={styles.card}><p>Carregando usuários...</p></div></main>
      </>
    );
  }

  return (
    <>
      <Header title="Gerenciar Usuários" />
      <main className="content">
        {isGestor && (
          <div className={styles.card} style={{ marginBottom: '2rem' }}>
            <h2>Convidar Novo Usuário</h2>
            <form onSubmit={handleInvite} className={styles.inviteForm}>
              <input id="invite-email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email.convidado@contabilidade.com" className={styles.input} required />
              <button type="submit" className="btn-primary" disabled={isInviting}>{isInviting ? 'Gerando...' : 'Gerar Link de Convite'}</button>
            </form>
            {inviteError && <p className={styles.errorMessage}>{inviteError}</p>}
            {inviteLink && (
              <div className={styles.inviteLinkContainer}>
                <p><strong>Link de convite gerado!</strong></p>
                <div className={styles.linkDisplay}>
                  <input type="text" readOnly value={inviteLink} className={styles.input} onClick={(e) => (e.target as HTMLInputElement).select()} />
                  <button onClick={() => handleCopy(inviteLink)} className={styles.copyButton}><FaCopy /> {copied ? 'Copiado!' : 'Copiar'}</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.card}>
          <h2>Usuários do Escritório</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.userTable}>
              <thead><tr><th>Nome Completo</th><th>E-mail</th><th>Nível de Acesso</th>{isGestor && <th>Ações</th>}</tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name}</td><td>{u.email}</td>
                    <td>
                      <select className={styles.roleSelect} value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} disabled={!isGestor || u.id === user?.id}>
                        <option value="GESTOR">Gestor</option><option value="REGULAR">Regular</option>
                      </select>
                    </td>
                    {isGestor && (
                      <td className={styles.actionsCell}>
                        <button className={styles.actionButton} title="Editar Usuário" onClick={() => openModal('edit', u)}><FaEdit /></button>
                        <button className={styles.actionButton} title="Redefinir Senha" onClick={() => handlePasswordReset(u)} disabled={isSubmitting}><FaKey /></button>
                        <button className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Usuário" onClick={() => openModal('delete', u)} disabled={u.id === user?.id}><FaTrash /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(recoveryPassword || recoveryError) && (
          <div className={styles.card} style={{ marginTop: '2rem' }}>
            <h2>Senha Provisória Gerada</h2>
            {recoveryError && <p className={styles.errorMessage}>{recoveryError}</p>}
            {recoveryPassword && (
              <div className={styles.inviteLinkContainer}>
                <p><strong>Senha gerada!</strong> Copie e envie para o usuário. Ele usará esta senha para o próximo login.</p>
                <div className={styles.linkDisplay}>
                  <input type="text" readOnly value={recoveryPassword} className={styles.input} onClick={(e) => (e.target as HTMLInputElement).select()} />
                  <button onClick={() => handleCopy(recoveryPassword)} className={styles.copyButton}><FaCopy /> Copiar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Modal isOpen={modalState.type === 'edit'} onClose={closeModal} title={`Editar Usuário: ${modalState.data?.full_name}`}>
        <div>
          <label htmlFor="edit-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome Completo</label>
          <input id="edit-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={styles.input} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={closeModal} className="btn-secondary">Cancelar</button>
            <button onClick={handleUpdateUser} className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalState.type === 'delete'} onClose={closeModal} title="Confirmar Exclusão">
        <div>
          <p>Você tem certeza que deseja excluir o usuário <strong>{modalState.data?.full_name}</strong>?</p>
          <p>Esta ação não pode ser desfeita.</p>
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
            <button onClick={closeModal} className="btn-secondary">Cancelar</button>
            <button onClick={handleDeleteUser} className="btn-danger" disabled={isSubmitting}>{isSubmitting ? 'Excluindo...' : 'Sim, Excluir'}</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
