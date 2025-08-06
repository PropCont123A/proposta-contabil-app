// app/clientes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Definindo o tipo para um Cliente, com todos os campos da tabela
type Cliente = {
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

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Partial<Cliente>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Função para buscar os clientes no Supabase
  async function fetchClientes() {
    const { data, error } = await supabase.from('clientes').select('*').order('id', { ascending: true });
    if (error) {
      console.error('Erro ao buscar clientes:', error);
    } else {
      setClientes(data);
    }
  }

  // Executa a busca assim que a página carrega
  useEffect(() => {
    fetchClientes();
  }, []);

  // Funções para controlar o Modal
  const handleOpenModal = (cliente: Partial<Cliente> = {}) => {
    setIsEditing(!!cliente.id);
    setCurrentCliente(cliente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCliente({});
  };

  // Função para Salvar (Criar ou Atualizar)
  const handleSave = async () => {
    // Pega todos os campos do formulário para salvar
    const clienteToSave = {
      tipo_pessoa: currentCliente.tipo_pessoa,
      cnpj_cpf: currentCliente.cnpj_cpf,
      nome_fantasia_ou_nome: currentCliente.nome_fantasia_ou_nome,
      email: currentCliente.email,
      telefone: currentCliente.telefone,
      endereco: currentCliente.endereco,
      cidade: currentCliente.cidade,
      estado: currentCliente.estado,
      cep: currentCliente.cep,
    };

    if (isEditing) {
      // Modo de Edição
      const { error } = await supabase.from('clientes').update(clienteToSave).eq('id', currentCliente.id);
      if (error) console.error('Erro ao atualizar cliente:', error);
    } else {
      // Modo de Criação
      const { error } = await supabase.from('clientes').insert([clienteToSave]);
      if (error) console.error('Erro ao inserir cliente:', error);
    }
    
    await fetchClientes(); // Re-busca os dados para atualizar a tabela
    handleCloseModal(); // Fecha o modal
  };

  // Função para Deletar
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) console.error('Erro ao deletar cliente:', error);
      await fetchClientes(); // Re-busca os dados
    }
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
            <h2>Gerenciar Clientes</h2>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              <i className="fas fa-plus"></i> Adicionar Novo Cliente
            </button>
          </div>
          
          <table className="services-table">
            <thead>
              <tr>
                <th>Nome / Nome Fantasia</th>
                <th>CNPJ / CPF</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome_fantasia_ou_nome}</td>
                  <td>{cliente.cnpj_cpf}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td>
                    <button onClick={() => handleOpenModal(cliente)} className="btn-edit"><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => handleDelete(cliente.id)} className="btn-delete"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal para Adicionar/Editar Cliente */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
            
            {/* Campos do formulário */}
            <div className="modal-form-group">
              <label>Tipo de Pessoa</label>
              <select className="modal-input" value={currentCliente.tipo_pessoa || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, tipo_pessoa: e.target.value })}>
                <option value="">Selecione</option>
                <option value="Jurídica">Jurídica</option>
                <option value="Física">Física</option>
              </select>
            </div>
            <div className="modal-form-group">
              <label>Nome / Nome Fantasia</label>
              <input type="text" className="modal-input" value={currentCliente.nome_fantasia_ou_nome || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, nome_fantasia_ou_nome: e.target.value })} />
            </div>
            <div className="modal-form-group">
              <label>CNPJ / CPF</label>
              <input type="text" className="modal-input" value={currentCliente.cnpj_cpf || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, cnpj_cpf: e.target.value })} />
            </div>
            <div className="modal-form-group">
              <label>Email</label>
              <input type="email" className="modal-input" value={currentCliente.email || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, email: e.target.value })} />
            </div>
            <div className="modal-form-group">
              <label>Telefone</label>
              <input type="tel" className="modal-input" value={currentCliente.telefone || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, telefone: e.target.value })} />
            </div>
            <div className="modal-form-group">
              <label>Endereço</label>
              <input type="text" className="modal-input" value={currentCliente.endereco || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, endereco: e.target.value })} />
            </div>
            <div className="modal-form-group">
              <label>Cidade</label>
              <input type="text" className="modal-input" value={currentCliente.cidade || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, cidade: e.target.value })} />
            </div>
            <div className="modal-form-group">
              <label>Estado</label>
              <input type="text" className="modal-input" value={currentCliente.estado || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, estado: e.target.value })} />
            </div>
            <div className="modal-form-group">
              <label>CEP</label>
              <input type="text" className="modal-input" value={currentCliente.cep || ''} onChange={(e) => setCurrentCliente({ ...currentCliente, cep: e.target.value })} />
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
