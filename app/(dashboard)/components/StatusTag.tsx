// app/components/StatusTag.tsx
type StatusTagProps = {
  status: string;
};

const statusStyles: { [key: string]: string } = {
  'Em negociação': 'bg-yellow-100 text-yellow-800',
  'Contratado': 'bg-green-100 text-green-800',
  'Recusado': 'bg-red-100 text-red-800',
  'Pendente': 'bg-blue-100 text-blue-800',
};

const defaultStyle = 'bg-gray-100 text-gray-800';

export default function StatusTag({ status }: StatusTagProps) {
  const style = statusStyles[status] || defaultStyle;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
      {status}
    </span>
  );
}
