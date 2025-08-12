// app/propostas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './propostas.module.css';

interface Proposta {
  id: number;
  clientes_contato: string;
  empresas: string;
  data_proposta: string;
  status: string;
  valor_total_recorrente: number;
  valor_total_eventual: number;
}

export default function MinhasPropostasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPropostas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('propostas')
        .select(`id,clientes_contato,empresas,data_proposta,status,valor_total_recorrente,valor_total_eventual`)
        .order(sortColumn, { ascending: sortDirection === 'asc' });

      if (error) {
        console.error('Erro ao buscar propostas:', error);
      } else {
        setPropostas(data || []);
      }
      setLoading(false);
    };

    fetchPropostas();
  }, [supabase, sortColumn, sortDirection]);

  const handleSort = (columnName: string) => {
    const newDirection = sortColumn === columnName && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnName);
    setSortDirection(newDirection);
  };

  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Tem certeza que deseja excluir a proposta #${id}?`)) {
      const { error } = await supabase.from('propostas').delete().match({ id });
      if (error) {
        alert('Falha ao excluir a proposta.');
      } else {
        setPropostas(propostas.filter(p => p.id !== id));
      }
    }
  };

  const getSortIcon = (columnName: string) => {
    if (sortColumn !== columnName) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className={styles.mainContent}>
      <header className={styles.header}>
        <h1>Minhas Propostas</h1>
      </header>

      <main className={styles.content}>
        <Link href="/propostas/nova" className={`${styles.btn} ${styles.btnPrimary}`}>
          <i className="fas fa-plus"></i>
          Gerar Nova Proposta
        </Link>

        <div className={styles.tableContainer}>
          <table className={styles.proposalsTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className={styles.sortableHeader}>
                  Nº da Proposta{getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('clientes_contato')} className={styles.sortableHeader}>
                  Cliente{getSortIcon('clientes_contato')}
                </th>
                <th onClick={() => handleSort('empresas')} className={styles.sortableHeader}>
                  Empresa{getSortIcon('empresas')}
                </th>
                <th onClick={() => handleSort('data_proposta')} className={styles.sortableHeader}>
                  Data{getSortIcon('data_proposta')}
                </th>
                <th onClick={() => handleSort('status')} className={styles.sortableHeader}>
                  Status{getSortIcon('status')}
                </th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Carregando...</td></tr>
              ) : propostas.length > 0 ? (
                propostas.map(proposta => (
                  <tr key={proposta.id}>
                    <td>#{proposta.id}</td>
                    <td>{proposta.clientes_contato || 'N/A'}</td>
                    <td>{proposta.empresas || 'N/A'}</td>
                    <td>{new Date(proposta.data_proposta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    <td>{proposta.status}</td>
                    <td>{formatCurrency((proposta.valor_total_recorrente || 0) + (proposta.valor_total_eventual || 0))}</td>
                    <td className={styles.actionsCell}>
                      {/* ================================================================== */}
                      {/*  CORREÇÃO AQUI: Aplicando as classes corretamente */}
                      {/* ================================================================== */}
                      <Link href={`/propostas/editar/${proposta.id}`} className={`${styles.btnAction} ${styles.btnView}`} title="Visualizar/Editar Proposta">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <button onClick={() => alert(`Gerar PDF para proposta #${proposta.id}`)} className={`${styles.btnAction} ${styles.btnPdf}`} title="Gerar PDF">
                        <i className="fas fa-file-pdf"></i>
                      </button>
                      <button onClick={() => alert(`Gerar link para proposta #${proposta.id}`)} className={`${styles.btnAction} ${styles.btnLink}`} title="Gerar Link">
                        <i className="fas fa-link"></i>
                      </button>
                      <button onClick={() => alert(`Ver observações da proposta #${proposta.id}`)} className={`${styles.btnAction} ${styles.btnNotes}`} title="Adicionar/Ver Observações">
                        <i className="fas fa-comment-dots"></i>
                      </button>
                      <button onClick={() => handleDelete(proposta.id)} className={`${styles.btnAction} ${styles.btnDelete}`} title="Excluir Proposta">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Nenhuma proposta encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
