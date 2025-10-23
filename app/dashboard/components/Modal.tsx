// Caminho: app/dashboard/components/Modal.tsx
'use client';

import { ReactNode } from 'react';
import styles from './Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
