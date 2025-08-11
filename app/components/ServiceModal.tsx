import { Service } from '../../../../types';
import { useEffect, useState } from "react";

type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
  serviceToEdit: Partial<Service> | null;
};

export default function ServiceModal({ isOpen, onClose, onSave, serviceToEdit }: ServiceModalProps) {
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [descriptions, setDescriptions] = useState<string[]>(['']);

  useEffect(() => {
    if (serviceToEdit && serviceToEdit.id) {
      setCurrentService(serviceToEdit);
      setDescriptions(serviceToEdit.descriptions && serviceToEdit.descriptions.length > 0 ? serviceToEdit.descriptions : ['']);
    } else {
      setCurrentService({ name: '', value: 0, category: 'Eventual', descriptions: [''] });
      setDescriptions(['']);
    }
  }, [serviceToEdit, isOpen]);

  const handleSave = () => {
    const serviceData = { ...currentService, descriptions: descriptions.filter(d => d.trim() !== '') };
    onSave(serviceData);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const addDescriptionField = () => {
    setDescriptions([...descriptions, '']);
  };

  const removeDescriptionField = (index: number) => {
    const newDescriptions = descriptions.filter((_, i) => i !== index);
    setDescriptions(newDescriptions.length > 0 ? newDescriptions : ['']);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '600px' }}>
        <h2>{serviceToEdit?.id ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h2>
        <div className="form-group">
          <label>Nome do Serviço</label>
          <input type="text" className="form-control" value={currentService.name || ''} onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Descrições</label>
          {descriptions.map((desc, index) => (
            <div key={index} className="dynamic-field" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input type="text" className="form-control" value={desc} onChange={(e) => handleDescriptionChange(index, e.target.value)} />
              <button onClick={() => index === descriptions.length - 1 ? addDescriptionField() : removeDescriptionField(index)} className={index === descriptions.length - 1 ? 'btn btn-primary' : 'btn btn-danger'}><i className={`fas ${index === descriptions.length - 1 ? 'fa-plus' : 'fa-times'}`}></i></button>
            </div>
          ))}
        </div>
        <div className="form-group">
          <label>Valor</label>
          <input type="number" step="0.01" className="form-control" value={currentService.value || ''} onChange={(e) => setCurrentService({ ...currentService, value: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <select className="form-control" value={currentService.category || 'Eventual'} onChange={(e) => setCurrentService({ ...currentService, category: e.target.value as 'Recorrente' | 'Eventual' })}>
            <option value="Eventual">Eventual</option>
            <option value="Recorrente">Recorrente</option>
          </select>
        </div>
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn btn-primary">Salvar</button>
        </div>
      </div>
    </div>
  );
}
