// lib/supabaseClient.ts - CORRIGIDO PARA USAR A BIBLIOTECA NOVA

import { createBrowserClient } from '@supabase/ssr';

// ATENÇÃO: Esta função DEVE ser chamada dentro de um componente de cliente ('use client')
// ou dentro de um hook. Não pode ser chamada no topo de um arquivo de servidor.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
