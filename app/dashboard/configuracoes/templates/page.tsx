// Caminho: app/dashboard/configuracoes/templates/page.tsx
// VERSÃO 2.0 - CORRIGIDO E COMPLETO (COM CARD "PADRÃO")

'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import Header from '../../components/Header';
import './templates.css';
import { toast } from 'react-toastify'; // Usando toast para notificações mais elegantes

// ✅ 1. ADICIONADO O TEMPLATE "PADRÃO" À LISTA
const TEMPLATES_DISPONIVEIS = [
  {
    id: 'moderno',
    nome: 'Moderno',
    descricao: 'Um layout limpo e direto, focado nos números e na clareza das informações.',
    imagem: '/images/template-moderno.png',
    desabilitado: false, // Garantindo que seja clicável
  },
  {
    id: 'padrao',
    nome: 'Padrão',
    descricao: 'Layout clássico com seções expansíveis (acordeão), ideal para detalhar serviços.',
    imagem: '/images/template-padrao.png',
    desabilitado: false, // É um template ativo e clicável
  },
  {
    id: 'consultivo',
    nome: 'Consultivo (Em Breve)',
    descricao: 'Um design focado em textos e explicações, ideal para propostas de consultoria.',
    imagem: '/images/template-consultivo.png',
    desabilitado: true,
  },
  {
    id: 'criativo',
    nome: 'Criativo (Em Breve)',
    descricao: 'Um layout com mais apelo visual, cores e elementos gráficos.',
    imagem: '/images/template-criativo.png',
    desabilitado: true,
  },
];

export default function PaginaTemplates() {
  const supabase = createBrowserClient();
  const { profile, loading: authLoading } = useAuth();
  
  const [templateAtivo, setTemplateAtivo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchTemplateAtivo() {
      if (!profile?.escritorio_id) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('escritorios')
        .select('template_selecionado')
        .eq('id', profile.escritorio_id)
        .single();

      if (error) {
        console.error("Erro ao buscar template ativo:", error);
        toast.error("Não foi possível carregar o template ativo.");
      } else if (data) {
        setTemplateAtivo(data.template_selecionado);
      }
      setIsLoading(false);
    }

    if (!authLoading) {
      fetchTemplateAtivo();
    }
  }, [authLoading, profile, supabase]);

  // ✅ 2. FUNÇÃO DE SALVAR ATUALIZADA PARA USAR 'TOAST'
  const handleSelecionarTemplate = async (templateId: string) => {
    if (!profile?.escritorio_id || isSaving) return;

    setIsSaving(true);
    toast.info("Salvando sua escolha...");

    const { error } = await supabase
      .from('escritorios')
      .update({ template_selecionado: templateId })
      .eq('id', profile.escritorio_id);

    if (error) {
      toast.error(`Erro ao salvar: ${error.message}`);
    } else {
      setTemplateAtivo(templateId);
      toast.success('Template atualizado com sucesso!');
    }
    setIsSaving(false);
  };

  if (isLoading || authLoading) {
    return (
      <>
        <Header title="Templates de Proposta" />
        <main className="content">
          <p>Carregando...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Templates de Proposta" description="Escolha o visual das suas propostas em link e PDF." />
      <main className="content">
        <div className="templates-grid">
          {TEMPLATES_DISPONIVEIS.map((template) => (
            <div
              key={template.id}
              className={`template-card ${templateAtivo === template.id ? 'active' : ''} ${template.desabilitado ? 'disabled' : ''}`}
              onClick={() => !template.desabilitado && handleSelecionarTemplate(template.id)}
            >
              <div className="template-imagem-wrapper">
                <div className="template-imagem-placeholder" style={{ backgroundColor: templateAtivo === template.id ? '#B733F0' : '#e5e7eb' }}></div>
              </div>
              <div className="template-info">
                <h3>{template.nome}</h3>
                <p>{template.descricao}</p>
              </div>
              {templateAtivo === template.id && (
                <div className="template-tag-ativo">ATIVO</div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
