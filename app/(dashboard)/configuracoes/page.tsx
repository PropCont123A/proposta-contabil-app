// app/configuracoes/page.tsx
import Link from 'next/link';

export default function ConfiguracoesPage() {
  return (
    <>
      <header className="header">
        <h1>Configurações</h1>
        <div className="user-info">
            <span>Bem-vindo, Emerson!</span>
            <div className="user-avatar">E</div>
        </div>
      </header>

      <main className="content">
        <div className="config-buttons">
            {/* LINHA CORRIGIDA ABAIXO */}
            <Link href="/configuracoes/escritorio" className="config-button">
                <i className="fas fa-building"></i>
                <h3>Cadastro do Escritório</h3>
                <p>Gerencie as informações da sua empresa, logotipo e layout.</p>
            </Link>
            
            <Link href="#" className="config-button">
                <i className="fas fa-user-friends"></i>
                <h3>Cadastro de Usuários</h3>
                <p>Gerencie os usuários com acesso à plataforma e suas permissões.</p>
            </Link>
            
            <Link href="/configuracoes/servicos" className="config-button">
                <i className="fas fa-handshake"></i>
                <h3>Cadastro de Serviços</h3>
                <p>Adicione e organize os serviços contábeis oferecidos pela sua empresa.</p>
            </Link>
            
            <Link href="#" className="config-button">
                <i className="fas fa-file-contract"></i>
                <h3>Templates</h3>
                <p>Personalize os modelos de propostas em PDF e link web.</p>
            </Link>
        </div>
      </main>
    </>
  );
}
