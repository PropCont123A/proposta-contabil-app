// Caminho: app/api/auth/accept-invite/route.ts
// VERSÃO FINAL E SIMPLIFICADA
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token, password, fullName } = await request.json(); // fullName é necessário

  if (!token || !password || !fullName) {
    return NextResponse.json({ error: 'Token, senha e nome são obrigatórios.' }, { status: 400 });
  }

  try {
    // 1. Valida o token na tabela 'invites'
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('invites')
      .select('email, escritorio_id, role, status')
      .eq('id', token)
      .single();

    if (inviteError || !invite) return NextResponse.json({ error: 'Token de convite inválido.' }, { status: 404 });
    if (invite.status === 'accepted') return NextResponse.json({ error: 'Este convite já foi utilizado.' }, { status: 400 });

    // 2. Cria o usuário no Supabase Auth, passando os dados para o gatilho
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: invite.email,
      password: password,
      email_confirm: true,
      user_metadata: { // ✅ A MÁGICA ESTÁ AQUI
        full_name: fullName,
        role: invite.role,
        escritorio_id: invite.escritorio_id
      }
    });

    if (authError || !authData.user) {
      if (authError?.message.includes('User already exists')) {
         return NextResponse.json({ error: 'Um usuário com este e-mail já existe.' }, { status: 409 });
      }
      throw authError;
    }

    // ETAPA 3 FOI REMOVIDA. O GATILHO 'handle_new_user_intelligent' FARÁ O TRABALHO.

    // 4. Marca o convite como aceito
    await supabaseAdmin.from('invites').update({ status: 'accepted' }).eq('id', token);

    return NextResponse.json({ message: 'Usuário cadastrado com sucesso!' });

  } catch (error: any) {
    console.error("Erro no accept-invite:", error.message);
    return NextResponse.json({ error: `Erro inesperado: ${error.message}` }, { status: 500 });
  }
}
