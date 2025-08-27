// app/(dashboard)/propostas/nova/page.tsx
'use client';

import { useReducer } from 'react';
import { initialState, proposalReducer } from './state';
import ProposalForm from './components/ProposalForm';

export default function GerarNovaProposta() {
  const [state, dispatch] = useReducer(proposalReducer, initialState);

  return (
    <>
      <header className="header">
        <h1>Gerar Nova Proposta</h1>
        <div className="user-info">
          <span>Bem-vindo, Emerson!</span>
          <div className="user-avatar">E</div>
        </div>
      </header>
      <main className="content">
        <ProposalForm state={state} dispatch={dispatch} />
      </main>
    </>
  );
}
