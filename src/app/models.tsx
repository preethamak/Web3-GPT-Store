'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Sparkles, Code, Lock, MessageSquare } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AnimatedCard, GlowButton } from '@/components/3DElements';
import { useRouter } from 'next/navigation';

const MarketplacePage: React.FC = () => {
  const { models, purchaseModel, createConversation, setActiveConversation, setActiveModel } = useStore();
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const handlePurchase = async (modelId: string) => {
    // In a real app, this would integrate with payment/blockchain
    purchaseModel(modelId);
    setActiveModel(modelId);
    
    // Create a new conversation with this model
    const convId = createConversation(modelId);
    setActiveConversation(convId);
    
    // Navigate to chat
    router.push('/chat');
  };

  const handleTryModel = (modelId: string) => {
    setActiveModel(modelId);
    const convId = createConversation(modelId);
    setActiveConversation(convId);
    router.push('/chat');
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass border border-violet-500/30">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-400 font-medium">AI Models</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your <span className="gradient-text">AI Model</span>
          </h1>
          
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Professional AI models for smart contract development and auditing.
            Purchase once, use forever.
          </p>
        </motion.div>

        {/* Model Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {models.map((model, index) => (
            <AnimatedCard key={model.id} delay={index * 0.1}>
              <div
                className={`
                  relative h-full p-8 rounded-2xl glass border-2 cursor-pointer transition-all
                  ${selectedModel === model.id ? 'border-violet-500 glow' : 'border-[var(--border-secondary)]'}
                  ${model.featured ? 'ring-2 ring-violet-500/20' : ''}
                `}
                onClick={() => setSelectedModel(model.id)}
              >
                {/* Featured Badge */}
                {model.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-semibold">
                      FEATURED
                    </div>
                  </div>
                )}

                {/* Purchased Badge */}
                {model.purchased && (
                  <div className="absolute top-4 right-4">
                    <div className="p-2 rounded-full bg-green-600 text-white">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="text-6xl mb-6">{model.icon}</div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{model.name}</h3>
                
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                  {model.description}
                </p>

                {/* Capabilities */}
                <div className="space-y-3 mb-6">
                  {model.capabilities.map((capability) => (
                    <div key={capability} className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-600/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-violet-400" />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {capability}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold gradient-text">
                    ${model.price}
                  </span>
                  <span className="text-[var(--text-tertiary)] ml-2">one-time</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  {model.purchased ? (
                    <GlowButton
                      variant="primary"
                      size="lg"
                      onClick={() => handleTryModel(model.id)}
                      className="w-full"
                    >
                      <MessageSquare className="w-5 h-5 mr-2 inline" />
                      Start Chat
                    </GlowButton>
                  ) : (
                    <>
                      <GlowButton
                        variant="primary"
                        size="lg"
                        onClick={() => handlePurchase(model.id)}
                        className="w-full"
                      >
                        <Zap className="w-5 h-5 mr-2 inline" />
                        Purchase Now
                      </GlowButton>
                      
                      <button
                        onClick={() => handleTryModel(model.id)}
                        className="w-full px-6 py-3 rounded-xl border border-[var(--border-secondary)] hover:border-violet-500 transition-all text-sm font-medium"
                      >
                        Try Demo
                      </button>
                    </>
                  )}
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-strong rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose ContractAI?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Audited</h3>
              <p className="text-[var(--text-secondary)]">
                All models follow security best practices and industry standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Production Ready</h3>
              <p className="text-[var(--text-secondary)]">
                Generate deployment-ready code with comprehensive documentation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-600/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lifetime Access</h3>
              <p className="text-[var(--text-secondary)]">
                One-time purchase with unlimited usage and future updates
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketplacePage;