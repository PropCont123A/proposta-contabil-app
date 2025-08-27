'use client';

import { Cliente } from '../../clientes/page';
import { Servico } from '../../configuracoes/servicos/page';

// --- INTERFACES ---
export interface PropostaItem extends Servico {
  idUnico: string;
}

// 1. INTERFACE UNIFICADA
export interface ProposalState {
  etapa: number;
  // Aba 1: Dados do Cliente
  clienteId: number | null; // Campo para o ID do cliente vinculado
  tipoNegociacao: string;
  statusNegociacao: string;
  vendedorResponsavel: string;
  nomesCliente: string[];
  nomesEmpresa: string[];
  telefone: string;
  dataProposta: string;
  validadeDias: number;
  // Aba 2: Serviços
  servicosSelecionados: PropostaItem[];
  valores: { recorrente: number; eventual: number };
  // Aba 3: Condições
  condicoesPagamento: string;
  informacoesComplementares: string;
}

// 2. ESTADO INICIAL UNIFICADO
export const initialState: ProposalState = {
  etapa: 1,
  clienteId: null, // Começa como nulo
  tipoNegociacao: 'cliente_novo',
  statusNegociacao: 'Rascunho',
  vendedorResponsavel: '',
  nomesCliente: [''],
  nomesEmpresa: [''],
  telefone: '',
  dataProposta: new Date().toISOString().split('T')[0],
  validadeDias: 10,
  servicosSelecionados: [],
  valores: { recorrente: 0, eventual: 0 },
  condicoesPagamento: '',
  informacoesComplementares: '',
};

// 3. AÇÕES UNIFICADAS
export type ProposalAction =
  | { type: 'IR_PARA_ETAPA'; payload: number }
  | { type: 'ATUALIZAR_CAMPO_PROPOSTA'; payload: { campo: keyof ProposalState; valor: any } }
  | { type: 'VINCULAR_CLIENTE'; payload: Cliente }
  | { type: 'DESVINCULAR_CLIENTE' }
  | { type: 'ADICIONAR_SERVICO'; payload: Servico }
  | { type: 'DUPLICAR_SERVICO'; payload: { idUnico: string } }
  | { type: 'REMOVER_SERVICO'; payload: { idUnico: string } }
  | { type: 'EDITAR_SERVICO'; payload: { idUnico: string; changes: Partial<PropostaItem> } }
  | { type: 'REORDENAR_SERVICOS'; payload: PropostaItem[] }
  | { type: 'RESETAR_ESTADO' };

// 4. REDUCER UNIFICADO
export function proposalReducer(state: ProposalState, action: ProposalAction): ProposalState {
  const calcularValores = (servicos: PropostaItem[]) => {
    return servicos.reduce(
      (acc, servico) => {
        const valor = Number(servico.valor) || 0;
        if (servico.categoria === 'Recorrente') acc.recorrente += valor;
        else acc.eventual += valor;
        return acc;
      },
      { recorrente: 0, eventual: 0 }
    );
  };

  switch (action.type) {
    case 'IR_PARA_ETAPA':
      return { ...state, etapa: action.payload };

    case 'ATUALIZAR_CAMPO_PROPOSTA':
      return { ...state, [action.payload.campo]: action.payload.valor };

    case 'VINCULAR_CLIENTE': {
      const cliente = action.payload;
      return {
        ...state,
        clienteId: cliente.id, // Armazena o ID
        nomesCliente: [cliente.pessoa_contato || ''],
        nomesEmpresa: [cliente.nome_fantasia_ou_nome || ''],
        telefone: cliente.telefone || '',
      };
    }

    case 'DESVINCULAR_CLIENTE':
      return { ...state, clienteId: null }; // Limpa o ID, mas mantém os dados digitados

    case 'ADICIONAR_SERVICO': {
      const novoItem: PropostaItem = { ...action.payload, idUnico: `item-${Date.now()}` };
      const novosServicos = [...state.servicosSelecionados, novoItem];
      return { ...state, servicosSelecionados: novosServicos, valores: calcularValores(novosServicos) };
    }
    
    case 'DUPLICAR_SERVICO': {
      const servicoOriginal = state.servicosSelecionados.find(s => s.idUnico === action.payload.idUnico);
      if (!servicoOriginal) return state;
      const index = state.servicosSelecionados.findIndex(s => s.idUnico === action.payload.idUnico);
      const servicoDuplicado: PropostaItem = { ...servicoOriginal, idUnico: `item-${Date.now()}` };
      
      const servicosAtualizados = [...state.servicosSelecionados];
      servicosAtualizados.splice(index + 1, 0, servicoDuplicado);

      return { ...state, servicosSelecionados: servicosAtualizados, valores: calcularValores(servicosAtualizados) };
    }

    case 'REMOVER_SERVICO': {
      const novosServicos = state.servicosSelecionados.filter(s => s.idUnico !== action.payload.idUnico);
      return { ...state, servicosSelecionados: novosServicos, valores: calcularValores(novosServicos) };
    }

    case 'EDITAR_SERVICO': {
      const servicosAtualizados = state.servicosSelecionados.map(s =>
        s.idUnico === action.payload.idUnico ? { ...s, ...action.payload.changes } : s
      );
      return { ...state, servicosSelecionados: servicosAtualizados, valores: calcularValores(servicosAtualizados) };
    }

    case 'REORDENAR_SERVICOS':
      return { ...state, servicosSelecionados: action.payload };

    case 'RESETAR_ESTADO':
      // Ao resetar, garanta que o novo estado inicial seja usado
      return { 
        ...initialState, 
        // Se precisar manter algo, como o vendedor, faça aqui:
        // vendedorResponsavel: state.vendedorResponsavel 
      };

    default:
      return state;
  }
}

// Re-exportar tipos necessários
export type { Cliente };
