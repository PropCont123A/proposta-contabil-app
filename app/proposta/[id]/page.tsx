// Caminho: app/proposta/[id]/page.tsx
// VERSÃO 3.0 - LÓGICA DE SELEÇÃO REATIVADA

import { createServerClient } from '@/lib/server';
import { notFound } from 'next/navigation';

// Importa nossos componentes de template
import TemplateModerno from './templates/moderno/TemplateModerno';
import TemplatePadrao from './templates/padrao/TemplatePadrao'; 

type PropostaCompleta = {
  id: number;
  data_proposta: string;
  valor_recorrente: number;
  valor_eventual: number;
  condicoes_pagamento: string;
  informacoes_complementares: string;
  validade_dias: number;
  escritorios: { 
    razao_social: string; 
    logo_url: string | null;
    template_selecionado: string;
    sobre_nos: string | null;
    site: string | null;
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    whatsapp: string | null;
  } | null;
  clientes: { nome_fantasia_ou_nome: string; } | null;
  nome_cliente_avulso: string;
  telefone: string | null;
  proposta_itens: { 
    id: number;
    nome_servico: string; 
    valor_servico: number; 
    categoria_servico: 'Recorrente' | 'Eventual';
    descricao_servico: string | null;
  }[];
};

async function getProposta(id: string): Promise<PropostaCompleta | null> {
  const supabase = await createServerClient();
  
  // ✅✅✅ CHAMANDO A NOVA FUNÇÃO SEGURA ✅✅✅
  const { data, error } = await supabase
    .rpc('get_public_proposal', { share_id_param: id })
    .single();

  if (error) {
    console.error("Erro CRÍTICO ao buscar proposta pública via RPC:", error);
    return null;
  }

  // O retorno da função RPC é um único objeto JSON, então já temos os dados aninhados.
  return data as PropostaCompleta;
}

export default async function PaginaPropostaPublica({ params }: { params: { id: string } }) {
  const proposta = await getProposta(params.id);

  if (!proposta || !proposta.escritorios) {
    notFound();
  }

  // ✅✅✅ LÓGICA REATIVADA ✅✅✅
  // Agora o sistema vai ler o 'template_selecionado' do banco de dados
  // e carregar o componente correto.
  const templateId = proposta.escritorios.template_selecionado;

  switch (templateId) {
    case 'padrao':
      return <TemplatePadrao proposta={proposta} />;
    case 'moderno':
      return <TemplateModerno proposta={proposta} />;
    default:
      // Se o valor for nulo ou inesperado, usa o Moderno como padrão.
      return <TemplateModerno proposta={proposta} />;
  }
}
