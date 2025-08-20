// utils/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // O '!' no final diz ao TypeScript que temos certeza que essas variáveis existem.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
