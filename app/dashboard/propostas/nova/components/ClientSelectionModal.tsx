'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createBrowserClient } from '@/lib/client';
import { Cliente } from '../state';
import styles from '../styles/client-modal.module.css'; // Reutilizaremos o estilo

interface ClientSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (cliente: Cliente) => void;
  onAddNewClient: () => void; // Função para abrir o modal de formulário
}

export default function ClientSelectionModal({ isOpen, onClose, onSelectClient, onAddNewClient }: ClientSelectionModalProps) {
  const supabase = createBrowserClient();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchClientes = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('clientes').select('*').order('nome_fantasia_ou_nome');
        if (error) console.error('Erro ao buscar clientes:', error);
        else setClientes(data || []);
        setLoading(false);
      };
      fetchClientes();
    }
  }, [isOpen, supabase]);

  const clientesFiltrados = useMemo(() => {
    if (!searchTerm) return clientes;
    return clientes.filter(c => c.nome_fantasia_ou_nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, clientes]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Selecionar Cliente</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder="Buscar por nome..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Este botão vai chamar a função para abrir o SEU modal de formulário */}
          <button onClick={onAddNewClient} className={styles.addButton}>
            + Cadastrar Novo Cliente
          </button>
        </div>
        <div className={styles.clientList}>
          {loading ? <p>Carregando...</p> : clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className={styles.clientItem} onClick={() => onSelectClient(cliente)}>
              <span className={styles.clientName}>{cliente.nome_fantasia_ou_nome}</span>
              <span className={styles.clientDoc}>{cliente.cnpj_cpf}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
