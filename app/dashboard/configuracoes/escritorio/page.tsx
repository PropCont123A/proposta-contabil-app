// Caminho: app/(dashboard)/configuracoes/escritorio/page.tsx
// VERSÃO FINAL - Adaptada para o novo layout de abas fixas

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createBrowserClient } from '@/lib/client';
import { useAuth } from '@/app/context/AuthContext';
import { IMaskInput } from 'react-imask';
import { FaUpload, FaSearch } from 'react-icons/fa';
import { Escritorio } from '../../../../types/database.types';
import Header from '../../components/Header';
import Tabs from '../../components/Tabs/Tabs';

const estadosBrasileiros = [ 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO' ];
const tabsConfig = [ { id: 'geral', label: 'Dados Gerais' }, { id: 'contato', label: 'Contato' }, { id: 'midia', label: 'Mídia e Logo' }, { id: 'sobre', label: 'Sobre Nós' }, { id: 'contador', label: 'Contador Resp.' }, ];

export default function PaginaCadastroEscritorio() {
  const { profile, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();

  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [escritorio, setEscritorio] = useState<Partial<Escritorio>>({});
  const [activeTab, setActiveTab] = useState(tabsConfig[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGestor = profile?.role === 'GESTOR';
  const isReadOnly = !isGestor;

  // --- Lógicas de busca e salvamento (SEM ALTERAÇÕES) ---
  const fetchEscritorio = useCallback(async () => {
    if (!profile?.escritorio_id) return;
    const { data, error } = await supabase.from('escritorios').select('*').eq('id', profile.escritorio_id).single();
    if (error && error.code !== 'PGRST116') console.error('Erro ao buscar escritório:', error);
    else if (data) setEscritorio(data);
  }, [supabase, profile]);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      setIsComponentLoading(false);
      return;
    }
    fetchEscritorio().finally(() => setIsComponentLoading(false));
  }, [authLoading, profile, fetchEscritorio]);

  const handleSave = async () => {
    if (!isGestor || !profile?.escritorio_id) return;
    setIsSaving(true);
    const { id, user_id, created_at, ...dataToSave } = escritorio;
    const { error } = await supabase.from('escritorios').update({ ...dataToSave, updated_at: new Date().toISOString() }).eq('id', profile.escritorio_id);
    if (error) alert(`Erro ao salvar: ${error.message}`);
    else alert('Dados salvos com sucesso!');
    setIsSaving(false);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isGestor || !profile?.escritorio_id) return;
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `public/${profile.escritorio_id}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('logos').upload(filePath, file);
    if (uploadError) { alert(`Erro no upload: ${uploadError.message}`); return; }
    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(filePath);
    setEscritorio(prev => ({ ...prev, logo_url: publicUrl }));
    await supabase.from('escritorios').update({ logo_url: publicUrl }).eq('id', profile.escritorio_id);
    alert('Logo enviado com sucesso!');
  };

  const handleChange = (field: keyof Escritorio, value: any) => {
    setEscritorio(prev => ({ ...prev, [field]: value }));
  };

  // --- Funções de Renderização das Abas (SEM ALTERAÇÕES) ---
  const renderGeralTab = () => (
    <>
      <h3 className="form-section-title">Dados Gerais</h3>
      <div className="form-grid">
        <div className="form-group"><label>Tipo de Pessoa</label><select className="form-select" value={escritorio.tipo_pessoa || ''} onChange={(e) => handleChange('tipo_pessoa', e.target.value)} disabled={isReadOnly}><option value="">Selecione...</option><option value="Jurídica">Jurídica</option><option value="Física">Física</option></select></div>
        <div className="form-group"><label>CPF/CNPJ</label><IMaskInput mask={escritorio.tipo_pessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00'} className="form-input" value={escritorio.cpf_cnpj || ''} onAccept={(value) => handleChange('cpf_cnpj', String(value))} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Nº do CRC</label><IMaskInput mask="aa000000/a-0" prepare={(str) => str.toUpperCase()} className="form-input" value={escritorio.crc || ''} onAccept={(value) => handleChange('crc', String(value))} disabled={isReadOnly} /></div>
        <div className="form-group grid-col-span-2"><label>Nome ou Razão Social</label><input type="text" className="form-input" value={escritorio.razao_social || ''} onChange={(e) => handleChange('razao_social', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Nome Fantasia</label><input type="text" className="form-input" value={escritorio.nome_fantasia || ''} onChange={(e) => handleChange('nome_fantasia', e.target.value)} disabled={isReadOnly} /></div>
      </div>
      <h3 className="form-section-title">Endereço</h3>
      <div className="form-grid">
        <div className="form-group"><label>CEP</label><div className="input-with-button"><IMaskInput mask="00000-000" className="form-input" value={escritorio.cep || ''} onAccept={(value) => handleChange('cep', String(value))} disabled={isReadOnly} /><button type="button" className="btn-secondary" title="Buscar CEP" disabled={isReadOnly}><FaSearch /></button></div></div>
        <div className="form-group grid-col-span-2"><label>Endereço</label><input type="text" className="form-input" value={escritorio.endereco || ''} onChange={(e) => handleChange('endereco', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Número</label><input type="text" className="form-input" value={escritorio.numero || ''} onChange={(e) => handleChange('numero', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Complemento</label><input type="text" className="form-input" value={escritorio.complemento || ''} onChange={(e) => handleChange('complemento', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Bairro</label><input type="text" className="form-input" value={escritorio.bairro || ''} onChange={(e) => handleChange('bairro', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Cidade</label><input type="text" className="form-input" value={escritorio.cidade || ''} onChange={(e) => handleChange('cidade', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Estado (UF)</label><select className="form-select" value={escritorio.estado || ''} onChange={(e) => handleChange('estado', e.target.value)} disabled={isReadOnly}><option value="">Selecione...</option>{estadosBrasileiros.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
      </div>
    </>
  );
  const renderContatoTab = () => (
    <><h3 className="form-section-title">Informações de Contato</h3><div className="form-grid"><div className="form-group"><label>Telefone Comercial</label><IMaskInput mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} className="form-input" value={escritorio.fone_comercial || ''} onAccept={(value) => handleChange('fone_comercial', String(value))} disabled={isReadOnly} /></div><div className="form-group"><label>WhatsApp</label><IMaskInput mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} className="form-input" value={escritorio.whatsapp || ''} onAccept={(value) => handleChange('whatsapp', String(value))} disabled={isReadOnly} /></div><div className="form-group"><label>E-mail Principal</label><input type="email" className="form-input" value={escritorio.email || ''} onChange={(e) => handleChange('email', e.target.value)} disabled={isReadOnly} /></div></div></>
  );
  const renderMidiaTab = () => (
    <>
      <h3 className="form-section-title">Logo e Mídias Sociais</h3>
      <div className="logo-upload-container">
        <div className="logo-preview-wrapper">{escritorio.logo_url ? <img src={escritorio.logo_url} alt="Preview do Logotipo" className="logo-preview-image" /> : <div className="logo-preview-placeholder">Seu logo aparecerá aqui</div>}</div>
        <div className="logo-upload-fields">
          <div className="form-group"><label>Logotipo</label><p style={{ fontSize: '14px', color: '#666', marginTop: '0', marginBottom: '10px' }}>Faça o upload do logo da sua empresa.</p><button type="button" className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={isReadOnly}><FaUpload style={{ marginRight: '8px' }} />{escritorio.logo_url ? 'Trocar Logo' : 'Enviar Logo'}</button><input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/png, image/jpeg" onChange={handleLogoUpload} disabled={isReadOnly} /><small style={{ marginTop: '10px' }}>Envie um arquivo PNG ou JPEG de até 2MB.</small></div>
        </div>
      </div>
      <div className="form-grid" style={{ marginTop: '20px' }}>
        <div className="form-group"><label>Site</label><input type="text" placeholder="https://seusite.com" className="form-input" value={escritorio.site || ''} onChange={(e  ) => handleChange('site', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Instagram</label><input type="text" placeholder="@seu-usuario" className="form-input" value={escritorio.instagram || ''} onChange={(e) => handleChange('instagram', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>Facebook</label><input type="text" placeholder="facebook.com/sua-pagina" className="form-input" value={escritorio.facebook || ''} onChange={(e) => handleChange('facebook', e.target.value)} disabled={isReadOnly} /></div>
        <div className="form-group"><label>LinkedIn</label><input type="text" placeholder="linkedin.com/in/seu-perfil" className="form-input" value={escritorio.linkedin || ''} onChange={(e) => handleChange('linkedin', e.target.value)} disabled={isReadOnly} /></div>
      </div>
    </>
  );
  const renderSobreTab = () => (
    <><h3 className="form-section-title">Sobre o Escritório</h3><div className="form-group"><textarea className="form-textarea" maxLength={1000} value={escritorio.sobre_nos || ''} onChange={(e) => handleChange('sobre_nos', e.target.value)} placeholder="Fale um pouco sobre a história, missão e valores do seu escritório..." disabled={isReadOnly} /><small style={{ textAlign: 'right', display: 'block', marginTop: '4px' }}>{(escritorio.sobre_nos || '').length} / 1000 caracteres</small></div></>
  );
  const renderContadorTab = () => (
    <><h3 className="form-section-title">Contador Responsável</h3><div className="form-grid"><div className="form-group"><label>Nome do Contador</label><input type="text" className="form-input" value={escritorio.contador_responsavel_nome || ''} onChange={(e) => handleChange('contador_responsavel_nome', e.target.value)} disabled={isReadOnly} /></div><div className="form-group"><label>CPF do Contador</label><IMaskInput mask="000.000.000-00" className="form-input" value={escritorio.contador_responsavel_cpf || ''} onAccept={(value) => handleChange('contador_responsavel_cpf', String(value))} disabled={isReadOnly} /></div><div className="form-group"><label>CRC do Contador</label><IMaskInput mask="aa000000/a-0" prepare={(str) => str.toUpperCase()} className="form-input" value={escritorio.contador_responsavel_crc || ''} onAccept={(value) => handleChange('contador_responsavel_crc', String(value))} disabled={isReadOnly} /></div></div></>
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

  if (authLoading || isComponentLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>
    );
  }

  return (
    <>
      <Header
        title="Cadastro do Escritório"
        description="Gerencie as informações e a identidade visual do seu escritório."
      />

      {/* ✅ O COMPONENTE DE ABAS FICA FORA DO CONTENT-BOX PARA PODER SER FIXO */}
      <Tabs
        tabs={tabsConfig}
        activeTab={activeTab}
        onTabClick={(tabId) => setActiveTab(tabId)}
      />

      {/* ✅ O CONTEÚDO DAS ABAS FICA DENTRO DO CONTENT-BOX PARA TER O PADDING */}
      <div className="content-box">
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

      {isGestor && (
        <div className="form-actions-footer">
          <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      )}
    </>
  );
}
