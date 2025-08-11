'use client';
import { useState, useEffect, useRef } from 'react';
import { NumericFormat } from 'react-number-format'; // Importa a biblioteca da máscara
import styles from '../styles/gerar-proposta.module.css';

// Interfaces atualizadas para incluir a categoria
interface ServicoBase {
  id: number;
  nome: string;
  valor: number;
  descricao: string;
  categoria: 'recorrente' | 'eventual'; // Adicionado
}

interface ServicoNaProposta {
  idUnico: string;
  servicoId: number;
  nome: string;
  valor: number;
  categoria: 'recorrente' | 'eventual'; // Adicionado
  descricoes: { id: string; texto: string }[];
}

interface ServicosTabProps {
  formData: any;
  setFormData: (data: any) => void;
  supabase: any;
  nextTab: () => void;
  prevTab: () => void;
}

export default function ServicosTab({ formData, setFormData, supabase, nextTab, prevTab }: ServicosTabProps) {
  const [todosServicos, setTodosServicos] = useState<ServicoBase[]>([]);
  const [servicosNaProposta, setServicosNaProposta] = useState<ServicoNaProposta[]>(formData.servicos || []);
  
  const [buscaDropdown, setBuscaDropdown] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Busca os serviços, incluindo o 'categoria'
  useEffect(() => {
    const fetchServicos = async () => {
      // A LINHA ABAIXO É A ÚNICA MUDANÇA NECESSÁRIA
      const { data, error } = await supabase.from('servicos').select('id,nome,valor,descricao,categoria');
      
      if (error) {
        console.error('Erro ao buscar serviços:', error);
      } else {
        setTodosServicos(data || []);
      }
    };
    fetchServicos();
  }, [supabase]);


  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, [dropdownRef]);

  const handleAddServico = (servicoBase: ServicoBase) => {
    const descricoesIniciais = servicoBase.descricao
      ? servicoBase.descricao.split('\n').map(d => ({ id: `desc-${Date.now()}-${Math.random()}`, texto: d.trim() }))
      : [{ id: `desc-${Date.now()}-${Math.random()}`, texto: '' }];

    const novoServico: ServicoNaProposta = {
      idUnico: `serv-${Date.now()}`,
      servicoId: servicoBase.id,
      nome: servicoBase.nome,
      valor: servicoBase.valor,
      categoria: servicoBase.categoria, // Adiciona o categoria ao serviço na proposta
      descricoes: descricoesIniciais,
    };
    setServicosNaProposta(prev => [...prev, novoServico]);
    setBuscaDropdown('');
    setDropdownAberto(false);
  };

  // Funções de manipulação (sem alterações na lógica, apenas no que é passado)
  const handleServicoInputChange = (idServico: string, campo: 'nome' | 'valor', valor: string | number) => {
    setServicosNaProposta(prev => prev.map(s => s.idUnico === idServico ? { ...s, [campo]: valor } : s));
  };
  const handleRemoveServico = (idUnico: string) => setServicosNaProposta(prev => prev.filter(s => s.idUnico !== idUnico));
  const handleDescricaoChange = (idServico: string, idDesc: string, novoTexto: string) => {
    setServicosNaProposta(prev => prev.map(s => s.idUnico === idServico ? { ...s, descricoes: s.descricoes.map(d => d.id === idDesc ? { ...d, texto: novoTexto } : d) } : s));
  };
  const handleAddDescricao = (idServico: string) => {
    setServicosNaProposta(prev => prev.map(s => s.idUnico === idServico ? { ...s, descricoes: [...s.descricoes, { id: `desc-${Date.now()}`, texto: '' }] } : s));
  };
  const handleRemoveDescricao = (idServico: string, idDesc: string) => {
    setServicosNaProposta(prev => prev.map(s => s.idUnico === idServico ? { ...s, descricoes: s.descricoes.filter(d => d.id !== idDesc) } : s));
  };

  const onSubmit = () => {
    setFormData({ ...formData, servicos: servicosNaProposta });
    nextTab();
  };

  const servicosFiltradosDropdown = todosServicos.filter(s => s.nome.toLowerCase().includes(buscaDropdown.toLowerCase()));

  return (
    <div>
      <div className={styles['form-group']} style={{ marginBottom: '30px' }} ref={dropdownRef}>
        <label>Tipo de serviço</label>
        <div className={styles['custom-dropdown-container']}>
          <input
            type="text"
            className={styles['form-control']}
            placeholder="Pesquisar ou selecionar serviço"
            value={buscaDropdown}
            onChange={(e) => setBuscaDropdown(e.target.value)}
            onFocus={() => setDropdownAberto(true)}
          />
          {dropdownAberto && (
            <div className={styles['dropdown-options-list']}>
              {servicosFiltradosDropdown.map(servico => (
                <div key={servico.id} className={styles['dropdown-option']} onClick={() => handleAddServico(servico)}>
                  {servico.nome}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles['servicos-adicionados-container']}>
        {servicosNaProposta.map(servico => (
          <div key={servico.idUnico} className={styles['servico-card']}>
            <div className={styles['servico-card-header']}>
              {/* CORREÇÃO: Título agora dentro de um wrapper para a borda */}
              <div className={styles['title-input-wrapper']}>
                <input
                  type="text"
                  value={servico.nome}
                  onChange={(e) => handleServicoInputChange(servico.idUnico, 'nome', e.target.value)}
                  className={`${styles['form-control']} ${styles['servico-card-title-input']}`}
                />
              </div>
              <div className={styles['servico-card-actions']}>
                {/* CORREÇÃO: Etiqueta de categoria adicionada */}
                <span className={`${styles['servico-tag']} ${styles[servico.categoria]}`}>
                  {servico.categoria}
                </span>
                {/* CORREÇÃO: Usando NumericFormat para a máscara de valor */}
                <NumericFormat
                  value={servico.valor}
                  onValueChange={(values) => {
                    handleServicoInputChange(servico.idUnico, 'valor', values.floatValue || 0);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  customInput={({ ...props }) => (
                    <div className={styles['price-input-wrapper']}>
                      <input {...props} className={`${styles['form-control']} ${styles['servico-card-price-input']}`} />
                    </div>
                  )}
                />
                <button type="button" onClick={() => handleRemoveServico(servico.idUnico)} className={styles['btn-remove-card']}>x</button>
              </div>
            </div>
            <div className={styles['servico-card-body']}>
              <label>Descrições do serviço</label>
              {servico.descricoes.map((desc) => (
                <div key={desc.id} className={styles['dynamic-field']}>
                  <input
                    type="text"
                    className={styles['form-control']}
                    value={desc.texto}
                    onChange={(e) => handleDescricaoChange(servico.idUnico, desc.id, e.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveDescricao(servico.idUnico, desc.id)} className={`${styles['btn-remove-dynamic']} ${styles['btn-danger']}`}>x</button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddDescricao(servico.idUnico)} className={styles['btn-add-descricao']}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles['form-navigation']} ${styles['space-between']}`}>
        <button type="button" onClick={prevTab} className={`${styles['btn-nav']} ${styles['btn-prev']}`}>Anterior</button>
        <button type="button" onClick={onSubmit} className={`${styles['btn-nav']} ${styles['btn-next']}`}>Próximo</button>
      </div>
    </div>
  );
}
