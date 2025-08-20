// app/configuracoes/escritorio/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // 1. LINHA ANTIGA REMOVIDA
import { createBrowserClient } from '@supabase/ssr'; // 1. LINHA NOVA ADICIONADA
import { IMaskInput } from 'react-imask';
import { FaBuilding, FaUserTie, FaLink, FaInfoCircle, FaPhoneAlt, FaUpload, FaSearch } from 'react-icons/fa';
import { User } from '@supabase/supabase-js';

// Importe seu CSS aqui se ele não for global
// import './seu-arquivo-de-estilos.css';

// Definindo o tipo para os dados do escritório (usando a interface do seu arquivo de tipos)
// CORREÇÃO: Usando caminho relativo para garantir que funcione.
import { Escritorio } from '../../../types/database.types';

const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function PaginaCadastroEscritorio() {
  // 2. INICIALIZAÇÃO DO SUPABASE ATUALIZADA
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [escritorio, setEscritorio] = useState<Partial<Escritorio>>({});
  const [activeTab, setActiveTab] = useState('geral');
  const [user, setUser] = useState<User | null>(null);

  //
  // ===== NENHUMA OUTRA MUDANÇA NECESSÁRIA =====
  // Todo o resto do seu código permanece idêntico.
  //

  const fetchEscritorio = useCallback(async (currentUser: User) => {
    const { data, error } = await supabase
      .from('escritorios')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignora o erro "nenhuma linha encontrada"
      console.error('Erro ao buscar dados do escritório:', error);
    }
    if (data) {
      setEscritorio(data);
    }
  }, [supabase]);

  useEffect(() => {
    const getUserAndData = async () => {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        await fetchEscritorio(currentUser);
      }
      setLoading(false);
    };
    getUserAndData();
  }, [supabase, fetchEscritorio]);

  const handleChange = (field: keyof Escritorio, value: any) => {
    setEscritorio(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) {
      alert('Sessão de usuário não encontrada. Por favor, faça login novamente.');
      return;
    }
    setIsSaving(true);

    const dataToSave = {
      ...escritorio,
      user_id: user.id,
      updated_at: new Date().toISOString(), // Adiciona um campo de data de atualização
    };

    // Remove o ID para o upsert funcionar corretamente pelo user_id
    if ('id' in dataToSave) {
      delete (dataToSave as any).id;
    }

    const { error } = await supabase.from('escritorios').upsert(dataToSave, { onConflict: 'user_id' });

    if (error) {
      console.error('Erro ao salvar dados:', error);
      alert(`Ocorreu um erro ao salvar: ${error.message}`);
    } else {
      alert('Dados do escritório salvos com sucesso!');
      await fetchEscritorio(user); // Re-busca os dados para garantir consistência
    }
    setIsSaving(false);
  };

  // Funções para renderizar o conteúdo de cada aba
  const renderGeralTab = () => (
    <>
      <div className="form-grid">
        <div className="modal-form-group">
          <label>Tipo de Pessoa</label>
          <select className="modal-input" value={escritorio.tipo_pessoa || ''} onChange={(e) => handleChange('tipo_pessoa', e.target.value)}>
            <option value="">Selecione...</option>
            <option value="Jurídica">Jurídica</option>
            <option value="Física">Física</option>
          </select>
        </div>
        <div className="modal-form-group">
          <label>CPF/CNPJ</label>
          <IMaskInput mask={escritorio.tipo_pessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00'} className="modal-input" value={escritorio.cpf_cnpj || ''} onAccept={(value) => handleChange('cpf_cnpj', String(value))} />
        </div>
        <div className="modal-form-group">
          <label>Nº do CRC</label>
          <IMaskInput mask="aa000000/a-0" prepare={(str) => str.toUpperCase()} className="modal-input" value={escritorio.crc || ''} onAccept={(value) => handleChange('crc', String(value))} />
        </div>
        <div className="modal-form-group span-2">
          <label>Nome ou Razão Social</label>
          <input type="text" className="modal-input" value={escritorio.razao_social || ''} onChange={(e) => handleChange('razao_social', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Nome Fantasia</label>
          <input type="text" className="modal-input" value={escritorio.nome_fantasia || ''} onChange={(e) => handleChange('nome_fantasia', e.target.value)} />
        </div>
      </div>
      <h3 className="form-section-title">Endereço</h3>
      <div className="form-grid">
        <div className="modal-form-group">
          <label>CEP</label>
          <div className="input-with-button">
            <IMaskInput mask="00000-000" className="modal-input" value={escritorio.cep || ''} onAccept={(value) => handleChange('cep', String(value))} />
            <button type="button" className="btn-icon" title="Buscar CEP"><FaSearch /></button>
          </div>
        </div>
        <div className="modal-form-group span-2">
          <label>Endereço</label>
          <input type="text" className="modal-input" value={escritorio.endereco || ''} onChange={(e) => handleChange('endereco', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Número</label>
          <input type="text" className="modal-input" value={escritorio.numero || ''} onChange={(e) => handleChange('numero', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Complemento</label>
          <input type="text" className="modal-input" value={escritorio.complemento || ''} onChange={(e) => handleChange('complemento', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Bairro</label>
          <input type="text" className="modal-input" value={escritorio.bairro || ''} onChange={(e) => handleChange('bairro', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Cidade</label>
          <input type="text" className="modal-input" value={escritorio.cidade || ''} onChange={(e) => handleChange('cidade', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Estado (UF)</label>
          <select className="modal-input" value={escritorio.estado || ''} onChange={(e) => handleChange('estado', e.target.value)}>
            <option value="">Selecione...</option>
            {estadosBrasileiros.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
      </div>
    </>
  );

  const renderContatoTab = () => (
    <div className="form-grid">
      <div className="modal-form-group">
        <label>Telefone Comercial</label>
        <IMaskInput mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} className="modal-input" value={escritorio.fone_comercial || ''} onAccept={(value) => handleChange('fone_comercial', String(value))} />
      </div>
      <div className="modal-form-group">
        <label>WhatsApp</label>
        <IMaskInput mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} className="modal-input" value={escritorio.whatsapp || ''} onAccept={(value) => handleChange('whatsapp', String(value))} />
      </div>
      <div className="modal-form-group">
        <label>E-mail Principal</label>
        <input type="email" className="modal-input" value={escritorio.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
      </div>
    </div>
  );

  const renderMidiaTab = () => (
    <>
      <h3 className="form-section-title">Logo e Mídias Sociais</h3>
      <div className="form-grid">
        <div className="modal-form-group span-3 file-upload-group">
          <label>Logotipo</label>
          <div className="input-with-button">
            <input type="text" readOnly placeholder="URL do seu logo..." className="modal-input" value={escritorio.logo_url || ''} />
            <button type="button" className="btn-secondary"><FaUpload /> Enviar Arquivo</button>
          </div>
          <small>Envie um arquivo PNG ou JPEG de até 2MB. A URL aparecerá aqui.</small>
        </div>
        <div className="modal-form-group">
          <label>Site</label>
          <input type="text" placeholder="https://seusite.com" className="modal-input" value={escritorio.site || ''} onChange={(e  ) => handleChange('site', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Instagram</label>
          <input type="text" placeholder="https://instagram.com/seu-usuario" className="modal-input" value={escritorio.instagram || ''} onChange={(e  ) => handleChange('instagram', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>Facebook</label>
          <input type="text" placeholder="https://facebook.com/sua-pagina" className="modal-input" value={escritorio.facebook || ''} onChange={(e  ) => handleChange('facebook', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>LinkedIn</label>
          <input type="text" placeholder="https://linkedin.com/in/seu-perfil" className="modal-input" value={escritorio.linkedin || ''} onChange={(e  ) => handleChange('linkedin', e.target.value)} />
        </div>
      </div>
    </>
  );

  const renderSobreTab = () => (
    <>
      <h3 className="form-section-title">Sobre o Escritório</h3>
      <div className="modal-form-group">
        <textarea className="modal-input" rows={8} maxLength={1000} value={escritorio.sobre_nos || ''} onChange={(e) => handleChange('sobre_nos', e.target.value)} placeholder="Fale um pouco sobre a história, missão e valores do seu escritório..." />
        <small className="text-right d-block">{(escritorio.sobre_nos || '').length} / 1000 caracteres</small>
      </div>
    </>
  );

  const renderContadorTab = () => (
    <>
      <h3 className="form-section-title">Contador Responsável</h3>
      <div className="form-grid">
        <div className="modal-form-group">
          <label>Nome do Contador</label>
          <input type="text" className="modal-input" value={escritorio.contador_responsavel_nome || ''} onChange={(e) => handleChange('contador_responsavel_nome', e.target.value)} />
        </div>
        <div className="modal-form-group">
          <label>CPF do Contador</label>
          <IMaskInput mask="000.000.000-00" className="modal-input" value={escritorio.contador_responsavel_cpf || ''} onAccept={(value) => handleChange('contador_responsavel_cpf', String(value))} />
        </div>
        <div className="modal-form-group">
          <label>CRC do Contador</label>
          <IMaskInput mask="aa000000/a-0" prepare={(str) => str.toUpperCase()} className="modal-input" value={escritorio.contador_responsavel_crc || ''} onAccept={(value) => handleChange('contador_responsavel_crc', String(value))} />
        </div>
      </div>
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geral': return renderGeralTab();
      case 'contato': return renderContatoTab();
      case 'midia': return renderMidiaTab();
      case 'sobre': return renderSobreTab();
      case 'contador': return renderContadorTab();
      default: return null;
    }
  };

  if (loading) {
    return <div className="content-box">Carregando configurações...</div>;
  }
  
  if (!user && !loading) {
    return <div className="content-box">Você precisa estar logado para acessar esta página.</div>;
  }

  return (
    <div className="content-box">
      <div className="tabs-container-escritorio">
        <button className={`tab-button-escritorio ${activeTab === 'geral' ? 'active' : ''}`} onClick={() => setActiveTab('geral')}><FaBuilding /> Dados Gerais</button>
        <button className={`tab-button-escritorio ${activeTab === 'contato' ? 'active' : ''}`} onClick={() => setActiveTab('contato')}><FaPhoneAlt /> Contato</button>
        <button className={`tab-button-escritorio ${activeTab === 'midia' ? 'active' : ''}`} onClick={() => setActiveTab('midia')}><FaLink /> Mídia e Logo</button>
        <button className={`tab-button-escritorio ${activeTab === 'sobre' ? 'active' : ''}`} onClick={() => setActiveTab('sobre')}><FaInfoCircle /> Sobre Nós</button>
        <button className={`tab-button-escritorio ${activeTab === 'contador' ? 'active' : ''}`} onClick={() => setActiveTab('contador')}><FaUserTie /> Contador Resp.</button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>

      <div className="form-actions">
        <button onClick={handleSave} className="btn-primary" disabled={isSaving || loading}>
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}
