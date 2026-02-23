"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Shield, Zap, Sparkles } from 'lucide-react';
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { FloatingOrbs, GridPattern, AnimatedCard, GlowButton } from '@/components/3DElements';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function Home() {
  const { models } = useStore();
  const purchasedCount = models.filter(m => m.purchased).length;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingOrbs />
      <GridPattern />
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">ContractAI</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/marketplace">
                <button className="px-4 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-all">
                  Marketplace
                </button>
              </Link>
              
              <ConnectButton
                client={client}
                appMetadata={{
                  name: "ContractAI",
                  url: "https://contractai.io",
                }}
              />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-6">
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass border border-violet-500/30">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm text-violet-400 font-medium">AI-Powered Smart Contract Studio</span>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                Build & Audit
                <br />
                <span className="gradient-text">Smart Contracts</span>
                <br />
                with AI
              </h1>

              <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-3xl mx-auto">
                Professional AI models that write secure smart contracts and perform comprehensive audits.
                Transform your ideas into production-ready code.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/marketplace">
                  <GlowButton variant="primary" size="lg">
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GlowButton>
                </Link>

                {purchasedCount > 0 && (
                  <Link href="/chat">
                    <button className="px-8 py-4 rounded-xl border border-[var(--border-secondary)] hover:border-violet-500 transition-all font-semibold">
                      Go to Chat
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">2</div>
                <div className="text-sm text-[var(--text-secondary)]">AI Models</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">100%</div>
                <div className="text-sm text-[var(--text-secondary)]">Security Focused</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-sm text-[var(--text-secondary)]">Available</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Powerful <span className="gradient-text">AI Models</span>
              </h2>
              <p className="text-xl text-[var(--text-secondary)]">
                Choose the right tool for your needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedCard delay={0.1}>
                <div className="p-8 rounded-2xl glass border border-[var(--border-secondary)] h-full card-3d">
                  <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center mb-6">
                    <Code className="w-8 h-8 text-violet-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Contract Writer</h3>
                  
                  <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                    Describe your smart contract requirements in plain English and get production-ready
                    Solidity code with best practices, security patterns, and comprehensive documentation.
                  </p>

                  <ul className="space-y-3 mb-6">
                    {['ERC Standards Support', 'Gas Optimization', 'Security Patterns', 'Full Documentation'].map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold gradient-text">$49.99</span>
                    <span className="text-[var(--text-tertiary)] ml-2">one-time</span>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <div className="p-8 rounded-2xl glass border border-[var(--border-secondary)] h-full card-3d">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-cyan-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Smart Contract Auditor</h3>
                  
                  <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                    Comprehensive security audits that analyze your smart contracts for vulnerabilities,
                    gas inefficiencies, and provide detailed reports with syntax-highlighted code.
                  </p>

                  <ul className="space-y-3 mb-6">
                    {['Vulnerability Detection', 'Gas Analysis', 'Best Practice Checks', 'Detailed Reports'].map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-cyan-600/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold gradient-text">$79.99</span>
                    <span className="text-[var(--text-tertiary)] ml-2">one-time</span>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-strong rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Connect your wallet and choose your AI model to start building secure smart contracts today.
            </p>

            <Link href="/marketplace">
              <GlowButton variant="primary" size="lg">
                <Zap className="w-5 h-5 mr-2" />
                Explore Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </GlowButton>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-[var(--border-primary)]">
          <div className="text-center text-[var(--text-secondary)]">
            <p>&copy; 2026 ContractAI. Built with ❤️ for the Web3 community.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
