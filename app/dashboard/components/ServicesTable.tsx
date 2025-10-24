import { Service } from '@/types';


type ServicesTableProps = {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
};

export default function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  return (
    <table className="services-table">
      <thead>
        <tr>
          <th>Tipo de Serviço</th>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Categoria</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.id}>
            <td>{service.name}</td>
            <td>{service.descriptions.join(', ')}</td>
            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.value)}</td>
            <td>{service.category}</td>
            <td>
              <button onClick={() => onEdit(service)} className="btn btn-edit"><i className="fas fa-pencil-alt"></i></button>
              <button onClick={() => onDelete(service.id)} className="btn btn-danger"><i className="fas fa-trash"></i></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
