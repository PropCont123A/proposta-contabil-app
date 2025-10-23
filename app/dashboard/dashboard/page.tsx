// app/dashboard/page.tsx
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton'; // CAMINHO CORRIGIDO PARA A SUA ESTRUTURA

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton /> {/* O botão de Sair */}
      </div>
      <p className="mb-6">Bem-vindo ao seu painel de controle!</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="flex space-x-4">
          <Link href="/propostas/nova" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Criar Nova Proposta
          </Link>
          <Link href="/configuracoes/escritorio" className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
            Configurar Escritório
          </Link>
        </div>
      </div>
    </div>
  );
}
