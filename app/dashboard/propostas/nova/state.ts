// Caminho: app/dashboard/propostas/nova/state.ts

'use client';

import { Cliente } from '../../clientes/page';
import { Servico } from '../../configuracoes/servicos/page';

// --- INTERFACES ---
export interface PropostaItem extends Servico {
  idUnico: string;
}

export interface ProposalState {
  etapa: number;
  clienteId: number | null;
  clienteSelecionado: Cliente | null;
  tipoNegociacao: string;
  statusNegociacao: string;
  vendedorResponsavel: string;
  nomesCliente: string[];
  nomesEmpresa: string[];
  telefone: string;
  dataProposta: string;
  validadeDias: number;
  servicosSelecionados: PropostaItem[];
  valores: { recorrente: number; eventual: number };
  condicoesPagamento: string;
  informacoesComplementares: string;
}

// ESTADO INICIAL (sem alterações)
export const initialState: ProposalState = {
  etapa: 1,
  clienteId: null,
  clienteSelecionado: null,
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

// AÇÕES (sem alterações)
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
  | { type: 'RESETAR_ESTADO' }
  | { type: 'HIDRATAR_ESTADO'; payload: Partial<ProposalState> };

// REDUCER (com a correção)
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
        clienteId: cliente.id,
        clienteSelecionado: cliente,
        
        // ✅✅✅ A CORREÇÃO ESTÁ AQUI ✅✅✅
        // Lógica inteligente para nome da empresa e do cliente
        nomesEmpresa: [cliente.nome_fantasia || cliente.razao_social || cliente.nome_completo || ''],
        nomesCliente: [cliente.contato_nome || cliente.nome_completo || ''],
        
        telefone: cliente.telefone || '',
      };
    }

    // O resto do reducer permanece igual...
    case 'DESVINCULAR_CLIENTE':
      return { ...state, clienteId: null, clienteSelecionado: null };
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
      const novosServicosReordenados = action.payload;
      return { ...state, servicosSelecionados: novosServicosReordenados, valores: calcularValores(novosServicosReordenados) };
    case 'RESETAR_ESTADO':
      return { ...initialState, vendedorResponsavel: state.vendedorResponsavel };
    case 'HIDRATAR_ESTADO':
      const estadoHidratado = { ...state, ...action.payload };
      return { ...estadoHidratado, valores: calcularValores(estadoHidratado.servicosSelecionados) };
    default:
      return state;
  }
}

export type { Cliente };
