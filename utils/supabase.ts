// ARQUIVO CORRIGIDO: lib/supabaseClient.js
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Para Next.js 13+ com App Router, use createClientComponentClient
// Ele gerencia automaticamente as sessões de autenticação
export const supabase = createClientComponentClient()