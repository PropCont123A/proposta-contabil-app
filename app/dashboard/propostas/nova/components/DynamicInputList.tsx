'use client';

import React from 'react';
import styles from '../styles/gerar-proposta.module.css';

interface DynamicInputListProps {
  label: string;
  items: string[];
  onUpdate: (newItems: string[]) => void;
  onDesvincular: () => void; // A prop já existe, vamos garantir seu uso
}

export default function DynamicInputList({ label, items, onUpdate, onDesvincular }: DynamicInputListProps) {
  
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate(newItems);
    onDesvincular(); // ESSENCIAL: Desvincula o cliente ao digitar
  };

  const addItem = () => {
    onUpdate([...items, '']);
    onDesvincular(); // Desvincula também ao adicionar um novo campo
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      onUpdate(items.filter((_, i) => i !== index));
      onDesvincular(); // Desvincula ao remover um campo
    }
  };

  // ... (o resto do componente, incluindo os estilos inline, permanece o mesmo)
  // A lógica dos botões dinâmicos que implementamos antes está correta.
  
  return (
    <div className={styles['proposal-dynamic-group']}>
      <label>{label}</label>
      {items.map((item, index) => (
        <div key={index} className={styles['proposal-dynamic-row']}>
          <input 
            type="text" 
            className={styles['proposal-form-control']} 
            placeholder="Digite o nome do cliente" 
            value={item} 
            onChange={(e) => handleItemChange(index, e.target.value)} 
          />
          <div className={styles['proposal-dynamic-buttons']}>
            {index === items.length - 1 ? (
              <button type="button" onClick={addItem} className={`${styles['proposal-btn-dynamic']} ${styles['proposal-btn-add']}`}>
                +
              </button>
            ) : (
              <button type="button" onClick={() => removeItem(index)} className={`${styles['proposal-btn-dynamic']} ${styles['proposal-btn-remove']}`}>
                -
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
