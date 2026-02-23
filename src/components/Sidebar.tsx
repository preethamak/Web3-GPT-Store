'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  ShoppingBag,
  Menu,
  X,
  Trash2,
  Home,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    sidebarOpen,
    setSidebarOpen,
    conversations,
    activeConversation,
    setActiveConversation,
    createConversation,
    deleteConversation,
    activeModel,
    models,
  } = useStore();

  const handleNewChat = () => {
    if (activeModel) {
      const id = createConversation(activeModel);
      setActiveConversation(id);
    }
  };

  const purchasedModels = models.filter(m => m.purchased);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed lg:static top-0 left-0 h-screen w-80 glass-strong border-r border-[var(--border-primary)] z-40 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text">
                      ContractAI
                    </h1>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Smart Contract Studio
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNewChat}
                  disabled={!activeModel || purchasedModels.length === 0}
                  className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Chat</span>
                </button>
              </div>

              {/* Navigation */}
              <div className="px-4 py-4 border-b border-[var(--border-primary)]">
                <nav className="space-y-1">
                  <Link href="/">
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                        pathname === '/'
                          ? 'bg-violet-600/20 text-violet-400'
                          : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      <span className="font-medium">Home</span>
                    </div>
                  </Link>
                  
                  <Link href="/chat">
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                        pathname === '/chat'
                          ? 'bg-violet-600/20 text-violet-400'
                          : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">Chat</span>
                    </div>
                  </Link>

                  <Link href="/marketplace">
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                        pathname === '/marketplace'
                          ? 'bg-violet-600/20 text-violet-400'
                          : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="font-medium">Marketplace</span>
                      {purchasedModels.length === 0 && (
                        <span className="ml-auto bg-amber-600 text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </Link>
                </nav>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
                <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                  Recent Chats
                </h3>
                <div className="space-y-1">
                  {conversations.length === 0 ? (
                    <p className="text-sm text-[var(--text-tertiary)] text-center py-8">
                      No conversations yet
                    </p>
                  ) : (
                    conversations.map((conv) => (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group relative px-4 py-3 rounded-lg cursor-pointer transition-all ${
                          activeConversation === conv.id
                            ? 'bg-violet-600/20 text-violet-400'
                            : 'hover:bg-[var(--bg-hover)]'
                        }`}
                        onClick={() => setActiveConversation(conv.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {conv.title}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              {conv.messages.length} messages
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[var(--border-primary)]">
                <div className="text-xs text-[var(--text-tertiary)] text-center">
                  {purchasedModels.length > 0 ? (
                    <p>
                      {purchasedModels.length} model{purchasedModels.length > 1 ? 's' : ''} active
                    </p>
                  ) : (
                    <p>Visit marketplace to purchase models</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;