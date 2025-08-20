'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import ClientModal from '../components/ClientModal'; // Importando o novo modal
import { formatCnpjCpf, formatTelefone } from '../../../utils/formatters'; // Utilitários de formatação (vamos criar)

// Definindo o tipo para um Cliente
export type Cliente = {
  id: number;
  tipo_pessoa: string;
  cnpj_cpf: string;
  nome_fantasia_ou_nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
};

type SortConfig = {
  key: keyof Cliente;
  direction: 'ascending' | 'descending';
} | null;

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Partial<Cliente> | null>(null);
  
  // Estados para pesquisa, ordenação e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nome_fantasia_ou_nome', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  async function fetchClientes() {
    const { data, error } = await supabase.from('clientes').select('*');
    if (error) console.error('Erro ao buscar clientes:', error);
    else if (data) setClientes(data);
  }

  useEffect(() => { fetchClientes(); }, []);

  const handleOpenModal = (cliente?: Partial<Cliente>) => {
    setClientToEdit(cliente || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClientToEdit(null);
  };

  const handleSave = async (clienteData: Partial<Cliente>) => {
    const { id, ...dataToSave } = clienteData;

    let error;
    if (id) {
      // Modo Edição
      ({ error } = await supabase.from('clientes').update(dataToSave).eq('id', id));
    } else {
      // Modo Criação
      ({ error } = await supabase.from('clientes').insert([dataToSave]));
    }

    if (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Ocorreu um erro ao salvar o cliente.');
    } else {
      fetchClientes();
      handleCloseModal();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) alert('Ocorreu um erro ao deletar o cliente.');
      else fetchClientes();
    }
  };

  const processedClientes = useMemo(() => {
    let processableClientes = [...clientes];
    if (searchTerm) {
      processableClientes = processableClientes.filter(c =>
        c.nome_fantasia_ou_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cnpj_cpf.includes(searchTerm)
      );
    }
    if (sortConfig !== null) {
      processableClientes.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return processableClientes;
  }, [clientes, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedClientes.length / ITEMS_PER_PAGE);
  const paginatedClientes = processedClientes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const requestSort = (key: keyof Cliente) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <header className="header">
        <h1>Cadastro de Clientes</h1>
        <div className="user-info">
            <span>Bem-vindo, Emerson!</span>
            <div className="user-avatar">E</div>
        </div>
      </header>

      <main className="content">
        <div className="content-box">
          <div className="content-box-header">
            <div className="search-container" style={{ flexGrow: 1 }}>
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Pesquisar por nome ou CNPJ/CPF..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Adicionar Novo Cliente
            </button>
          </div>
          
          <table className="services-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('nome_fantasia_ou_nome')} className="sortable-header">
                  Nome / Nome Fantasia <i className={`fas ${sortConfig?.key === 'nome_fantasia_ou_nome' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                </th>
                <th onClick={() => requestSort('cnpj_cpf')} className="sortable-header">
                  CNPJ / CPF <i className={`fas ${sortConfig?.key === 'cnpj_cpf' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                </th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="service-name">{cliente.nome_fantasia_ou_nome}</td>
                  <td>{formatCnpjCpf(cliente.cnpj_cpf)}</td>
                  <td>{cliente.email}</td>
                  <td>{formatTelefone(cliente.telefone)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenModal(cliente)} className="btn-action-edit" title="Editar"><i className="fas fa-pencil-alt"></i></button>
                      <button onClick={() => handleDelete(cliente.id)} className="btn-action-delete" title="Excluir"><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próximo</button>
          </div>
        </div>
      </main>

      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave} // << LINHA CORRIGIDA
        clientToEdit={clientToEdit}
      />
    </>
  );
}
