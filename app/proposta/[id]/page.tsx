// Caminho: app/proposta/[id]/page.tsx
// VERSÃO 3.1 - CORREÇÃO DE TIPAGEM PARA BUILD

import { createServerClient } from '@/lib/server';
import { notFound } from 'next/navigation';

import TemplateModerno from './templates/moderno/TemplateModerno';
import TemplatePadrao from './templates/padrao/TemplatePadrao'; 

// --- TIPAGENS (sem alteração) ---
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

// --- INTERFACE PARA AS PROPS DA PÁGINA (A CORREÇÃO) ---
interface PaginaPropostaProps {
  params: {
    id: string;
  };
}

async function getProposta(id: string): Promise<PropostaCompleta | null> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .rpc('get_public_proposal', { share_id_param: id })
    .single();

  if (error) {
    console.error("Erro CRÍTICO ao buscar proposta pública via RPC:", error);
    return null;
  }

  return data as PropostaCompleta;
}

// --- FUNÇÃO DA PÁGINA COM A TIPAGEM CORRIGIDA ---
export default async function PaginaPropostaPublica({ params }: PaginaPropostaProps) {
  const proposta = await getProposta(params.id);

  if (!proposta || !proposta.escritorios) {
    notFound();
  }

  const templateId = proposta.escritorios.template_selecionado;

  switch (templateId) {
    case 'padrao':
      return <TemplatePadrao proposta={proposta} />;
    case 'moderno':
      return <TemplateModerno proposta={proposta} />;
    default:
      return <TemplateModerno proposta={proposta} />;
  }
}
