// Caminho: middleware.ts
// VERSÃO FINAL - AGORA PERMITE O ACESSO PÚBLICO ÀS PROPOSTAS

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

  // Lista de páginas públicas que não exigem login.
  const publicPaths = [
    '/login',
    '/cadastro',
    '/aceitar-convite',
    '/redefinir-senha'
  ];

  // ✅✅✅ A CORREÇÃO ESTÁ AQUI ✅✅✅
  // Verifica se o caminho começa com /proposta/ OU se está na lista de publicPaths.
  const isPublicPath = 
    request.nextUrl.pathname.startsWith('/proposta/') || 
    publicPaths.includes(request.nextUrl.pathname);

  // Se o usuário NÃO estiver logado E a página que ele tenta acessar NÃO for pública
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se o usuário ESTIVER logado E tentar acessar uma das páginas públicas (exceto a de proposta)
  if (user && publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Lógica para forçar a troca de senha (permanece inalterada)
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('requires_password_change')
      .eq('id', user.id)
      .single();

    const needsPasswordChange = profile?.requires_password_change === true;
    const isOnChangePasswordPage = request.nextUrl.pathname === '/atualizar-senha';

    if (needsPasswordChange && !isOnChangePasswordPage) {
      return NextResponse.redirect(new URL('/atualizar-senha', request.url));
    }

    if (!needsPasswordChange && isOnChangePasswordPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}
