import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  capabilities: string[];
  purchased: boolean;
  featured?: boolean;
}

interface AppState {
  // User state
  isAuthenticated: boolean;
  userAddress: string | null;
  setAuthenticated: (auth: boolean, address: string | null) => void;
  
  // Models
  models: Model[];
  activeModel: string | null;
  setActiveModel: (modelId: string) => void;
  purchaseModel: (modelId: string) => void;
  
  // Conversations
  conversations: Conversation[];
  activeConversation: string | null;
  createConversation: (model: string) => string;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      userAddress: null,
      sidebarOpen: true,
      
      models: [
        {
          id: 'contract-writer',
          name: 'Contract Writer',
          description: 'AI-powered smart contract generator. Describe your contract requirements and get production-ready Solidity code with best practices.',
          price: 49.99,
          icon: '📝',
          capabilities: ['Contract Generation', 'Security Patterns', 'Gas Optimization', 'Documentation'],
          purchased: false,
          featured: true,
        },
        {
          id: 'auditor',
          name: 'Smart Contract Auditor',
          description: 'Advanced security auditor that analyzes your smart contracts for vulnerabilities, provides detailed reports with syntax highlighting.',
          price: 79.99,
          icon: '🔍',
          capabilities: ['Vulnerability Detection', 'Gas Analysis', 'Best Practices', 'Detailed Reports'],
          purchased: false,
          featured: true,
        },
      ],
      
      activeModel: null,
      conversations: [],
      activeConversation: null,
      
      // Actions
      setAuthenticated: (auth, address) => set({ isAuthenticated: auth, userAddress: address }),
      
      setActiveModel: (modelId) => set({ activeModel: modelId }),
      
      purchaseModel: (modelId) => set((state) => ({
        models: state.models.map((model) =>
          model.id === modelId ? { ...model, purchased: true } : model
        ),
      })),
      
      createConversation: (model) => {
        const id = `conv-${Date.now()}`;
        const newConversation: Conversation = {
          id,
          title: 'New Conversation',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model,
        };
        
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversation: id,
        }));
        
        return id;
      },
      
      setActiveConversation: (id) => set({ activeConversation: id }),
      
      addMessage: (conversationId, message) => set((state) => {
        const conversations = state.conversations.map((conv) => {
          if (conv.id === conversationId) {
            const newMessage: Message = {
              ...message,
              id: `msg-${Date.now()}-${Math.random()}`,
              timestamp: new Date(),
            };
            
            const updatedMessages = [...conv.messages, newMessage];
            
            // Auto-generate title from first user message
            const title = conv.messages.length === 0 && message.role === 'user'
              ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
              : conv.title;
            
            return {
              ...conv,
              messages: updatedMessages,
              title,
              updatedAt: new Date(),
            };
          }
          return conv;
        });
        
        return { conversations };
      }),
      
      deleteConversation: (id) => set((state) => ({
        conversations: state.conversations.filter((conv) => conv.id !== id),
        activeConversation: state.activeConversation === id ? null : state.activeConversation,
      })),
      
      updateConversationTitle: (id, title) => set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === id ? { ...conv, title } : conv
        ),
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        models: state.models,
        conversations: state.conversations,
        activeModel: state.activeModel,
      }),
    }
  )
);
