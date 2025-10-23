// Caminho: app/api/invite/route.ts
// VERSÃO FINAL E CORRIGIDA - A única que deve existir.
'use server'; // Garante que este código só rode no servidor

// ✅ 1. IMPORTAÇÃO CORRIGIDA
// Importamos a função com o nome correto: createServerClient
import { createServerClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

// Função auxiliar para pegar a URL do site (sem alterações)
function getSiteURL() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return url.startsWith('http' ) ? url : `https://` + url;
}

export async function POST(request: Request ) {
  // ✅ 2. CHAMADA CORRIGIDA
  // Usamos a função com o nome correto: createServerClient
  const supabase = await createServerClient();

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'O e-mail do convidado é obrigatório.' }, { status: 400 });
    }

    // Pega o GESTOR que está fazendo o convite
    const { data: { user: gestorUser } } = await supabase.auth.getUser();
    if (!gestorUser) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    // Verifica se o usuário é realmente um GESTOR e pega o ID do escritório dele
    const { data: gestorProfile } = await supabase
      .from('profiles')
      .select('escritorio_id, role')
      .eq('id', gestorUser.id)
      .single();

    if (gestorProfile?.role !== 'GESTOR') {
      return NextResponse.json({ error: 'Apenas gestores podem convidar usuários.' }, { status: 403 });
    }
    
    if (!gestorProfile.escritorio_id) {
      return NextResponse.json({ error: 'Gestor não está associado a um escritório.' }, { status: 400 });
    }

    // Insere o convite na nossa tabela 'invites' usando a chave de serviço (admin)
    // Isso é mais seguro e nos dá mais controle.
    const { data: inviteData, error: inviteError } = await supabaseAdmin
      .from('invites')
      .insert({ 
        email: email, 
        escritorio_id: gestorProfile.escritorio_id, 
        role: 'USUARIO_REGULAR' // Todo convite é para um usuário regular
      })
      .select('id') // Pega o ID do convite, que será nosso token
      .single();

    if (inviteError || !inviteData) {
      // Se o e-mail já foi convidado, o Supabase retorna um erro de violação de chave única (código 23505)
      if (inviteError?.code === '23505') {
        return NextResponse.json({ error: 'Um convite para este e-mail já está pendente.' }, { status: 409 });
      }
      return NextResponse.json({ error: `Falha ao criar o convite: ${inviteError?.message}` }, { status: 500 });
    }

    const inviteToken = inviteData.id; // O token é o próprio ID do convite
    
    // Monta o link de aceite, que o frontend vai receber e exibir
    const acceptLink = `${getSiteURL()}/aceitar-convite?token=${inviteToken}`;
    
    return NextResponse.json({
      message: 'Convite enviado com sucesso!',
      link: acceptLink, // O frontend pode usar este link para exibir ao usuário
    });

  } catch (error: any) {
    console.error('Erro inesperado na API de convite:', error);
    return NextResponse.json({ error: 'Ocorreu um erro inesperado no servidor.' }, { status: 500 });
  }
}
