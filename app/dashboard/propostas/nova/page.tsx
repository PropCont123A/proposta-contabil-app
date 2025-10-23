// Caminho: app/dashboard/propostas/nova/page.tsx
// VERSÃO CORRIGIDA - Passando o 'profile' para o formulário

'use client';

import { useReducer } from 'react';
import { useAuth } from '@/app/context/AuthContext'; // 1. Importar o useAuth
import { initialState, proposalReducer } from './state';
import ProposalForm from './components/ProposalForm';
import Header from '../../components/Header';

export default function GerarNovaProposta() {
  const [state, dispatch] = useReducer(proposalReducer, initialState);
  const { profile } = useAuth(); // 2. Obter o perfil do usuário logado

  const handleSave = async (finalState: typeof initialState) => {
    console.log("Função de salvar chamada a partir da página principal.", finalState);
  };

  // 3. Se o perfil ainda não carregou, exibe uma mensagem de carregamento
  if (!profile) {
    return (
      <>
        <Header title="Gerar Nova Proposta" />
        <main className="content">
          <p>Carregando informações do usuário...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Gerar Nova Proposta" />
      <main className="content">
        {/* 4. Passar o 'profile' como uma prop para o ProposalForm */}
        <ProposalForm 
          state={state} 
          dispatch={dispatch} 
          onSave={handleSave} 
          isEditing={false} 
          profile={profile} 
        />
      </main>
    </>
  );
}
