'use client';

// A linha que importava 'ClientModal' foi REMOVIDA daqui.
import { useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { Cliente } from '../state'; // Precisamos importar o tipo Cliente

// Lista de UFs do Brasil para o campo de seleção
const ufsBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

type Section = 'dadosGerais' | 'contato' | 'endereco';

type ClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clienteData: Partial<Cliente>) => void;
  clientToEdit: Partial<Cliente> | null;
};

export default function ClientModal({ isOpen, onClose, onSave, clientToEdit }: ClientModalProps) {
  const [cliente, setCliente] = useState<Partial<Cliente>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [openSection, setOpenSection] = useState<Section>('dadosGerais');

  useEffect(() => {
    if (isOpen) {
      setCliente(clientToEdit || { tipo_pessoa: 'Jurídica' });
      setOpenSection('dadosGerais');
    }
  }, [isOpen, clientToEdit]);

  const handleChange = (name: string, value: string) => {
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(cliente);
    setIsSaving(false);
  };

  const toggleSection = (section: Section) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const handleBuscarCnpj = () => { alert('Funcionalidade de busca por CNPJ/CPF será implementada no futuro!'); };
  const handleBuscarCep = () => { alert('Funcionalidade de busca de endereço por CEP será implementada no futuro!'); };

  if (!isOpen) return null;

  const isPj = cliente.tipo_pessoa === 'Jurídica';

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <h2>{clientToEdit?.id ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="modal-body">
          {/* Seção Dados Gerais */}
          <div className="form-section">
            <div className="section-header" onClick={() => toggleSection('dadosGerais')}>
              <h3>Dados Gerais</h3>
              <i className={`fas fa-chevron-down ${openSection === 'dadosGerais' ? 'open' : ''}`}></i>
            </div>
            {openSection === 'dadosGerais' && (
              <div className="section-content grid-2-col">
                <div className="modal-form-group">
                  <label>Tipo de Pessoa</label>
                  <select name="tipo_pessoa" className="modal-input" value={cliente.tipo_pessoa || 'Jurídica'} onChange={(e) => handleChange(e.target.name, e.target.value)}>
                    <option value="Jurídica">Jurídica</option>
                    <option value="Física">Física</option>
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>{isPj ? 'CNPJ' : 'CPF'}</label>
                  <div className="input-with-button">
                    <IMaskInput mask={isPj ? '00.000.000/0000-00' : '000.000.000-00'} name="cnpj_cpf" className="modal-input" value={cliente.cnpj_cpf || ''} onAccept={(value) => handleChange('cnpj_cpf', String(value))} />
                    <button onClick={handleBuscarCnpj} className="btn-input-action">Buscar</button>
                  </div>
                </div>
                <div className="modal-form-group">
                  <label>{isPj ? 'Razão Social' : 'Nome Completo'}</label>
                  <input type="text" name="nome_fantasia_ou_nome" className="modal-input" value={cliente.nome_fantasia_ou_nome || ''} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                </div>
                {isPj && (
                  <div className="modal-form-group">
                    <label>Nome Fantasia</label>
                    <input type="text" name="nome_fantasia" className="modal-input" value={(cliente as any).nome_fantasia || ''} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seção Contato */}
          <div className="form-section">
            <div className="section-header" onClick={() => toggleSection('contato')}>
              <h3>Contato</h3>
              <i className={`fas fa-chevron-down ${openSection === 'contato' ? 'open' : ''}`}></i>
            </div>
            {openSection === 'contato' && (
              <div className="section-content grid-2-col">
                <div className="modal-form-group">
                  <label>Nome da pessoa de contato</label>
                  <input 
                    type="text" 
                    name="contato_nome"  // <-- A CORREÇÃO É AQUI
                    className="modal-input" 
                    value={(cliente as any).contato_nome || ''} 
                    onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  />
                </div>
                <div className="modal-form-group">
                  <label>Telefone / WhatsApp</label>
                  <IMaskInput mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]} name="telefone" className="modal-input" value={cliente.telefone || ''} onAccept={(value) => handleChange('telefone', String(value))} />
                </div>
                <div className="modal-form-group span-2">
                  <label>E-mail</label>
                  <input type="email" name="email" className="modal-input" value={cliente.email || ''} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Seção Endereço */}
          <div className="form-section">
            <div className="section-header" onClick={() => toggleSection('endereco')}>
              <h3>Endereço</h3>
              <i className={`fas fa-chevron-down ${openSection === 'endereco' ? 'open' : ''}`}></i>
            </div>
            {openSection === 'endereco' && (
              <div className="section-content grid-3-col">
                <div className="modal-form-group">
                  <label>CEP</label>
                  <div className="input-with-button">
                    <IMaskInput mask="00000-000" name="cep" className="modal-input" value={cliente.cep || ''} onAccept={(value) => handleChange('cep', String(value))} />
                    <button onClick={handleBuscarCep} className="btn-input-action">Buscar</button>
                  </div>
                </div>
                <div className="modal-form-group span-2">
                  <label>Endereço</label>
                  <input type="text" name="endereco" className="modal-input" value={cliente.endereco || ''} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                </div>
                <div className="modal-form-group">
                  <label>Número</label>
                  <input type="text" name="numero" className="modal-input" value={cliente.numero || ''} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                </div>
                <div className="modal-form-group">
                  <label>Bairro</label>
                  <input type="text" name="bairro" className="modal-input" value={cliente.bairro || ''} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                </div>
                <div className="modal-form-group">
                  <label>Complemento</label>
                  <input type="text" name="complemento" className="modal-input" value={cliente.complemento || ''} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                </div>
                <div className="modal-form-group">
                  <label>Cidade</label>
                  <input type="text" name="cidade" className="modal-input" value={cliente.cidade || ''} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                </div>
                <div className="modal-form-group">
                  <label>Estado</label>
                  <select name="estado" className="modal-input" value={cliente.estado || ''} onChange={(e) => handleChange(e.target.name, e.target.value)}>
                    <option value="">Selecione a UF</option>
                    {ufsBrasil.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary" disabled={isSaving}>Cancelar</button>
          <button onClick={handleSaveClick} className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
