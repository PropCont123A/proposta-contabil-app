'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Servico } from '../configuracoes/servicos/page';
import CurrencyInput from 'react-currency-input-field';

type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  serviceToEdit: Servico | null;
};

export default function ServiceModal({ isOpen, onClose, onSaveSuccess, serviceToEdit }: ServiceModalProps) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState<string | undefined>(undefined);
  const [categoria, setCategoria] = useState<'Recorrente' | 'Eventual'>('Eventual');
  const [descricoes, setDescricoes] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && serviceToEdit) {
      // Modo Edição
      setNome(serviceToEdit.nome);
      setValor(String(serviceToEdit.valor));
      setCategoria(serviceToEdit.categoria);

      // ======================= NOVA LÓGICA DE CORREÇÃO =======================
      let descricoesIniciais = ['']; // Valor padrão
      const descFromDb = serviceToEdit.descricao;

      if (Array.isArray(descFromDb)) {
        // CASO 1: O dado já é um array (perfeito)
        descricoesIniciais = descFromDb.length > 0 ? descFromDb : [''];
      } else if (typeof descFromDb === 'string' && descFromDb.startsWith('[') && descFromDb.endsWith(']')) {
        // CASO 2: O dado é uma STRING que parece um array
        try {
          // Tenta converter a string de volta para um array
          const parsedDesc = JSON.parse(descFromDb);
          if (Array.isArray(parsedDesc)) {
            descricoesIniciais = parsedDesc.length > 0 ? parsedDesc : [''];
          }
        } catch (e) {
          // Se a conversão falhar, trata como uma string normal
          descricoesIniciais = [descFromDb];
        }
      } else if (typeof descFromDb === 'string' && descFromDb) {
        // CASO 3: O dado é uma string simples (legado)
        descricoesIniciais = [descFromDb];
      }
      
      setDescricoes(descricoesIniciais);
      // ====================================================================

    } else if (isOpen) {
      // Modo Criação (reseta o formulário)
      setNome('');
      setValor(undefined);
      setCategoria('Eventual');
      setDescricoes(['']);
    }
  }, [isOpen, serviceToEdit]);

  // Funções para manipular os campos de descrição (sem alterações)
  const handleDescricaoChange = (index: number, value: string) => {
    const novasDescricoes = [...descricoes];
    novasDescricoes[index] = value;
    setDescricoes(novasDescricoes);
  };
  const addDescricaoField = () => setDescricoes([...descricoes, '']);
  const removeDescricaoField = (index: number) => {
    const novasDescricoes = descricoes.filter((_, i) => i !== index);
    setDescricoes(novasDescricoes.length > 0 ? novasDescricoes : ['']);
  };

  // Função para salvar (sem alterações)
  const handleSave = async () => {
    setIsSaving(true);
    const valorNumerico = valor ? parseFloat(valor) : 0;
    const servicoData = {
      nome,
      valor: valorNumerico,
      categoria,
      descricao: descricoes.filter(d => d && d.trim() !== ''),
    };
    let error;
    if (serviceToEdit) {
      ({ error } = await supabase.from('servicos').update(servicoData).eq('id', serviceToEdit.id));
    } else {
      ({ error } = await supabase.from('servicos').insert([servicoData]));
    }
    if (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Ocorreu um erro ao salvar. Tente novamente.');
    } else {
      onSaveSuccess();
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  // JSX do Modal (sem alterações)
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{serviceToEdit ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h2>
        <div className="modal-form-group">
          <label>Nome do Serviço</label>
          <input type="text" className="modal-input" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Descrições</label>
          {descricoes.map((desc, index) => (
            <div key={index} className="dynamic-field-group">
              <input type="text" className="modal-input" value={desc || ''} onChange={(e) => handleDescricaoChange(index, e.target.value)} />
              {index === descricoes.length - 1 ? (
                <button onClick={addDescricaoField} className="btn-add-dynamic" title="Adicionar descrição"><i className="fas fa-plus"></i></button>
              ) : (
                <button onClick={() => removeDescricaoField(index)} className="btn-remove-dynamic" title="Remover descrição"><i className="fas fa-times"></i></button>
              )}
            </div>
          ))}
        </div>
        <div className="modal-form-group">
          <label>Valor</label>
          <CurrencyInput
            className="modal-input"
            value={valor}
            onValueChange={(value) => setValor(value)}
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            placeholder="R$ 0,00"
            decimalsLimit={2}
            decimalSeparator=","
            groupSeparator="."
            prefix="R$ "
          />
        </div>
        <div className="modal-form-group">
          <label>Categoria</label>
          <select className="modal-input" value={categoria} onChange={(e) => setCategoria(e.target.value as 'Recorrente' | 'Eventual')}>
            <option value="Eventual">Eventual</option>
            <option value="Recorrente">Recorrente</option>
          </select>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary" disabled={isSaving}>Cancelar</button>
          <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
