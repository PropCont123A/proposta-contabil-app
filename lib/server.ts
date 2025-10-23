// Caminho: lib/server.ts (CORRIGIDO)

import { createServerClient as supabaseCreateServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Renomeado para ser explícito
export const createServerClient = async () => {
  const cookieStore = await cookies();
  
  return supabaseCreateServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) { /* Ignorar erros */ }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) { /* Ignorar erros */ }
        },
      },
    }
  );
};
