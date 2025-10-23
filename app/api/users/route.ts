// Caminho: app/api/users/route.ts
// ARQUIVO COMPLETO E CORRIGIDO

import { createServerClient } from '@/lib/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// --- GET: Listar todos os usuários do escritório (SEM ALTERAÇÕES) ---
export async function GET() {
  const supabase = await createServerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('escritorio_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Perfil do usuário não encontrado.' }, { status: 404 });
    }

    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name, role, email')
      .eq('escritorio_id', profile.escritorio_id);

    if (usersError) throw usersError;

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Erro na API /api/users (GET):', error);
    return NextResponse.json({ error: 'Erro interno ao buscar usuários.' }, { status: 500 });
  }
}

// --- PATCH: Atualizar um usuário (Nome ou Role) (SEM ALTERAÇÕES) ---
export async function PATCH(req: Request) {
  const supabase = await createServerClient();
  const { targetUserId, fullName, role } = await req.json();

  if (!targetUserId || (!fullName && !role)) {
    return NextResponse.json({ error: 'Dados insuficientes para a atualização.' }, { status: 400 });
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });

    const { data: requesterProfile } = await supabase.from('profiles').select('role, escritorio_id').eq('id', user.id).single();
    if (requesterProfile?.role !== 'GESTOR') {
      return NextResponse.json({ error: 'Apenas gestores podem alterar usuários.' }, { status: 403 });
    }

    const updateData: { full_name?: string; role?: string } = {};
    if (fullName) updateData.full_name = fullName;
    if (role) updateData.role = role;

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', targetUserId)
      .eq('escritorio_id', requesterProfile.escritorio_id);

    if (updateError) throw updateError;

    return NextResponse.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (error: any) {
    console.error('Erro na API /api/users (PATCH):', error);
    return NextResponse.json({ error: 'Erro interno ao atualizar usuário.' }, { status: 500 });
  }
}

// --- DELETE: Excluir um usuário (VERSÃO CORRIGIDA COM A LÓGICA INVERTIDA) ---
export async function DELETE(req: Request) {
  const supabase = await createServerClient();
  
  try {
    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return NextResponse.json({ error: 'ID do usuário alvo não fornecido.' }, { status: 400 });
    }

    // 1. Verificar permissões (lógica mantida)
    const { data: { user: requester } } = await supabase.auth.getUser();
    if (!requester) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }
    if (requester.id === targetUserId) {
      return NextResponse.json({ error: 'Você não pode excluir a si mesmo.' }, { status: 403 });
    }
    const { data: requesterProfile } = await supabase.from('profiles').select('role').eq('id', requester.id).single();
    if (requesterProfile?.role !== 'GESTOR') {
      return NextResponse.json({ error: 'Apenas gestores podem excluir usuários.' }, { status: 403 });
    }

    // ======================= INÍCIO DA CORREÇÃO LÓGICA =======================
    
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 2. ANTES de deletar, quebrar as dependências na tabela 'propostas'
    // Define como NULO todos os campos que apontam para o usuário a ser deletado.
    const { error: updatePropostasError } = await supabaseAdmin
      .from('propostas')
      .update({ 
        user_id: null, 
        vendedor_responsavel: null 
      })
      .or(`user_id.eq.${targetUserId},vendedor_responsavel.eq.${targetUserId}`);

    if (updatePropostasError) {
      console.error("Erro ao quebrar dependências nas propostas:", updatePropostasError);
      throw new Error(`Falha ao preparar propostas para exclusão: ${updatePropostasError.message}`);
    }

    // Adicione aqui a mesma lógica para outras tabelas se necessário (ex: clientes)
    // Exemplo:
    // await supabaseAdmin.from('clientes').update({ user_id: null }).eq('user_id', targetUserId);

    // 3. AGORA, deletar o usuário do sistema de autenticação.
    // A exclusão em cascata para 'public.profiles' agora ocorrerá sem bloqueios.
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

    if (deleteError) {
      if (deleteError.message.includes('User not found')) {
        const { error: profileDeleteError } = await supabaseAdmin.from('profiles').delete().eq('id', targetUserId);
        if (profileDeleteError) throw profileDeleteError;
      } else {
        throw deleteError;
      }
    }
    
    // ======================== FIM DA CORREÇÃO LÓGICA =========================

    return NextResponse.json({ message: 'Usuário excluído com sucesso!' });

  } catch (error: any) {
    console.error('Erro na API /api/users (DELETE):', error);
    return NextResponse.json({ error: `Erro interno ao excluir usuário: ${error.message}` }, { status: 500 });
  }
}
