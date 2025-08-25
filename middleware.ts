// middleware.ts - CÓDIGO COMPLETO E CORRIGIDO
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove: (name: string, options: CookieOptions) => {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ===== AQUI ESTÁ A CORREÇÃO PRINCIPAL =====
  // Lista de páginas públicas que não exigem login
  const publicPaths = ['/login', '/cadastro'];

  // Se o usuário NÃO estiver logado E a página que ele tenta acessar NÃO for uma das páginas públicas
  if (!user && !publicPaths.includes(request.nextUrl.pathname)) {
    // Redireciona para a página de login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se o usuário ESTIVER logado E tentar acessar a página de login ou cadastro
  if (user && publicPaths.includes(request.nextUrl.pathname)) {
    // Redireciona para o dashboard (página inicial)
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos, exceto os que são obviamente arquivos estáticos ou rotas de API.
     * A lógica de quais páginas são públicas ou privadas está agora dentro da função middleware.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}
