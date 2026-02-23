'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export const useKeyboardShortcuts = () => {
  const { 
    createConversation, 
    setActiveConversation, 
    activeModel,
    setSidebarOpen,
    sidebarOpen,
  } = useStore();
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }

      // Cmd/Ctrl + N: New chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        if (activeModel) {
          const id = createConversation(activeModel);
          setActiveConversation(id);
          router.push('/chat');
        }
      }

      // Cmd/Ctrl + M: Go to marketplace
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        router.push('/marketplace');
      }

      // Cmd/Ctrl + H: Go to home
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        router.push('/');
      }

      // Escape: Close sidebar on mobile
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeModel, createConversation, setActiveConversation, router, setSidebarOpen, sidebarOpen]);
};

// Keyboard shortcuts info component
export const KeyboardShortcutsInfo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`text-xs space-y-2 ${className}`}>
      <h3 className="font-semibold text-[var(--text-secondary)] mb-3">Keyboard Shortcuts</h3>
      <div className="space-y-1 text-[var(--text-tertiary)]">
        <div className="flex justify-between">
          <span>New Chat</span>
          <kbd className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">⌘N</kbd>
        </div>
        <div className="flex justify-between">
          <span>Toggle Sidebar</span>
          <kbd className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">⌘K</kbd>
        </div>
        <div className="flex justify-between">
          <span>Marketplace</span>
          <kbd className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">⌘M</kbd>
        </div>
        <div className="flex justify-between">
          <span>Home</span>
          <kbd className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">⌘H</kbd>
        </div>
      </div>
    </div>
  );
};
