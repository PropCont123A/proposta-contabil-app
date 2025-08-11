// app/propostas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // A importação já está aqui, perfeito!
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './propostas.module.css';

// Definindo a interface para os dados que esperamos do Supabase
interface Proposta {
  id: number;
  clientes_contato: string[]; // Ajustado para array de strings simples
  empresas: string[];
  data_proposta: string;
  status: string;
  valor_total_recorrente: number;
  valor_total_eventual: number;
}

export default function MinhasPropostasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPropostas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('propostas')
        .select(`id,clientes_contato,empresas,data_proposta,status,valor_total_recorrente,valor_total_eventual`)
        .order('data_proposta', { ascending: false });

      if (error) {
        console.error('Erro ao buscar propostas:', error);
        alert('Não foi possível carregar as propostas.');
      } else {
        setPropostas(data || []);
      }
      setLoading(false);
    };

    fetchPropostas();
  }, [supabase]);

  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Tem certeza que deseja excluir a proposta #${id}?`)) {
      const { error } = await supabase.from('propostas').delete().match({ id });
      if (error) {
        alert('Falha ao excluir a proposta.');
        console.error(error);
      } else {
        alert('Proposta excluída com sucesso!');
        setPropostas(propostas.filter(p => p.id !== id));
      }
    }
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
                <th>ID</th>
                <th>Cliente</th>
                <th>Empresa</th>
                <th>Data</th>
                <th>Status</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Carregando propostas...</td></tr>
              ) : propostas.length > 0 ? (
                propostas.map(proposta => (
                  <tr key={proposta.id}>
                    <td>#{proposta.id}</td>
                    <td>{proposta.clientes_contato?.[0] || 'N/A'}</td>
                    <td>{proposta.empresas?.[0] || 'N/A'}</td>
                    <td>{new Date(proposta.data_proposta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    <td>{proposta.status}</td>
                    <td>{formatCurrency((proposta.valor_total_recorrente || 0) + (proposta.valor_total_eventual || 0))}</td>
                    <td className={styles.actionsCell}>
                      {/* ===== AQUI ESTÁ A MUDANÇA ===== */}
                      <Link href={`/propostas/editar/${proposta.id}`} className={`${styles.btnAction} ${styles.btnView}`}>
                        <i className="fas fa-eye"></i>
                      </Link>
                      {/* ================================ */}
                      <button onClick={() => handleDelete(proposta.id)} className={`${styles.btnAction} ${styles.btnDelete}`}>
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
