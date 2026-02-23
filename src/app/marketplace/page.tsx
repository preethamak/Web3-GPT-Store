'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import MarketplacePage from '../models';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function Marketplace() {
  useKeyboardShortcuts();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <MarketplacePage />
      </div>
    </div>
  );
}
