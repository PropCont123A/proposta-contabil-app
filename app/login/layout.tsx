// app/login/layout.tsx
import React from 'react';

// Layout para a rota de login.
// Ele NÃO deve conter <html> ou <body>.
// Ele apenas renderiza os 'children' (a página) diretamente.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
