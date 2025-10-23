// Caminho: app/dashboard/propostas/editar/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import EditFormPage from './EditForm';

export default function EditarPropostaPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Carregando...</p>;
  }

  return <EditFormPage id={id} />;
}
