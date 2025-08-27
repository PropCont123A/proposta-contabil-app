// app/(dashboard)/propostas/components/ProposalsTable.tsx (VERSÃO CORRETA)
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import StatusTag from './StatusTag';

type Proposta = {
  id: number;
  cliente_nome: string | null;
  data_proposta: string;
  status: string;
  valor_total_recorrente: number;
  valor_total_eventual: number;
};

type ProposalsTableProps = {
  propostas: Proposta[];
  onDelete: (id: number) => void;
};

const ITEMS_PER_PAGE = 10;

export default function ProposalsTable({ propostas, onDelete }: ProposalsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Proposta; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedPropostas = useMemo(() => {
    let filtered = [...propostas];
    if (statusFilter !== 'Todos') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.cliente_nome || '').toLowerCase().includes(lowercasedFilter)
      );
    }
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [propostas, searchTerm, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedPropostas.length / ITEMS_PER_PAGE);
  const paginatedPropostas = filteredAndSortedPropostas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const requestSort = (key: keyof Proposta) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Proposta) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const formatCurrency = (value: number = 0) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <>
      <div className="table-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            placeholder="Pesquisar por cliente..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="Todos">Todos</option>
              <option value="Rascunho">Rascunho</option>
              <option value="Enviado">Enviado</option>
              <option value="Contratado">Contratado</option>
              <option value="Recusado">Recusado</option>
            </select>
          </div>
        </div>
        <div className="toolbar-right">
          <Link href="/propostas/nova" className="btn-primary">
            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
            Gerar Nova Proposta
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="services-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('id')}>Nº</th>
              <th onClick={() => requestSort('cliente_nome')}>Cliente{getSortIcon('cliente_nome')}</th>
              <th onClick={() => requestSort('data_proposta')}>Data{getSortIcon('data_proposta')}</th>
              <th onClick={() => requestSort('status')}>Status{getSortIcon('status')}</th>
              <th>Valor Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPropostas.length > 0 ? (
              paginatedPropostas.map(proposta => (
                <tr key={proposta.id}>
                  <td>{proposta.id}</td>
                  <td className="service-name">{proposta.cliente_nome || 'Cliente não vinculado'}</td>
                  <td>{new Date(proposta.data_proposta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                  <td><StatusTag status={proposta.status} /></td>
                  <td>{formatCurrency((proposta.valor_total_recorrente || 0) + (proposta.valor_total_eventual || 0))}</td>
                  <td className="actions-cell">
                    <Link href={`/propostas/editar/${proposta.id}`} className="btn-action-icon btn-view" title="Visualizar/Editar">
                      <i className="fas fa-eye"></i>
                    </Link>
                    <button onClick={() => onDelete(proposta.id)} className="btn-action-icon btn-delete" title="Excluir">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Nenhuma proposta encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-footer">
        <span>Mostrando {paginatedPropostas.length} de {filteredAndSortedPropostas.length} propostas</span>
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Próximo</button>
        </div>
      </div>
    </>
  );
}
