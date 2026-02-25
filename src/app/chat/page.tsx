'use client';

import React, { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function ChatPage() {
  useKeyboardShortcuts();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure localStorage is loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <ChatInterface />
    </div>
  );
}
