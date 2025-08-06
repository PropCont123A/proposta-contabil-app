'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';

// Tipos para nossos dados
type Cliente = {
  id: number;
  nome_fantasia_ou_nome: string;
};

type Servico = {
  id: number;
  nome: string;
  valor: number;
  categoria: string;
  descricao: string;
};

type ServicoSelecionado = {
  id: number;
  nome: string;
  valor: number;
  categoria: string;
};

export default function NovaPropostaPage() {
  // Estados para controlar o formulário
  const [activeTab, setActiveTab] = useState('dados-cliente');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  
  // Estados para armazenar os dados da proposta
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);
  const [condicoesPagamento, setCondicoesPagamento] = useState('');
  const [validadeDias, setValidadeDias] = useState(30);
  const [status, setStatus] = useState('Em negociação');

  // Busca os dados iniciais (clientes e serviços)
  useEffect(() => {
    async function fetchData() {
      const { data: clientesData } = await supabase.from('clientes').select('id, nome_fantasia_ou_nome');
      const { data: servicosData } = await supabase.from('servicos').select('*');
      if (clientesData) setClientes(clientesData);
      if (servicosData) setServicos(servicosData);
    }
    fetchData();
  }, []);

  // Lógica para selecionar/deselecionar serviços
  const handleServicoToggle = (servico: Servico) => {
    setServicosSelecionados(prev => {
      const isSelected = prev.some(s => s.id === servico.id);
      if (isSelected) {
        return prev.filter(s => s.id !== servico.id);
      } else {
        return [...prev, { id: servico.id, nome: servico.nome, valor: servico.valor, categoria: servico.categoria }];
      }
    });
  };

  // Lógica para salvar a proposta
  const handleSaveProposta = async () => {
    if (!clienteId) {
      alert('Por favor, selecione um cliente.');
      return;
    }

    const totalRecorrente = servicosSelecionados
      .filter(s => s.categoria === 'Recorrente')
      .reduce((acc, s) => acc + s.valor, 0);

    const totalEventual = servicosSelecionados
      .filter(s => s.categoria === 'Eventual')
      .reduce((acc, s) => acc + s.valor, 0);

    const { error } = await supabase.from('propostas').insert([{
      cliente_id: clienteId,
      servicos_selecionados: servicosSelecionados,
      valor_total_recorrente: totalRecorrente,
      valor_total_eventual: totalEventual,
      condicoes_pagamento: condicoesPagamento,
      validade_dias: validadeDias,
      status: status,
    }]);

    if (error) {
      alert('Erro ao salvar proposta: ' + error.message);
    } else {
      alert('Proposta salva com sucesso!');
      // Limpar o formulário ou redirecionar
    }
  };

  // Componente principal
  return (
    <>
      <header className="header">
        <h1>Gerar Nova Proposta</h1>
      </header>

      <main className="content">
        <div className="tabs-container">
          {/* Cabeçalho das Abas */}
          <div className="tabs-header">
            <button className={`tab-button ${activeTab === 'dados-cliente' ? 'active' : ''}`} onClick={() => setActiveTab('dados-cliente')}>Dados do cliente</button>
            <button className={`tab-button ${activeTab === 'servicos' ? 'active' : ''}`} onClick={() => setActiveTab('servicos')}>Serviços</button>
            <button className={`tab-button ${activeTab === 'forma-pagamento' ? 'active' : ''}`} onClick={() => setActiveTab('forma-pagamento')}>Condições de pagamento</button>
            <button className={`tab-button ${activeTab === 'resumo' ? 'active' : ''}`} onClick={() => setActiveTab('resumo')}>Resumo da proposta</button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="tab-content" style={{ display: activeTab === 'dados-cliente' ? 'block' : 'none' }}>
            <div className="form-group">
              <label>Selecione o Cliente</label>
              <select className="form-control" onChange={(e) => setClienteId(Number(e.target.value))}>
                <option value="">Selecione...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome_fantasia_ou_nome}</option>
                ))}
              </select>
            </div>
            <div className="form-navigation">
              <div></div>
              <button type="button" className="btn-next" onClick={() => setActiveTab('servicos')}>Próximo</button>
            </div>
          </div>

          <div className="tab-content" style={{ display: activeTab === 'servicos' ? 'block' : 'none' }}>
            {servicos.map(servico => (
              <div key={servico.id} className="service-item">
                <label>
                  <input
                    type="checkbox"
                    checked={servicosSelecionados.some(s => s.id === servico.id)}
                    onChange={() => handleServicoToggle(servico)}
                  />
                  <strong>{servico.nome}</strong> (R$ {servico.valor.toFixed(2)}) - <em>{servico.categoria}</em>
                  <p style={{ marginLeft: '20px', fontSize: '12px', color: '#666' }}>{servico.descricao}</p>
                </label>
              </div>
            ))}
            <div className="form-navigation">
              <button type="button" className="btn-prev" onClick={() => setActiveTab('dados-cliente')}>Anterior</button>
              <button type="button" className="btn-next" onClick={() => setActiveTab('forma-pagamento')}>Próximo</button>
            </div>
          </div>

          <div className="tab-content" style={{ display: activeTab === 'forma-pagamento' ? 'block' : 'none' }}>
             <div className="form-group">
                <label>Condições de Pagamento</label>
                <textarea className="form-control" rows={4} value={condicoesPagamento} onChange={(e) => setCondicoesPagamento(e.target.value)} placeholder="Ex: 50% de entrada, 50% na entrega."></textarea>
            </div>
            <div className="form-group">
                <label>Validade da proposta (dias)</label>
                <input type="number" className="form-control" value={validadeDias} onChange={(e) => setValidadeDias(Number(e.target.value))} />
            </div>
             <div className="form-group">
                <label>Status Inicial</label>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Em negociação">Em negociação</option>
                    <option value="Contratado">Contratado</option>
                    <option value="Recusado">Recusado</option>
                </select>
            </div>
            <div className="form-navigation">
              <button type="button" className="btn-prev" onClick={() => setActiveTab('servicos')}>Anterior</button>
              <button type="button" className="btn-next" onClick={() => setActiveTab('resumo')}>Próximo</button>
            </div>
          </div>
          
          <div className="tab-content" style={{ display: activeTab === 'resumo' ? 'block' : 'none' }}>
             <h3>Resumo da Proposta</h3>
             {/* Aqui podemos adicionar um resumo mais detalhado no futuro */}
             <button onClick={handleSaveProposta} className="btn-primary">Salvar Proposta</button>
             <div className="form-navigation">
                <button type="button" className="btn-prev" onClick={() => setActiveTab('forma-pagamento')}>Anterior</button>
             </div>
          </div>

        </div>
      </main>
    </>
  );
}
