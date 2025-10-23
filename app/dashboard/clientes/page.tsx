// Caminho: app/(dashboard)/clientes/page.tsx - VERSÃO FINAL E ROBUSTA

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createBrowserClient } from '@/lib/client';
import ClientModal from '../propostas/nova/components/ClientModal'; 
import { formatCnpjCpf, formatTelefone } from '@/utils/formatters';
import { useAuth } from '@/app/context/AuthContext';
import Header from '../components/Header';

export type Cliente = { id: number; tipo_pessoa: string; cnpj_cpf: string; nome_fantasia_ou_nome: string; email: string; telefone: string; endereco: string; cidade: string; estado: string; cep: string; };
type SortConfig = { key: keyof Cliente; direction: 'ascending' | 'descending'; } | null;

export default function ClientesPage() {
  const supabase = createBrowserClient();
  // ✅ Pegamos o 'profile' e o 'authLoading' do contexto.
  const { profile, loading: authLoading } = useAuth();
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  // ✅ O loading da PÁGINA começa como true.
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Partial<Cliente> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nome_fantasia_ou_nome', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ✅ LÓGICA DE BUSCA REFEITA E MAIS SEGURA
  const fetchClientes = useCallback(async () => {
    // Só executa se o perfil (com escritorio_id) estiver carregado.
    if (!profile?.escritorio_id) {
      setLoading(false); // Se não tem perfil, não há o que buscar. Para de carregar.
      return;
    }

    try {
      // A RLS já protege, mas filtrar explicitamente é uma boa prática.
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('escritorio_id', profile.escritorio_id);

      if (error) throw error;
      
      setClientes(data || []);

    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      // ✅ A GARANTIA: Aconteça o que acontecer, o loading da página termina.
      setLoading(false);
    }
  }, [supabase, profile]);

  // ✅ useEffect SIMPLIFICADO E CORRIGIDO
  useEffect(() => {
    // Se a autenticação ainda está carregando, não fazemos nada.
    if (authLoading) {
      return;
    }
    // Assim que a autenticação termina (authLoading vira false), chamamos a busca.
    fetchClientes();
  }, [authLoading, fetchClientes]);
  
  // O resto do seu código está 100% preservado.
  const handleOpenModal = (cliente?: Partial<Cliente>) => { setClientToEdit(cliente || null); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setClientToEdit(null); };

  const handleSave = async (clienteData: Partial<Cliente>) => {
    if (!profile) { alert('Erro de autenticação. Faça login novamente.'); return; }
    try {
      const { id, ...dataToSave } = clienteData;
      let error;
      if (id) {
        ({ error } = await supabase.from('clientes').update(dataToSave).eq('id', id));
      } else {
        ({ error } = await supabase.from('clientes').insert([{ ...dataToSave, escritorio_id: profile.escritorio_id }]));
      }
      if (error) {
        console.error('Erro ao salvar cliente:', error);
        alert('Ocorreu um erro ao salvar o cliente.');
      } else {
        fetchClientes();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Ocorreu um erro inesperado.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!profile) { alert('Erro de autenticação. Faça login novamente.'); return; }
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const { error } = await supabase.from('clientes').delete().eq('id', id);
        if (error) {
          console.error('Erro ao deletar cliente:', error);
          alert('Ocorreu um erro ao deletar o cliente.');
        } else {
          fetchClientes();
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        alert('Ocorreu um erro inesperado.');
      }
    }
  };

  const processedClientes = useMemo(() => { let processableClientes = [...clientes]; if (searchTerm) { processableClientes = processableClientes.filter(c => c.nome_fantasia_ou_nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.cnpj_cpf.includes(searchTerm)); } if (sortConfig !== null) { processableClientes.sort((a, b) => { if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1; if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1; return 0; }); } return processableClientes; }, [clientes, searchTerm, sortConfig]);
  const totalPages = Math.ceil(processedClientes.length / ITEMS_PER_PAGE);
  const paginatedClientes = processedClientes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const requestSort = (key: keyof Cliente) => { let direction: 'ascending' | 'descending' = 'ascending'; if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') { direction = 'descending'; } setSortConfig({ key, direction }); };
  
  // ✅ Lógica de renderização do loading da PÁGINA.
  if (loading) { return ( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> Carregando clientes... </div> ); }
  
  return (
    <>
      <Header title="Cadastro de Clientes" />
      <main className="content">
        <div className="content-box">
          <div className="content-box-header">
            <div className="search-container" style={{ flexGrow: 1 }}>
              <i className="fas fa-search search-icon"></i>
              <input type="text" placeholder="Pesquisar por nome ou CNPJ/CPF..." className="search-input" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Adicionar Novo Cliente
            </button>
          </div>
          <table className="services-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('nome_fantasia_ou_nome')} className="sortable-header"> Nome / Nome Fantasia <i className={`fas ${sortConfig?.key === 'nome_fantasia_ou_nome' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i> </th>
                <th onClick={() => requestSort('cnpj_cpf')} className="sortable-header"> CNPJ / CPF <i className={`fas ${sortConfig?.key === 'cnpj_cpf' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i> </th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClientes.length > 0 ? (
                paginatedClientes.map((cliente) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    {searchTerm ? 'Nenhum cliente encontrado para a pesquisa.' : 'Nenhum cliente cadastrado ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {processedClientes.length > 0 && (
            <div className="pagination-controls">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próximo</button>
            </div>
          )}
        </div>
      </main>
      <ClientModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} clientToEdit={clientToEdit} />
    </>
  );
}
