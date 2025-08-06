import './globals.css';
import Link from 'next/link';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>
        <div className="flex-container">
          {/* ===== MENU LATERAL ===== */}
          <div className="sidebar" id="sidebar">
              <div className="sidebar-header">
                  <div className="logo">Proposta Contábil</div>
              </div>
              <nav className="sidebar-menu">
                  <Link href="/" className="menu-item" data-page="dashboard">
                      <i className="fas fa-chart-line"></i>
                      <span className="menu-text">Dashboard</span>
                  </Link>
                  <Link href="#" className="menu-item" data-page="gerar-proposta">
                      <i className="fas fa-plus-circle"></i>
                      <span className="menu-text">Gerar nova proposta</span>
                  </Link>
                  <Link href="#" className="menu-item" data-page="minhas-propostas">
                      <i className="fas fa-file-alt"></i>
                      <span className="menu-text">Minhas propostas</span>
                  </Link>
                  <Link href="/clientes" className="menu-item" data-page="cadastro-clientes">
                      <i className="fas fa-users"></i>
                      <span className="menu-text">Cadastro de clientes</span>
                  </Link>
                  <Link href="/configuracoes" className="menu-item" data-page="configuracoes">
                      <i className="fas fa-cog"></i>
                      <span className="menu-text">Configurações</span>
                  </Link>
              </nav>
              <div className="toggle-btn" id="toggleBtn">
                  <i className="fas fa-chevron-left"></i>
              </div>
          </div>

          {/* ===== ÁREA PRINCIPAL ===== */}
          <main className="main-content">
            {children} {/* AQUI ENTRA O CONTEÚDO DA PÁGINA ATUAL */}
          </main>
        </div>
      </body>
    </html>
   );
}
