'use client';

import { useState, useEffect, useRef } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { client } from '@/app/client';
import { balanceOf } from 'thirdweb/extensions/erc1155';
import { useStore } from '@/store/useStore';
import {
  Send, Trash2, Menu, X, Home, Store, Copy, Check, ChevronDown,
  Sparkles, MessageSquare, AlertCircle, Plus, Download, FileText,
  Zap, Shield, Code, LogOut
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';

const CONTRACT_ADDRESS = '0xFa41D7a572152878F2bdBA7B4Dbe6D391042D4F9';

const MODELS = [
  { id: 'basic', name: 'Assistant', description: 'Web3 & Blockchain', tokenId: -1, icon: Sparkles, color: 'goog-blue' },
  { id: 'auditor', name: 'Auditor', description: 'Security Analysis', tokenId: 0, icon: Shield, color: 'goog-red' },
  { id: 'developer', name: 'Developer', description: 'Code Generation', tokenId: 1, icon: Code, color: 'goog-green' },
];

interface Message { role: 'user' | 'assistant'; content: string; }

export default function ChatInterface() {
  const account = useActiveAccount();
  const [selectedModelId, setSelectedModelId] = useState('basic');
  const [previousModelId, setPreviousModelId] = useState<string | null>(null);
  const [ownedModels, setOwnedModels] = useState<typeof MODELS>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { conversations, activeConversation, setActiveConversation, addMessage: addMessageToStore, createConversation, deleteConversation } = useStore();
  const currentConversation = conversations.find((c) => c.id === activeConversation);
  const selectedModel = MODELS.find((m) => m.id === selectedModelId) || MODELS[0];

  // Check NFT ownership
  useEffect(() => {
    const checkOwnership = async () => {
      if (!account?.address) { setOwnedModels([MODELS[0]]); return; }
      try {
        const contract = getContract({ client, chain: sepolia, address: CONTRACT_ADDRESS });
        const owned = [MODELS[0]];
        for (const model of MODELS.slice(1)) {
          try {
            const balance = await balanceOf({ contract, owner: account.address, tokenId: BigInt(model.tokenId) });
            if (balance > 0n) owned.push(model);
          } catch (error) { console.error(`Error checking balance for ${model.name}:`, error); }
        }
        setOwnedModels(owned);
      } catch (error) { console.error('Ownership check error:', error); setOwnedModels([MODELS[0]]); }
    };
    checkOwnership();
  }, [account?.address]);

  // Handle model switch
  const handleModelSwitch = (newModelId: string) => {
    if (newModelId !== selectedModelId) {
      setPreviousModelId(selectedModelId);
      setSelectedModelId(newModelId);
      const newConvId = createConversation(newModelId);
      setActiveConversation(newConvId);
      setShowModelDropdown(false);
    }
  };

  // Load conversation
  useEffect(() => {
    if (currentConversation) { setMessages(currentConversation.messages); setError(null); } 
    else { setMessages([]); }
  }, [activeConversation, currentConversation]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    let conversationId = activeConversation;
    if (!conversationId) {
      conversationId = createConversation(selectedModel.id);
      setActiveConversation(conversationId);
    }

    addMessageToStore(conversationId, userMessage);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          modelId: selectedModel.id,
          tokenId: selectedModel.tokenId,
          address: account?.address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            assistantMessage += chunk;
            setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
          }
        } catch (error) { console.error('Error reading stream:', error); throw new Error('Error reading response stream'); }
      }

      if (assistantMessage.trim()) {
        addMessageToStore(conversationId, { role: 'assistant', content: assistantMessage });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMsg);
      const errorMessage: Message = { role: 'assistant', content: `Error: ${errorMsg}. Please try again.` };
      setMessages([...newMessages, errorMessage]);
      addMessageToStore(conversationId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const exportAsMarkdown = () => {
    const content = `# Chat Export - ${selectedModel.name}\n\nDate: ${new Date().toLocaleString()}\n\n---\n\n${messages.map(m => `**${m.role === 'user' ? 'You' : selectedModel.name}:**\n\n${m.content}`).join('\n\n---\n\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar - Always visible on desktop, toggle on mobile */}
      <div className={`fixed lg:relative w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300 z-50 lg:z-auto ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar overlay on mobile */}
        {isHistoryOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsHistoryOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" />}
        
        {/* Sidebar content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Chat History</h2>
              <button onClick={() => setIsHistoryOpen(false)} className="lg:hidden p-1 hover:bg-gray-200 rounded-lg">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <button onClick={() => { createConversation(selectedModelId); setIsHistoryOpen(false); }} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-google-blue to-goog-blue-600 text-white font-medium rounded-lg hover:shadow-md transition-all text-sm">
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.length === 0 ? (
              <p className="text-center text-gray-500 text-sm mt-8">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  whileHover={{ x: 2 }}
                  onClick={() => {
                    setActiveConversation(conv.id);
                    setIsHistoryOpen(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all text-sm group ${
                    conv.id === activeConversation
                      ? 'bg-google-blue/15 border border-google-blue text-gray-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-200 border border-transparent'
                  }`}
                >
                  <p className="truncate font-medium text-sm">{conv.title}</p>
                  <p className={`text-xs truncate mt-1 ${conv.id === activeConversation ? 'text-gray-700' : 'text-gray-500'}`}>
                    {conv.messages[0]?.content.substring(0, 35) || 'New chat'}
                  </p>
                </motion.button>
              ))
            )}
          </div>
          
          {/* Footer Navigation */}
          <div className="p-3 border-t border-gray-200 space-y-2">
            <Link href="/" className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all text-sm">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/marketplace" className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all text-sm">
              <Store className="w-4 h-4" />
              Models
            </Link>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="p-2 lg:hidden hover:bg-gray-100 rounded-lg transition-all">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              
              {/* Model Selector */}
              <div className="relative">
                <button onClick={() => setShowModelDropdown(!showModelDropdown)} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 transition-all font-medium text-gray-900">
                  <selectedModel.icon className="w-5 h-5 text-google-blue" />
                  <span>{selectedModel.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                
                <AnimatePresence>
                  {showModelDropdown && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-30 overflow-hidden">
                      {ownedModels.map((model) => (
                        <button key={model.id} onClick={() => handleModelSwitch(model.id)} className={`w-full px-4 py-3 text-left border-b border-gray-100 last:border-0 transition-all flex items-start gap-3 hover:bg-gray-50 ${model.id === selectedModelId ? 'bg-google-blue/10' : ''}`}>
                          <model.icon className="w-5 h-5 text-google-blue mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{model.name}</p>
                            <p className="text-xs text-gray-600">{model.description}</p>
                          </div>
                          {model.id === selectedModelId && <Check className="w-5 h-5 text-google-blue flex-shrink-0 mt-0.5" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowExportMenu(!showExportMenu)} className="p-2 hover:bg-gray-100 rounded-lg transition-all" title="Export">
                <Download className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Export Menu */}
          <AnimatePresence>
            {showExportMenu && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-3 flex gap-2">
                <button onClick={exportAsMarkdown} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 font-medium text-sm transition-all">
                  <FileText className="w-4 h-4" />
                  Export as Markdown
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-google-blue/20 to-google-green/20 flex items-center justify-center mx-auto mb-4">
                  <selectedModel.icon className="w-8 h-8 text-google-blue" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Chatting with {selectedModel.name}</h2>
                <p className="text-gray-600">Ask anything about Web3, smart contracts, or code generation</p>
              </motion.div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-google-blue to-google-green flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {selectedModel.name[0]}
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-google-blue text-white shadow-md' 
                      : 'bg-gray-100 text-gray-900 border border-gray-200 shadow-sm'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2">
                        <ReactMarkdown components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = String(children).replace(/\n$/, '');
                            return !inline && match ? (
                              <div className="relative group my-2 bg-gray-900 rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => handleCopyCode(codeString)} 
                                  className="absolute right-2 top-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                  {copiedCode === codeString ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-gray-300" />
                                  )}
                                </button>
                                <SyntaxHighlighter 
                                  style={vscDarkPlus} 
                                  language={match[1]} 
                                  PreTag="div" 
                                  className="!bg-gray-900 !rounded-lg text-xs md:text-sm !m-0 !p-4 !pr-12"
                                  {...props}
                                >
                                  {codeString}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className="bg-gray-800 text-gray-100 px-2 py-1 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
                          h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold mt-3 mb-2 text-gray-900" {...props} />,
                          h3: ({ node, ...props }: any) => <h3 className="text-base font-bold mt-2 mb-1 text-gray-900" {...props} />,
                          ul: ({ node, ...props }: any) => <ul className="list-disc list-inside space-y-1 my-2 text-gray-900" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside space-y-1 my-2 text-gray-900" {...props} />,
                          p: ({ node, ...props }: any) => <p className="my-2 text-gray-900" {...props} />,
                          blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-google-blue pl-4 italic my-2 text-gray-700 bg-blue-50 py-2 rounded-r" {...props} />,
                          a: ({ node, ...props }: any) => <a className="text-google-blue hover:underline" {...props} />,
                        }}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed">{message.content}</p>
                    )}
                  </div>
                  
                  {message.role === 'user' && <div className="w-8" />}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-google-blue to-google-green flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-google-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-google-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-google-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {error && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 flex gap-3 items-start max-w-[80%]">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4 md:p-6">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <textarea 
                ref={textareaRef} 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} 
                placeholder={`Message ${selectedModel.name}...`} 
                className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-google-blue focus:ring-2 focus:ring-google-blue/20 resize-none max-h-24 text-sm transition-all"
                rows={1} 
                disabled={isLoading}
              />
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="px-4 py-3 bg-google-blue hover:bg-goog-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-1">Use Shift + Enter for a new line</p>
          </form>
        </div>
      </div>
    </div>
  );
}
