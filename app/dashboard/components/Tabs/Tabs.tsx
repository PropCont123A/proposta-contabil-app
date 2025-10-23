// Caminho: app/dashboard/components/Tabs/Tabs.tsx
// VERSÃO 2.0 - Com wrapper para o layout fixo

'use client';

import React from 'react';
import styles from './Tabs.module.css';

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabClick }: TabsProps) {
  return (
    // ✅ ADICIONAMOS UM WRAPPER PARA O COMPORTAMENTO "STICKY"
    <div className={styles.tabsWrapper}>
      <div className={styles.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabClick(tab.id)}
            disabled={tab.disabled}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
