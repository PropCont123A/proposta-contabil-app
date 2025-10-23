// Caminho: lib/client.ts (CORRIGIDO)

import { createBrowserClient as supabaseCreateBrowserClient } from '@supabase/ssr';

// Renomeado para ser explícito
export function createBrowserClient() {
  return supabaseCreateBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
