// app/configuracoes/servicos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type Servico = {
  id: number;
  nome: string;
  descricao: string; // Agora vamos tratar como um array de strings
  valor: number;
  categoria: string;
};

export default function CadastroServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentServico, setCurrentServico] = useState<Partial<Servico>>({});
  const [descricoes, setDescricoes] = useState<string[]>(['']); // Estado para as descrições dinâmicas
  const [isEditing, setIsEditing] = useState(false);

  async function fetchServicos() {
    const { data, error } = await supabase.from('servicos').select('*').order('id', { ascending: true });
    if (error) {
      console.error('Erro ao buscar serviços:', error);
    } else {
      setServicos(data);
    }
  }

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleOpenModal = (servico: Partial<Servico> = {}) => {
    setIsEditing(!!servico.id);
    setCurrentServico(servico);
    // Se estiver editando e a descrição for um array, use-a. Senão, comece com um campo vazio.
    const descricoesIniciais = Array.isArray(servico.descricao) ? servico.descricao : [''];
    setDescricoes(descricoesIniciais.length > 0 ? descricoesIniciais : ['']);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentServico({});
    setDescricoes(['']);
  };

  const handleSave = async () => {
    // Filtra descrições vazias antes de salvar
    const descricoesFinais = descricoes.filter(d => d.trim() !== '');

    const servicoToSave = {
      nome: currentServico.nome,
      descricao: descricoesFinais, // Salva o array de descrições
      valor: currentServico.valor,
      categoria: currentServico.categoria,
    };

    if (isEditing) {
      const { error } = await supabase.from('servicos').update(servicoToSave).eq('id', currentServico.id);
      if (error) console.error('Erro ao atualizar:', error);
    } else {
      const { error } = await supabase.from('servicos').insert([servicoToSave]);
      if (error) console.error('Erro ao inserir:', error);
    }
    
    fetchServicos();
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      const { error } = await supabase.from('servicos').delete().eq('id', id);
      if (error) console.error('Erro ao deletar:', error);
      fetchServicos();
    }
  };

  // Funções para gerenciar as descrições dinâmicas
  const handleDescricaoChange = (index: number, value: string) => {
    const novasDescricoes = [...descricoes];
    novasDescricoes[index] = value;
    setDescricoes(novasDescricoes);
  };

  const addDescricaoField = () => {
    setDescricoes([...descricoes, '']);
  };

  const removeDescricaoField = (index: number) => {
    const novasDescricoes = descricoes.filter((_, i) => i !== index);
    setDescricoes(novasDescricoes);
  };

  return (
    <>
      <header className="header">
        <h1>Cadastro de Serviços</h1>
        <div className="user-info">
            <span>Bem-vindo, Emerson!</span>
            <div className="user-avatar">E</div>
        </div>
      </header>

      <main className="content">
        <div className="content-box">
          <div className="content-box-header">
            <h2>Gerenciar Serviços</h2>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              <i className="fas fa-plus"></i> Adicionar Novo Serviço
            </button>
          </div>
          
          <table className="services-table">
            <thead>
              <tr>
                <th>Tipo de Serviço</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <tr key={servico.id}>
                  <td>{servico.nome}</td>
                  <td>{Array.isArray(servico.descricao) ? servico.descricao.join(', ') : servico.descricao}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}</td>
                  <td>{servico.categoria}</td>
                  <td>
                    <button onClick={() => handleOpenModal(servico)} className="btn-edit"><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => handleDelete(servico.id)} className="btn-delete"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h2>
            <div className="modal-form-group">
              <label>Nome do Serviço</label>
              <input
                type="text"
                className="modal-input"
                value={currentServico.nome || ''}
                onChange={(e) => setCurrentServico({ ...currentServico, nome: e.target.value })}
              />
            </div>
            
            <div className="modal-form-group">
              <label>Descrições</label>
              {descricoes.map((desc, index) => (
                <div key={index} className="dynamic-field-group">
                  <input
                    type="text"
                    className="modal-input"
                    value={desc}
                    onChange={(e) => handleDescricaoChange(index, e.target.value)}
                  />
                  {index === descricoes.length - 1 ? (
                    <button onClick={addDescricaoField} className="btn-add-dynamic"><i className="fas fa-plus"></i></button>
                  ) : (
                    <button onClick={() => removeDescricaoField(index)} className="btn-remove-dynamic"><i className="fas fa-times"></i></button>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-form-group">
              <label>Valor</label>
              <input
                type="number"
                className="modal-input"
                value={currentServico.valor || ''}
                onChange={(e) => setCurrentServico({ ...currentServico, valor: parseFloat(e.target.value) })}
              />
            </div>
            <div className="modal-form-group">
              <label>Categoria</label>
              <select
                className="modal-input"
                value={currentServico.categoria || ''}
                onChange={(e) => setCurrentServico({ ...currentServico, categoria: e.target.value })}
              >
                <option value="">Selecione</option>
                <option value="Recorrente">Recorrente</option>
                <option value="Eventual">Eventual</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleCloseModal} className="btn-secondary">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
