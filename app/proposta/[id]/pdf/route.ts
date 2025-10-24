// Caminho: app/api/proposta/[id]/pdf/route.ts
// VERSÃO CORRIGIDA POR MANUS (AGORA SIM, O ARQUIVO CERTO)

// ✅ 1. IMPORTAÇÃO CORRIGIDA
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Tipagem dos dados que esperamos receber da nossa função SQL
type PropostaCompletaPDF = {
  escritorios: { nome_fantasia: string; };
  clientes: { nome_fantasia_ou_nome: string; };
  proposta_itens: { nome_servico: string; valor_servico: number; }[];
  vendedor: { full_name: string; };
};

// Função para buscar os dados
// ✅ 2. A FUNÇÃO AGORA RECEBE O CLIENTE SUPABASE COMO PARÂMETRO
async function getPropostaData(supabase: any, id: string): Promise<PropostaCompletaPDF | null> {
  const { data, error } = await supabase
    .rpc('get_public_proposal', { share_id_param: id })
    .single();

  if (error) {
    console.error("Erro ao buscar dados para o PDF via RPC:", error);
    return null;
  }
  return data as PropostaCompletaPDF;
}


// A função principal que gera o PDF
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const propostaId = params.id;

  // ✅ 3. INICIALIZAÇÃO CORRIGIDA
  const supabase = createRouteHandlerClient({ cookies });
  
  // Passa o cliente supabase para a função de busca
  const proposta = await getPropostaData(supabase, propostaId);

  if (!proposta) {
    return new NextResponse('Proposta não encontrada', { status: 404 });
  }

  // --- INÍCIO DA CRIAÇÃO DO PDF ---
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Cores
  const primaryColor = rgb(107 / 255, 33 / 255, 168 / 255); // Roxo
  const textColor = rgb(0.2, 0.2, 0.2);

  // --- CONSTRUÇÃO DO LAYOUT (VERSÃO 1.0 - BÁSICA) ---
  
  // Cabeçalho
  page.drawText('Proposta Comercial', {
    x: 50,
    y: height - 60,
    font: fontBold,
    size: 24,
    color: primaryColor,
  });

  page.drawText(proposta.escritorios.nome_fantasia, {
    x: 50,
    y: height - 85,
    font: font,
    size: 16,
    color: textColor,
  });

  // Informações do Vendedor
  page.drawText(`Vendedor Responsável: ${proposta.vendedor?.full_name || 'Não informado'}`, {
    x: 50,
    y: height - 120,
    font: font,
    size: 12,
  });

  // --- FIM DA CRIAÇÃO DO PDF ---

  // Salva o PDF em um buffer de bytes
  const pdfBytes = await pdfDoc.save();

  // Retorna o PDF para o navegador
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="proposta_${proposta.clientes.nome_fantasia_ou_nome.replace(/\s/g, '_')}.pdf"`,
    },
  });
}
