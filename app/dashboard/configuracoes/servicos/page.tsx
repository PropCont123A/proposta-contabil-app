// app/(dashboard)/configuracoes/servicos/page.tsx - VERSÃO FINALÍSSIMA E ROBUSTA

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createBrowserClient } from '../../../../lib/client';
import { useAuth } from '../../../context/AuthContext';
import ServiceModal from '../../components/ServiceModal';
import CategoryTag from '../../components/CategoryTag';
import Header from '../../components/Header';

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
  const supabase = createBrowserClient();
  // ✅ Pegamos o 'profile' e o 'authLoading' do contexto. O 'profile' tem o escritorio_id.
  const { profile, loading: authLoading } = useAuth();

  const [servicos, setServicos] = useState<Servico[]>([]);
  // ✅ O loading da página começa como true.
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Servico | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nome', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ✅ LÓGICA DE BUSCA REFEITA E MAIS SEGURA
  const fetchServicos = useCallback(async () => {
    // Só executa se o perfil (com escritorio_id) estiver carregado.
    if (!profile?.escritorio_id) {
      setLoading(false); // Se não tem perfil, não há o que buscar. Para de carregar.
      return;
    }

    console.log('Buscando serviços para o escritório:', profile.escritorio_id); // Log para depuração

    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('escritorio_id', profile.escritorio_id); // Filtro explícito por segurança

      if (error) {
        throw error;
      }
      
      setServicos(data || []);

    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
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
    fetchServicos();
  }, [authLoading, fetchServicos]);


  // O resto do seu código permanece 100% intacto.
  const handleDelete = async (id: number) => {
    if (!profile) return;
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      const { error } = await supabase.from('servicos').delete().eq('id', id);
      if (error) alert('Ocorreu um erro ao deletar o serviço.');
      else fetchServicos();
    }
  };

  const handleOpenModal = (servico?: Servico) => { setServiceToEdit(servico || null); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setServiceToEdit(null); };
  const handleSaveSuccess = () => { fetchServicos(); handleCloseModal(); };

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

  // ✅ Lógica de renderização do loading da PÁGINA.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Header title="Cadastro de Serviços" />
      <main className="content">
        <div className="content-box">
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
                <th onClick={() => requestSort('nome')} className="sortable-header">Tipo de Serviço <i className={`fas ${sortConfig?.key === 'nome' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i></th>
                <th>Descrição</th>
                <th onClick={() => requestSort('valor')} className="sortable-header">Valor <i className={`fas ${sortConfig?.key === 'valor' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i></th>
                <th onClick={() => requestSort('categoria')} className="sortable-header">Categoria <i className={`fas ${sortConfig?.key === 'categoria' ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i></th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServicos.length > 0 ? (
                paginatedServicos.map((servico) => (
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
                ))
              ) : (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Nenhum serviço cadastrado ainda.</td></tr>
              )}
            </tbody>
          </table>
          {processedServicos.length > 0 && (
            <div className="pagination-controls">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próximo</button>
            </div>
          )}
        </div>
      </main>
      <ServiceModal isOpen={isModalOpen} onClose={handleCloseModal} onSaveSuccess={handleSaveSuccess} serviceToEdit={serviceToEdit} />
    </>
  );
}
