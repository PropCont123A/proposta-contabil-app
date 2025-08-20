// app/configuracoes/escritorio/page.tsx
'use client';

// 1. IMPORTAR o 'useRef' do React
import { useState, useEffect, useCallback, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { IMaskInput } from 'react-imask';
import { FaBuilding, FaUserTie, FaLink, FaInfoCircle, FaPhoneAlt, FaUpload, FaSearch } from 'react-icons/fa';
import { User } from '@supabase/supabase-js';
import { Escritorio } from '../../../../types/database.types';

// ... (o resto das suas constantes e configurações permanecem iguais)
const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];
const tabsConfig = [
  { id: 'geral', label: 'Dados Gerais' },
  { id: 'contato', label: 'Contato' },
  { id: 'midia', label: 'Mídia e Logo' },
  { id: 'sobre', label: 'Sobre Nós' },
  { id: 'contador', label: 'Contador Resp.' },
];


export default function PaginaCadastroEscritorio() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [escritorio, setEscritorio] = useState<Partial<Escritorio>>({});
  const [activeTab, setActiveTab] = useState(tabsConfig[0].id);
  const [user, setUser] = useState<User | null>(null);

  // 2. CRIAR UMA REFERÊNCIA para o input de arquivo escondido
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ... (toda a sua lógica de fetch, handleChange, handleSave permanece idêntica)
  const fetchEscritorio = useCallback(async (currentUser: User) => {
    const { data, error } = await supabase.from('escritorios').select('*').eq('user_id', currentUser.id).single();
    if (error && error.code !== 'PGRST116') console.error('Erro:', error);
    if (data) setEscritorio(data);
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

  const handleChange = (field: keyof Escritorio, value: any) => setEscritorio(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!user) return alert('Sessão não encontrada.');
    setIsSaving(true);
    const dataToSave = { ...escritorio, user_id: user.id, updated_at: new Date().toISOString() };
    if ('id' in dataToSave) delete (dataToSave as any).id;
    const { error } = await supabase.from('escritorios').upsert(dataToSave, { onConflict: 'user_id' });
    if (error) alert(`Erro ao salvar: ${error.message}`);
    else {
      alert('Dados salvos com sucesso!');
      await fetchEscritorio(user);
    }
    setIsSaving(false);
  };

  // 3. ADICIONAR A FUNÇÃO DE UPLOAD
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (!user) {
      alert('Você precisa estar logado para fazer o upload.');
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    alert('Iniciando upload do logo...');
    const { error: uploadError } = await supabase.storage
      .from('logos') // Certifique-se que o bucket 'logos' existe no seu Supabase Storage
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      alert(`Erro ao fazer upload do logo: ${uploadError.message}`);
      return;
    }

    // Se o upload deu certo, pegamos a URL pública para salvar no banco
    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(filePath);
    
    // Atualiza o estado e já salva no banco de dados
    handleChange('logo_url', publicUrl);
    
    // Salva automaticamente a nova URL no banco
    const { error: dbError } = await supabase
      .from('escritorios')
      .update({ logo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (dbError) {
      alert(`Logo enviado, mas falha ao salvar no perfil: ${dbError.message}`);
    } else {
      alert('Logo enviado e salvo com sucesso!');
    }
  };


  // ... (suas funções renderGeralTab, renderContatoTab, etc., permanecem iguais)
  const renderGeralTab = () => (
    <>
      <h3 className="form-section-title">Dados Gerais</h3>
      <div className="form-grid">
        <div className="form-group"><label>Tipo de Pessoa</label><select className="form-select" value={escritorio.tipo_pessoa || ''} onChange={(e) => handleChange('tipo_pessoa', e.target.value)}><option value="">Selecione...</option><option value="Jurídica">Jurídica</option><option value="Física">Física</option></select></div>
        <div className="form-group"><label>CPF/CNPJ</label><IMaskInput mask={escritorio.tipo_pessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00'} className="form-input" value={escritorio.cpf_cnpj || ''} onAccept={(value) => handleChange('cpf_cnpj', String(value))} /></div>
        <div className="form-group"><label>Nº do CRC</label><IMaskInput mask="aa000000/a-0" prepare={(str) => str.toUpperCase()} className="form-input" value={escritorio.crc || ''} onAccept={(value) => handleChange('crc', String(value))} /></div>
        <div className="form-group grid-col-span-2"><label>Nome ou Razão Social</label><input type="text" className="form-input" value={escritorio.razao_social || ''} onChange={(e) => handleChange('razao_social', e.target.value)} /></div>
        <div className="form-group"><label>Nome Fantasia</label><input type="text" className="form-input" value={escritorio.nome_fantasia || ''} onChange={(e) => handleChange('nome_fantasia', e.target.value)} /></div>
      </div>
      <h3 className="form-section-title">Endereço</h3>
      <div className="form-grid">
        <div className="form-group"><label>CEP</label><div className="input-with-button"><IMaskInput mask="00000-000" className="form-input" value={escritorio.cep || ''} onAccept={(value) => handleChange('cep', String(value))} /><button type="button" className="btn-secondary" title="Buscar CEP"><FaSearch /></button></div></div>
        <div className="form-group grid-col-span-2"><label>Endereço</label><input type="text" className="form-input" value={escritorio.endereco || ''} onChange={(e) => handleChange('endereco', e.target.value)} /></div>
        <div className="form-group"><label>Número</label><input type="text" className="form-input" value={escritorio.numero || ''} onChange={(e) => handleChange('numero', e.target.value)} /></div>
        <div className="form-group"><label>Complemento</label><input type="text" className="form-input" value={escritorio.complemento || ''} onChange={(e) => handleChange('complemento', e.target.value)} /></div>
        <div className="form-group"><label>Bairro</label><input type="text" className="form-input" value={escritorio.bairro || ''} onChange={(e) => handleChange('bairro', e.target.value)} /></div>
        <div className="form-group"><label>Cidade</label><input type="text" className="form-input" value={escritorio.cidade || ''} onChange={(e) => handleChange('cidade', e.target.value)} /></div>
        <div className="form-group"><label>Estado (UF)</label><select className="form-select" value={escritorio.estado || ''} onChange={(e) => handleChange('estado', e.target.value)}><option value="">Selecione...</option>{estadosBrasileiros.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
      </div>
    </>
  );
  const renderContatoTab = () => (
    <><h3 className="form-section-title">Informações de Contato</h3><div className="form-grid"><div className="form-group"><label>Telefone Comercial</label><IMaskInput mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} className="form-input" value={escritorio.fone_comercial || ''} onAccept={(value) => handleChange('fone_comercial', String(value))} /></div><div className="form-group"><label>WhatsApp</label><IMaskInput mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} className="form-input" value={escritorio.whatsapp || ''} onAccept={(value) => handleChange('whatsapp', String(value))} /></div><div className="form-group"><label>E-mail Principal</label><input type="email" className="form-input" value={escritorio.email || ''} onChange={(e) => handleChange('email', e.target.value)} /></div></div></>
  );

  // 4. ATUALIZAR O JSX DA ABA DE MÍDIA
  const renderMidiaTab = () => (
    <>
      <h3 className="form-section-title">Logo e Mídias Sociais</h3>
      
      <div className="logo-upload-container">

        {/* Bloco de Preview da Imagem */}
        <div className="logo-preview-wrapper">
          {escritorio.logo_url ? (
            <img 
              src={escritorio.logo_url} 
              alt="Preview do Logotipo" 
              className="logo-preview-image" 
            />
          ) : (
            <div className="logo-preview-placeholder">
              Seu logo aparecerá aqui
            </div>
          )}
        </div>

        {/* Bloco dos campos de upload */}
        <div className="logo-upload-fields">
          <div className="form-group">
            <label>Logotipo</label>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '0', marginBottom: '10px' }}>
              Faça o upload do logo da sua empresa.
            </p>
            
            {/* O input de texto foi REMOVIDO */}

            {/* Botão principal para enviar/trocar o logo */}
            <button 
              type="button" 
              className="btn-primary" // Mudei para btn-primary para dar mais destaque
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload style={{ marginRight: '8px' }} /> 
              {/* Texto do botão muda dinamicamente */}
              {escritorio.logo_url ? 'Trocar Logo' : 'Enviar Logo'}
            </button>

            {/* O input de arquivo real, continua escondido */}
            <input 
              type="file" 
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/png, image/jpeg"
              onChange={handleLogoUpload}
            />
            <small style={{ marginTop: '10px' }}>Envie um arquivo PNG ou JPEG de até 2MB.</small>
          </div>
        </div>
      </div>

      {/* Grid para as mídias sociais */}
      <div className="form-grid" style={{ marginTop: '20px' }}>
        <div className="form-group">
          <label>Site</label>
          <input type="text" placeholder="https://seusite.com" className="form-input" value={escritorio.site || ''} onChange={(e ) => handleChange('site', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Instagram</label>
          <input type="text" placeholder="@seu-usuario" className="form-input" value={escritorio.instagram || ''} onChange={(e) => handleChange('instagram', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Facebook</label>
          <input type="text" placeholder="facebook.com/sua-pagina" className="form-input" value={escritorio.facebook || ''} onChange={(e) => handleChange('facebook', e.target.value)} />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input type="text" placeholder="linkedin.com/in/seu-perfil" className="form-input" value={escritorio.linkedin || ''} onChange={(e) => handleChange('linkedin', e.target.value)} />
        </div>
      </div>
    </>
  );

  const renderSobreTab = () => (
    <><h3 className="form-section-title">Sobre o Escritório</h3><div className="form-group"><textarea className="form-textarea" maxLength={1000} value={escritorio.sobre_nos || ''} onChange={(e) => handleChange('sobre_nos', e.target.value)} placeholder="Fale um pouco sobre a história, missão e valores do seu escritório..." /><small style={{ textAlign: 'right', display: 'block', marginTop: '4px' }}>{(escritorio.sobre_nos || '').length} / 1000 caracteres</small></div></>
  );
  const renderContadorTab = () => (
    <><h3 className="form-section-title">Contador Responsável</h3><div className="form-grid"><div className="form-group"><label>Nome do Contador</label><input type="text" className="form-input" value={escritorio.contador_responsavel_nome || ''} onChange={(e) => handleChange('contador_responsavel_nome', e.target.value)} /></div><div className="form-group"><label>CPF do Contador</label><IMaskInput mask="000.000.000-00" className="form-input" value={escritorio.contador_responsavel_cpf || ''} onAccept={(value) => handleChange('contador_responsavel_cpf', String(value))} /></div><div className="form-group"><label>CRC do Contador</label><IMaskInput mask="aa000000/a-0" prepare={(str) => str.toUpperCase()} className="form-input" value={escritorio.contador_responsavel_crc || ''} onAccept={(value) => handleChange('contador_responsavel_crc', String(value))} /></div></div></>
  );

  // ... (o resto do seu componente, incluindo o return principal, permanece igual)
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

  if (loading) return <div className="content-box">Carregando...</div>;
  if (!user && !loading) return <div className="content-box">Você precisa estar logado.</div>;

  return (
    <div className="content-box">
      <div className="tabs-header">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
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
