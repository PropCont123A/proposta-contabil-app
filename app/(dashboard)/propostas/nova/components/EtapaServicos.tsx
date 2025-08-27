// app/(dashboard)/propostas/nova/components/EtapaServicos.tsx (CÓDIGO CORRIGIDO)
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createClient } from '@/lib/client';
import { ProposalState, ProposalAction, PropostaItem, Servico } from '../state';
import styles from '../styles/gerar-proposta.module.css';
import CurrencyInput from 'react-currency-input-field';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ServiceModal from '../../../components/ServiceModal';

interface EtapaServicosProps {
  state: ProposalState;
  dispatch: React.Dispatch<ProposalAction>;
}

export default function EtapaServicos({ state, dispatch }: EtapaServicosProps) {
  const supabase = createClient();
  const { user } = useAuth();
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [todosServicosDB, setTodosServicosDB] = useState<Servico[]>([]);
  const [buscaDropdown, setBuscaDropdown] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [limiteVisivel, setLimiteVisivel] = useState(5);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const fetchServicos = async () => {
    if (!user) return;
    const { data } = await supabase.from('servicos').select('*').eq('user_id', user.id).order('nome', { ascending: true });
    if (data) setTodosServicosDB(data);
  };

  useEffect(() => { fetchServicos(); }, [supabase, user]);
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownAberto(false); };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const handleAddServico = (servico: Servico) => { dispatch({ type: 'ADICIONAR_SERVICO', payload: servico }); setBuscaDropdown(''); setDropdownAberto(false); };
  const handleEditServico = (idUnico: string, changes: Partial<PropostaItem>) => { dispatch({ type: 'EDITAR_SERVICO', payload: { idUnico, changes } }); };
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const items = Array.from(state.servicosSelecionados);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    dispatch({ type: 'REORDENAR_SERVICOS', payload: items });
  };
  const handleDescricaoChange = (idUnico: string, descIndex: number, novoTexto: string) => {
    const servicoAtual = state.servicosSelecionados.find(s => s.idUnico === idUnico); if (!servicoAtual) return;
    const descricoes = Array.isArray(servicoAtual.descricao) ? [...servicoAtual.descricao] : [servicoAtual.descricao || ''];
    descricoes[descIndex] = novoTexto;
    handleEditServico(idUnico, { descricao: descricoes });
  };
  const addDescricaoField = (idUnico: string) => {
    const servicoAtual = state.servicosSelecionados.find(s => s.idUnico === idUnico); if (!servicoAtual) return;
    const descricoes = Array.isArray(servicoAtual.descricao) ? [...servicoAtual.descricao, ''] : [(servicoAtual.descricao || ''), ''];
    handleEditServico(idUnico, { descricao: descricoes });
  };
  const removeDescricaoField = (idUnico: string, descIndex: number) => {
    const servicoAtual = state.servicosSelecionados.find(s => s.idUnico === idUnico); if (!servicoAtual) return;
    const descricoes = Array.isArray(servicoAtual.descricao) ? [...servicoAtual.descricao] : [servicoAtual.descricao || ''];
    descricoes.splice(descIndex, 1);
    handleEditServico(idUnico, { descricao: descricoes });
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
                <Draggable key={servico.idUnico} draggableId={servico.idUnico} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className={`${styles['servico-card']} ${snapshot.isDragging ? styles.dragging : ''}`}>
                      {/* O restante do seu componente de card permanece o mesmo */}
                      {editingCardId === servico.idUnico ? (
                        // MODO DE EDIÇÃO
                        <div> ... </div>
                      ) : (
                        // MODO DE LEITURA
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
                              <i className={`fas ${servico.categoria === 'Recorrente' ? 'fa-sync-alt' : 'fa-bolt'}`} style={{marginRight: '0.5rem'}}></i>
                              <span>{servico.categoria}</span>
                            </span>
                            <span className={styles['read-price']}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}</span>
                            <button onClick={() => setEditingCardId(servico.idUnico)} className={styles['btn-action-icon']} title="Editar Serviço"><i className="fas fa-pencil-alt"></i></button>
                            <button onClick={() => dispatch({ type: 'REMOVER_SERVICO', payload: { idUnico: servico.idUnico } })} className={`${styles['btn-action-icon']} ${styles['btn-action-delete']}`} title="Remover Serviço"><i className="fas fa-trash"></i></button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className={`${styles['form-navigation']} ${styles['space-between']}`}>
          <button type="button" onClick={() => dispatch({ type: 'ETAPA_ANTERIOR' })} className={`${styles['btn-nav']} ${styles['btn-prev']}`}>Anterior</button>
          <button type="button" onClick={() => dispatch({ type: 'PROXIMA_ETAPA' })} className={`${styles['btn-nav']} ${styles['btn-next']}`}>Próximo</button>
        </div>
      </DragDropContext>
    </>
  );
}
