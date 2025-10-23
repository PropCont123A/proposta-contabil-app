// app/(dashboard)/components/ServiceModal.tsx - VERSÃO FINALÍSSIMA E CORRETA

'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/client';
// ✅ PASSO 1: Importamos o 'profile' do nosso hook de autenticação.
import { useAuth } from '../../context/AuthContext';
import { Servico } from '../configuracoes/servicos/page';
import CurrencyInput from 'react-currency-input-field';

type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  serviceToEdit: Servico | null;
};

export default function ServiceModal({ isOpen, onClose, onSaveSuccess, serviceToEdit }: ServiceModalProps) {
  const supabase = createBrowserClient();
  // ✅ PASSO 2: Pegamos o 'profile' que contém o 'escritorio_id'.
  const { profile } = useAuth();

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState<string | undefined>(undefined);
  const [categoria, setCategoria] = useState<'Recorrente' | 'Eventual'>('Eventual');
  const [descricoes, setDescricoes] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);

  // Seu useEffect está perfeito, sem alterações.
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

  const handleDescricaoChange = (index: number, value: string) => { const novasDescricoes = [...descricoes]; novasDescricoes[index] = value; setDescricoes(novasDescricoes); };
  const addDescricaoField = () => setDescricoes([...descricoes, '']);
  const removeDescricaoField = (index: number) => { const novasDescricoes = descricoes.filter((_, i) => i !== index); setDescricoes(novasDescricoes.length > 0 ? novasDescricoes : ['']); };

  // ✅✅✅ A CORREÇÃO DEFINITIVA ESTÁ AQUI ✅✅✅
  const handleSave = async () => {
    // Validação inicial: precisamos do perfil para saber a qual escritório o serviço pertence.
    if (!profile?.escritorio_id) {
      alert("Erro: Não foi possível identificar seu escritório. Por favor, faça login novamente.");
      return;
    }

    setIsSaving(true);

    const servicoData = {
      nome,
      valor: valor ? parseFloat(String(valor).replace(/\./g, '').replace(',', '.')) || 0 : 0,
      categoria,
      descricao: descricoes.filter(d => d && d.trim() !== ''),
    };

    let error;

    if (serviceToEdit) {
      // ATUALIZAÇÃO: A lógica de atualização não precisa do escritorio_id, pois a RLS já protege.
      ({ error } = await supabase.from('servicos').update(servicoData).eq('id', serviceToEdit.id));
    } else {
      // INSERÇÃO: Agora, incluímos o 'escritorio_id' nos dados que serão inseridos.
      // É este o "crachá" que o segurança do banco de dados precisa ver.
      const dataToInsert = {
        ...servicoData,
        escritorio_id: profile.escritorio_id,
      };
      ({ error } = await supabase.from('servicos').insert([dataToInsert]));
    }

    if (error) {
      console.error('Erro ao salvar serviço:', error);
      alert(`Ocorreu um erro ao salvar: ${error.message}`);
    } else {
      onSaveSuccess();
    }
    
    setIsSaving(false);
  };

  if (!isOpen) return null;

  // Seu JSX está perfeito, sem alterações.
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
