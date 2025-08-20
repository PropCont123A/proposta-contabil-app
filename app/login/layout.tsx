// app/login/layout.tsx
import React from 'react';

// Este layout simples garante que a página de login não tenha o menu lateral.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
