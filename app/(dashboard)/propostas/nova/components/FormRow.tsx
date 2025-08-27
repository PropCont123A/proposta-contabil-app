// app/(dashboard)/propostas/nova/components/FormRow.tsx
import React from 'react';
import styles from '../styles/gerar-proposta.module.css';

// Este componente recebe 'children', que serão os 3 campos que queremos alinhar.
export default function FormRow({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles['form-row']}>
      {children}
    </div>
  );
}
