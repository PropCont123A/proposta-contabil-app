// app/propostas/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // 1. LINHA ANTIGA REMOVIDA
import { createBrowserClient } from '@supabase/ssr'; // 1. LINHA NOVA ADICIONADA
import ProposalsTable from '../components/ProposalsTable';

// O tipo da Proposta
export interface Proposta {
  id: number;
  clientes_contato: string;
  empresas: string;
  data_proposta: string;
  status: string;
  valor_total_recorrente: number;
  valor_total_eventual: number;
}

export default function MinhasPropostasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 2. INICIALIZAÇÃO DO SUPABASE ATUALIZADA
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  //
  // ===== NENHUMA OUTRA MUDANÇA NECESSÁRIA =====
  // Todo o resto do seu código permanece idêntico.
  //

  const fetchPropostas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('propostas')
      .select(`id,clientes_contato,empresas,data_proposta,status,valor_total_recorrente,valor_total_eventual`);

    if (error) {
      console.error('Erro ao buscar propostas:', error);
    } else {
      setPropostas(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPropostas();
  }, [fetchPropostas]);

  const handleDelete = async (id: number) => {
    if (confirm(`Tem certeza que deseja excluir a proposta #${id}?`)) {
      const { error } = await supabase.from('propostas').delete().match({ id });
      if (error) {
        alert('Falha ao excluir a proposta.');
      } else {
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
          {/* O content-box-header foi removido, pois a barra de ferramentas agora está na tabela */}
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Carregando propostas...</p>
          ) : (
            <ProposalsTable propostas={propostas} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </>
  );
}
