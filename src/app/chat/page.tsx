'use client';

import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/app/ChatInterface';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function ChatPage() {
  useKeyboardShortcuts();
  const { models, activeModel } = useStore();
  const router = useRouter();
  const purchasedModels = models.filter(m => m.purchased);

  useEffect(() => {
    // If no models purchased, redirect to marketplace
    if (purchasedModels.length === 0) {
      router.push('/marketplace');
    }
  }, [purchasedModels.length, router]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatInterface />
      </div>
    </div>
  );
}
