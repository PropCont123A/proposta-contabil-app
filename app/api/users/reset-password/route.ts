// Caminho: app/api/users/reset-password/route.ts
// ARQUIVO COMPLETO E ATUALIZADO (ETAPA 2)

import { createServerClient } from '@/lib/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { targetUserId } = await req.json();

    if (!targetUserId) {
        return NextResponse.json({ error: 'ID do usuário alvo não fornecido.' }, { status: 400 });
    }

    const supabase = await createServerClient();
    try {
        const { data: { user: requester } } = await supabase.auth.getUser();
        if (!requester) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });

        const { data: requesterProfile } = await supabase.from('profiles').select('role').eq('id', requester.id).single();
        if (requesterProfile?.role !== 'GESTOR') {
            return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
        }

        const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

        const temporaryPassword = Math.random().toString(36).slice(-10) + "A1!";

        // 1. Atualiza a senha do usuário no Auth
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            targetUserId,
            { password: temporaryPassword }
        );

        if (updateError) throw updateError;

        // ✅ ETAPA 2: Sinaliza que o usuário precisa trocar a senha no próximo login
        const { error: profileUpdateError } = await supabaseAdmin
            .from('profiles')
            .update({ requires_password_change: true })
            .eq('id', targetUserId);

        if (profileUpdateError) {
            // Loga o erro, mas continua, pois a senha já foi alterada
            console.error("Falha ao marcar requires_password_change:", profileUpdateError);
        }

        return NextResponse.json({ 
            message: `Senha provisória gerada com sucesso!`,
            temporaryPassword: temporaryPassword
        });

    } catch (error: any) {
        console.error('Erro na API /reset-password:', error);
        return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
    }
}
