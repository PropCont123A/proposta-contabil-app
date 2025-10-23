// app/layout.tsx

import './globals.css';
// ✅ A ÚNICA ALTERAÇÃO ESTÁ AQUI
import { AuthProvider } from './context/AuthContext.client'; 

export const metadata = {
  title: 'Proposta Contábil',
  description: 'Sistema de Gestão de Propostas Contábeis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
   );
}
