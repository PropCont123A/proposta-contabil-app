'use client';

import React from 'react';

// Você pode instalar a biblioteca 'react-icons' com: npm install react-icons
import { FaSyncAlt, FaBolt } from 'react-icons/fa';

interface CategoryTagProps {
  category: 'Recorrente' | 'Eventual' | string;
}

const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  const isRecorrente = category === 'Recorrente';

  const tagStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 600,
    // Usando as cores do seu Design System
    backgroundColor: isRecorrente ? 'rgba(0, 123, 255, 0.1)' : 'rgba(253, 126, 20, 0.1)',
    color: isRecorrente ? '#007bff' : '#fd7e14',
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '6px',
  };

  return (
    <span style={tagStyle}>
      {isRecorrente ? <FaSyncAlt style={iconStyle} /> : <FaBolt style={iconStyle} />}
      {category}
    </span>
  );
};

export default CategoryTag;
