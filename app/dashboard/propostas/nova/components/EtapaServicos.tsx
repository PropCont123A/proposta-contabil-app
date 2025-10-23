// Caminho: app/dashboard/propostas/nova/components/EtapaServicos.tsx (ou similar)

'use client';

// ✅ A ÚNICA ALTERAÇÃO ESTÁ AQUI: Adicionamos 'useCallback' à lista de imports do React.
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createBrowserClient } from '@/lib/client';
import { ProposalState, ProposalAction, PropostaItem, Servico } from '../state';
import styles from '../styles/gerar-proposta.module.css';
import CurrencyInput from 'react-currency-input-field';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ServiceModal from '../../../components/ServiceModal';

// --- Interface das Props ---
interface EtapaServicosProps {
  state: ProposalState;
  dispatch: React.Dispatch<ProposalAction>;
}

// ==================================================================
// COMPONENTE DO CARD DE SERVIÇO (Seu código está perfeito aqui)
// ==================================================================
const ServicoCard = ({ servico, index, dispatch }: { servico: PropostaItem, index: number, dispatch: React.Dispatch<ProposalAction> }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNome, setEditedNome] = useState(servico.nome);
  const [editedValor, setEditedValor] = useState<string | undefined>(String(servico.valor));
  const [editedDescricao, setEditedDescricao] = useState(Array.isArray(servico.descricao) ? servico.descricao : [servico.descricao || '']);

  const handleSaveChanges = () => {
    const valorNumerico = parseFloat((editedValor || '0').replace(/\./g, '').replace(',', '.'));
    dispatch({
      type: 'EDITAR_SERVICO',
      payload: {
        idUnico: servico.idUnico,
        changes: {
          nome: editedNome,
          valor: isNaN(valorNumerico) ? 0 : valorNumerico,
          descricao: editedDescricao,
        },
      },
    });
    setIsEditing(false);
  };

  const handleDescricaoChange = (descIndex: number, novoTexto: string) => {
    const novasDescricoes = [...editedDescricao];
    novasDescricoes[descIndex] = novoTexto;
    setEditedDescricao(novasDescricoes);
  };
  const addDescricaoField = () => setEditedDescricao([...editedDescricao, '']);
  const removeDescricaoField = (descIndex: number) => {
    if (editedDescricao.length > 1) {
      setEditedDescricao(editedDescricao.filter((_, i) => i !== descIndex));
    }
  };

  return (
    <Draggable key={servico.idUnico} draggableId={servico.idUnico} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} className={`${styles['servico-card']} ${snapshot.isDragging ? styles.dragging : ''}`}>
          {isEditing ? (
            <div className={styles['card-edit-mode']}>
              <div className={styles['edit-header']}>
                <div {...provided.dragHandleProps} className={styles['drag-handle-edit']}><i className="fas fa-grip-vertical"></i></div>
                <input type="text" value={editedNome} onChange={(e) => setEditedNome(e.target.value)} className={styles['edit-title-input']} />
                <CurrencyInput
                  className={styles['edit-price-input']}
                  value={editedValor}
                  onValueChange={(value) => setEditedValor(value)}
                  intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                  placeholder="R$ 0,00"
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                />
              </div>
              <div className={styles['edit-body']}>
                <label>Descrições do serviço:</label>
                {editedDescricao.map((desc, i) => (
                  <div key={i} className={styles['edit-description-item']}>
                    <input type="text" className={styles['form-control']} value={desc} onChange={(e) => handleDescricaoChange(i, e.target.value)} />
                    {editedDescricao.length > 1 && <button onClick={() => removeDescricaoField(i)} className={styles['btn-remove-desc']}><i className="fas fa-times"></i></button>}
                  </div>
                ))}
                <button onClick={addDescricaoField} className={styles['btn-add-desc']}><i className="fas fa-plus"></i> Adicionar descrição</button>
              </div>
              <div className={styles['edit-footer']}>
                <button onClick={handleSaveChanges} className={styles['btn-concluir-edicao']}>Concluir Edição</button>
              </div>
            </div>
          ) : (
            <div className={styles['card-read-mode']}>
              <div {...provided.dragHandleProps} className={styles['drag-handle']}><i className="fas fa-grip-vertical"></i></div>
              <div className={styles['read-main-content']}>
                <h4 className={styles['read-title']}>{servico.nome}</h4>
                <ul className={styles['read-description-list']}>
                  {(Array.isArray(servico.descricao) ? servico.descricao : [servico.descricao || '']).map((desc, i) => desc && <li key={i}>{desc}</li>)}
                </ul>
              </div>
              <div className={styles['read-actions']}>
                <span className={`${styles['servico-tag']} ${styles[servico.categoria.toLowerCase()]}`}>
                  <i className={`fas ${servico.categoria === 'Recorrente' ? 'fa-sync-alt' : 'fa-bolt'}`}></i>
                  <span>{servico.categoria}</span>
                </span>
                <span className={styles['read-price']}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}</span>
                <button onClick={() => dispatch({ type: 'DUPLICAR_SERVICO', payload: { idUnico: servico.idUnico } })} className={styles['btn-action-icon']} title="Duplicar Serviço"><i className="fas fa-copy"></i></button>
                <button onClick={() => setIsEditing(true)} className={styles['btn-action-icon']} title="Editar Serviço"><i className="fas fa-pencil-alt"></i></button>
                <button onClick={() => dispatch({ type: 'REMOVER_SERVICO', payload: { idUnico: servico.idUnico } })} className={`${styles['btn-action-icon']} ${styles['btn-action-delete']}`} title="Remover Serviço"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};


// --- Componente Principal da Etapa ---
export default function EtapaServicos({ state, dispatch }: EtapaServicosProps) {
  const supabase = createBrowserClient();
  const { profile } = useAuth();
  const [todosServicosDB, setTodosServicosDB] = useState<Servico[]>([]);
  const [buscaDropdown, setBuscaDropdown] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [limiteVisivel, setLimiteVisivel] = useState(5);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const fetchServicos = useCallback(async () => {
    if (!profile?.escritorio_id) return;
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('escritorio_id', profile.escritorio_id)
      .order('nome', { ascending: true });
    if (error) {
      console.error("Erro ao buscar serviços para a proposta:", error);
    } else if (data) {
      setTodosServicosDB(data);
    }
  }, [supabase, profile]);

  useEffect(() => {
    fetchServicos();
  }, [fetchServicos]);

  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownAberto(false); };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const handleAddServico = (servico: Servico) => { dispatch({ type: 'ADICIONAR_SERVICO', payload: servico }); setBuscaDropdown(''); setDropdownAberto(false); };
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const items = Array.from(state.servicosSelecionados);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    dispatch({ type: 'REORDENAR_SERVICOS', payload: items });
  };

  const servicosFiltradosDropdown = todosServicosDB.filter(s => s.nome.toLowerCase().includes(buscaDropdown.toLowerCase()));
  const servicosVisiveis = servicosFiltradosDropdown.slice(0, limiteVisivel);

  return (
    <>
      <ServiceModal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} onSaveSuccess={() => { fetchServicos(); setIsServiceModalOpen(false); }} serviceToEdit={null} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles['form-group']} style={{ marginBottom: '30px' }} ref={dropdownRef}>
          <label>Adicionar Serviço à Proposta</label>
          <div className={styles['custom-dropdown-container']}>
            <input type="text" className={styles['form-control']} placeholder="Pesquisar serviço..." value={buscaDropdown} onChange={(e) => { setBuscaDropdown(e.target.value); setLimiteVisivel(5); }} onFocus={() => setDropdownAberto(true)} />
            {dropdownAberto && (
              <div className={styles['dropdown-options-list']}>
                {servicosVisiveis.length > 0 ? (
                  servicosVisiveis.map(servico => (
                    <div key={servico.id} className={styles['dropdown-option']} onClick={() => handleAddServico(servico)}>
                      <span>{servico.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}</span>
                    </div>
                  ))
                ) : ( <div className={styles['dropdown-empty']}>Nenhum serviço encontrado.</div> )}
                
                <div className={styles['dropdown-footer']}>
                  {servicosFiltradosDropdown.length > limiteVisivel && (
                    <button onClick={() => setLimiteVisivel(limiteVisivel + 5)} className={styles['btn-dropdown-action']}>
                      <i className="fas fa-chevron-down"></i>
                      Mostrar mais resultados
                    </button>
                  )}
                  <button type="button" onClick={() => setIsServiceModalOpen(true)} className={styles['btn-dropdown-action']}>
                    <i className="fas fa-plus"></i>
                    Cadastrar novo serviço
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Droppable droppableId="servicos-lista">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {state.servicosSelecionados.map((servico, index) => (
                <ServicoCard key={servico.idUnico} servico={servico} index={index} dispatch={dispatch} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className={`${styles['form-navigation']} ${styles['space-between']}`}>
          <button type="button" onClick={() => dispatch({ type: 'IR_PARA_ETAPA', payload: 1 })} className={`${styles['btn-nav']} ${styles['btn-prev']}`}>Anterior</button>
          <button type="button" onClick={() => dispatch({ type: 'IR_PARA_ETAPA', payload: 3 })} className={`${styles['btn-nav']} ${styles['btn-next']}`}>Próximo</button>
        </div>
      </DragDropContext>
    </>
  );
}
