// app/(dashboard)/propostas/page.tsx (VERSÃO LIMPA E CORRETA)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import ProposalsTable from '../components/ProposalsTable';

// Interface para a proposta, refletindo a consulta que fazemos
export interface Proposta {
  id: number;
  cliente_nome: string | null;
  data_proposta: string;
  status: string;
  valor_total_recorrente: number;
  valor_total_eventual: number;
}

export default function MinhasPropostasPage() {
  const supabase = createClient();
  const { user } = useAuth();
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);

const fetchPropostas = useCallback(async () => {
    if (!user) {
      console.log("Usuário não autenticado, busca de propostas abortada.");
      setLoading(false);
      return;
    }
    setLoading(true);
    
    // Consulta corrigida para ser mais robusta
    const { data, error } = await supabase
      .from('propostas')
      .select(`
        id,
        data_proposta,
        status,
        valor_total_recorrente,
        valor_total_eventual,
        cliente_nome_avulso,
        clientes ( id, nome_fantasia_ou_nome )
      `)
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (error) {
      // Agora, vamos logar o erro completo para diagnóstico
      console.error('Erro detalhado ao buscar propostas:', error);
      setPropostas([]);
    } else if (data) {
      // Mapeamento seguro dos dados recebidos
      const propostasFormatadas = data.map(p => {
        // O Supabase retorna a tabela relacionada como um objeto ou array.
        // Vamos tratar ambos os casos para segurança.
        const clienteData = Array.isArray(p.clientes) ? p.clientes[0] : p.clientes;
        
        return {
          id: p.id,
          data_proposta: p.data_proposta,
          status: p.status,
          valor_total_recorrente: p.valor_total_recorrente,
          valor_total_eventual: p.valor_total_eventual,
          // A lógica para definir o nome do cliente fica mais clara
          cliente_nome: clienteData?.nome_fantasia_ou_nome || p.cliente_nome_avulso || 'Cliente não vinculado',
        };
      });
      setPropostas(propostasFormatadas);
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchPropostas();
  }, [fetchPropostas]);

  const handleDelete = async (id: number) => {
    if (confirm(`Tem certeza que deseja excluir a proposta #${id}?`)) {
      // Primeiro, exclui os itens da proposta
      await supabase.from('proposta_itens').delete().match({ proposta_id: id });
      // Depois, exclui a proposta principal
      const { error } = await supabase.from('propostas').delete().match({ id });

      if (error) {
        alert('Falha ao excluir a proposta.');
      } else {
        // Atualiza a lista de propostas na tela
        setPropostas(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  return (
    <>
      <header className="header">
        <h1>Minhas Propostas</h1>
        <div className="user-info">
          <span>Bem-vindo, Emerson!</span>
          <div className="user-avatar">E</div>
        </div>
      </header>

      <main className="content">
        <div className="content-box">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>Carregando propostas...</p>
          ) : (
            <ProposalsTable propostas={propostas} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </>
  );
}
