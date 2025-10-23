// Caminho: app/api/users/set-new-password/route.ts
// ARQUIVO NOVO, COMPLETO (ETAPA 5)

import { createServerClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createServerClient();

  try {
    // 1. Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    // 2. Obter a nova senha do corpo da requisição
    const { newPassword } = await req.json();
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ error: 'A senha é inválida ou muito curta.' }, { status: 400 });
    }

    // 3. Atualizar a senha do usuário no Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    // 4. Atualizar o perfil para remover a exigência de troca de senha
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ requires_password_change: false })
      .eq('id', user.id);

    if (profileError) {
      // Logar o erro, mas considerar a operação um sucesso, pois a senha foi alterada.
      // O middleware pode lidar com isso na próxima requisição.
      console.error("Falha ao desmarcar requires_password_change:", profileError);
    }

    return NextResponse.json({ message: 'Senha atualizada com sucesso!' });

  } catch (error: any) {
    console.error('Erro na API /set-new-password:', error);
    return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
  }
}
