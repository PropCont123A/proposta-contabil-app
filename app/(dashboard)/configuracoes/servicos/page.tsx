// app/(dashboard)/configuracoes/servicos/page.tsx - CÓDIGO COMPLETO E CORRIGIDO
'use client';

import { useEffect, useState, useMemo } from 'react';
// 1. IMPORTAÇÕES CORRIGIDAS
import { createClient } from '../../../../lib/client';
import { useAuth } from '../../../context/AuthContext';
import ServiceModal from '../../components/ServiceModal';
import CategoryTag from '../../components/CategoryTag';

// Tipos (sem alterações)
export type Servico = {
  id: number;
  nome: string;
  descricao: string[];
  valor: number;
  categoria: 'Recorrente' | 'Eventual';
};
type SortConfig = {
  key: keyof Servico;
  direction: 'ascending' | 'descending';
} | null;

export default function CadastroServicosPage() {
  // 2. INICIALIZAÇÃO CORRIGIDA
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();

  // Seus estados (sem alterações)
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Servico | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nome', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 3. FUNÇÕES DE DADOS CORRIGIDAS PARA SEGURANÇA
  async function fetchServicos() {
    if (!user) return; // Guarda de segurança
    // Adiciona o filtro .eq('user_id', user.id)
    const { data, error } = await supabase.from('servicos').select('*').eq('user_id', user.id).order('id', { ascending: true });
    if (error) console.error('Erro ao buscar serviços:', error);
    else if (data) setServicos(data);
  }

  useEffect(() => {
    // Roda a busca apenas quando a autenticação estiver pronta
    if (!authLoading && user) {
      fetchServicos();
    }
  }, [user, authLoading]); // Depende do usuário e do status de loading

  const handleDelete = async (id: number) => {
    if (!user) return; // Guarda de segurança
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      // Adiciona o filtro .eq('user_id', user.id) para segurança
      const { error } = await supabase.from('servicos').delete().eq('id', id).eq('user_id', user.id);
      if (error) alert('Ocorreu um erro ao deletar o serviço.');
      else fetchServicos();
    }
  };

  // Funções do Modal (sem alterações)
  const handleOpenModal = (servico?: Servico) => { setServiceToEdit(servico || null); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setServiceToEdit(null); };
  const handleSaveSuccess = () => { fetchServicos(); handleCloseModal(); };

  // Sua lógica de ordenação e paginação (sem NENHUMA alteração)
  const processedServicos = useMemo(() => {
    let processableServicos = [...servicos];
    if (searchTerm) {
      processableServicos = processableServicos.filter(servico =>
        servico.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig !== null) {
      processableServicos.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return processableServicos;
  }, [servicos, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedServicos.length / ITEMS_PER_PAGE);
  const paginatedServicos = processedServicos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const requestSort = (key: keyof Servico) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // 4. ADICIONA O ESTADO DE LOADING
  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Carregando...
      </div>
    );
  }

  // Seu JSX (com uma pequena alteração no header para ser dinâmico)
  return (
    <>
      <header className="header">
        <h1>Cadastro de Serviços</h1>
        <div className="user-info">
            <span>Bem-vindo, {user?.email}!</span>
            <div className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</div>
        </div>
      </header>

      <main className="content">
        <div className="content-box">
          {/* O resto do seu JSX continua exatamente o mesmo */}
          <div className="content-box-header">
            <div className="search-container" style={{ flexGrow: 1 }}>
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Pesquisar por nome do serviço..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Adicionar Novo Serviço
            </button>
          </div>
          
          <table className="services-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('nome')} className="sortable-header">
                  Tipo de Serviço <i className={`fas ${sortConfig?.key === 'nome' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                </th>
                <th>Descrição</th>
                <th onClick={() => requestSort('valor')} className="sortable-header">
                  Valor <i className={`fas ${sortConfig?.key === 'valor' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                </th>
                <th onClick={() => requestSort('categoria')} className="sortable-header">
                  Categoria <i className={`fas ${sortConfig?.key === 'categoria' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServicos.map((servico) => (
                <tr key={servico.id}>
                  <td className="service-name">{servico.nome}</td>
                  <td>
                    {Array.isArray(servico.descricao) && servico.descricao.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '20px', textAlign: 'left', listStyleType: 'disc' }}>
                        {servico.descricao.slice(0, 2).map((desc, index) => (<li key={index}>{desc}</li>))}
                        {servico.descricao.length > 2 && (<li style={{ listStyleType: 'none', color: '#6c757d', fontSize: '0.8em', paddingTop: '4px' }}>(+{servico.descricao.length - 2} mais...)</li>)}
                      </ul>
                    ) : (<span>-</span>)}
                  </td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}</td>
                  <td><CategoryTag category={servico.categoria} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenModal(servico)} className="btn-action-edit" title="Editar"><i className="fas fa-pencil-alt"></i></button>
                      <button onClick={() => handleDelete(servico.id)} className="btn-action-delete" title="Excluir"><i className="fas fa-trash"></i></button>
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

      <ServiceModal isOpen={isModalOpen} onClose={handleCloseModal} onSaveSuccess={handleSaveSuccess} serviceToEdit={serviceToEdit} />
    </>
  );
}
