// app/(dashboard)/components/ServiceModal.tsx - CÓDIGO COMPLETO E CORRIGIDO
'use client';

import { useEffect, useState } from 'react';
// 1. Importa a FUNÇÃO correta e o hook de autenticação
import { createSupabaseBrowserClient } from '../../../lib/supabaseClient'; 
import { useAuth } from '../../context/AuthContext'; // Essencial para saber quem é o usuário
import { Servico } from '../configuracoes/servicos/page';
import CurrencyInput from 'react-currency-input-field';

type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  serviceToEdit: Servico | null;
};

export default function ServiceModal({ isOpen, onClose, onSaveSuccess, serviceToEdit }: ServiceModalProps) {
  // 2. Cria a instância do Supabase e pega o usuário logado
  const supabase = createSupabaseBrowserClient();
  const { user } = useAuth();

  // Seus estados (sem alterações)
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState<string | undefined>(undefined);
  const [categoria, setCategoria] = useState<'Recorrente' | 'Eventual'>('Eventual');
  const [descricoes, setDescricoes] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);

  // Seu useEffect (sem alterações, a lógica de preenchimento está ótima)
  useEffect(() => {
    if (isOpen && serviceToEdit) {
      setNome(serviceToEdit.nome);
      setValor(String(serviceToEdit.valor));
      setCategoria(serviceToEdit.categoria);
      let descricoesIniciais = [''];
      const descFromDb = serviceToEdit.descricao;
      if (Array.isArray(descFromDb)) {
        descricoesIniciais = descFromDb.length > 0 ? descFromDb : [''];
      } else if (typeof descFromDb === 'string' && descFromDb.startsWith('[') && descFromDb.endsWith(']')) {
        try {
          const parsedDesc = JSON.parse(descFromDb);
          if (Array.isArray(parsedDesc)) { descricoesIniciais = parsedDesc.length > 0 ? parsedDesc : ['']; }
        } catch (e) {
          descricoesIniciais = [descFromDb];
        }
      } else if (typeof descFromDb === 'string' && descFromDb) {
        descricoesIniciais = [descFromDb];
      }
      setDescricoes(descricoesIniciais);
    } else if (isOpen) {
      setNome('');
      setValor(undefined);
      setCategoria('Eventual');
      setDescricoes(['']);
    }
  }, [isOpen, serviceToEdit]);

  // Suas funções de manipulação de descrição (sem alterações)
  const handleDescricaoChange = (index: number, value: string) => { const novasDescricoes = [...descricoes]; novasDescricoes[index] = value; setDescricoes(novasDescricoes); };
  const addDescricaoField = () => setDescricoes([...descricoes, '']);
  const removeDescricaoField = (index: number) => { const novasDescricoes = descricoes.filter((_, i) => i !== index); setDescricoes(novasDescricoes.length > 0 ? novasDescricoes : ['']); };

  // 3. Função de salvar CORRIGIDA para segurança
  const handleSave = async () => {
    if (!user) { // Guarda de segurança
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      return;
    }
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
      // Edição: Garante que só edita o que pertence ao usuário
      ({ error } = await supabase.from('servicos').update(servicoData).eq('id', serviceToEdit.id).eq('user_id', user.id));
    } else {
      // Criação: Adiciona o user_id do dono do novo serviço
      ({ error } = await supabase.from('servicos').insert([{ ...servicoData, user_id: user.id }]));
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

  // Seu JSX (sem alterações)
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{serviceToEdit ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h2>
        <div className="modal-form-group"><label>Nome do Serviço</label><input type="text" className="modal-input" value={nome} onChange={(e) => setNome(e.target.value)} /></div>
        <div className="modal-form-group"><label>Descrições</label>{descricoes.map((desc, index) => (<div key={index} className="dynamic-field-group"><input type="text" className="modal-input" value={desc || ''} onChange={(e) => handleDescricaoChange(index, e.target.value)} />{index === descricoes.length - 1 ? (<button onClick={addDescricaoField} className="btn-add-dynamic" title="Adicionar descrição"><i className="fas fa-plus"></i></button>) : (<button onClick={() => removeDescricaoField(index)} className="btn-remove-dynamic" title="Remover descrição"><i className="fas fa-times"></i></button>)}</div>))}</div>
        <div className="modal-form-group"><label>Valor</label><CurrencyInput className="modal-input" value={valor} onValueChange={(value) => setValor(value)} intlConfig={{ locale: 'pt-BR', currency: 'BRL' }} placeholder="R$ 0,00" decimalsLimit={2} decimalSeparator="," groupSeparator="." prefix="R$ " /></div>
        <div className="modal-form-group"><label>Categoria</label><select className="modal-input" value={categoria} onChange={(e) => setCategoria(e.target.value as 'Recorrente' | 'Eventual')}><option value="Eventual">Eventual</option><option value="Recorrente">Recorrente</option></select></div>
        <div className="modal-actions"><button onClick={onClose} className="btn-secondary" disabled={isSaving}>Cancelar</button><button onClick={handleSave} className="btn-primary" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</button></div>
      </div>
    </div>
  );
}
