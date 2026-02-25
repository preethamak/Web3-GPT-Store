'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Shield, Zap, Sparkles, Cpu, Network, Infinity } from 'lucide-react';
import { useActiveAccount } from 'thirdweb/react';
import Link from 'next/link';
import Header from '@/components/Header';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const FeatureCard = ({ icon: Icon, title, desc, gradient }: { icon: any; title: string; desc: string; gradient: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative p-6 md:p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md hover:border-white/20 transition-colors group overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-all`} />
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg transition-shadow`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm md:text-base leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

export default function HomePage() {
  const account = useActiveAccount();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000" />
      </div>

      <Header />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
          <motion.div initial="hidden" animate="show" variants={container} className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div variants={item} className="inline-block mb-6 md:mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm text-white font-medium">Next-Gen AI Smart Contract Studio</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-tight">
              <span className="block text-white mb-3">Build. Audit. Deploy.</span>
              <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">With AI Intelligence</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p variants={item} className="text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              Harness the power of specialized AI models to write, audit, and optimize your smart contracts with confidence
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/chat" className="group w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2">
                Start Building
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/marketplace" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-center">
                Explore Models
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: '3', label: 'AI Models' },
              { value: '∞', label: 'Code Iterations' },
              { value: '24/7', label: 'Available' },
              { value: 'Web3', label: 'Powered' },
            ].map((stat, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.05 }} className="text-center p-6 md:p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">Specialized AI Models</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose from our collection of fine-tuned AI models, each designed for specific blockchain development tasks
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div variants={item}>
              <FeatureCard
                icon={Code}
                title="Smart Contract Developer"
                desc="Generate optimized Solidity code, implement design patterns, and build secure contracts from scratch."
                gradient="from-green-400 to-green-600"
              />
            </motion.div>
            <motion.div variants={item}>
              <FeatureCard
                icon={Shield}
                title="Contract Auditor"
                desc="Analyze code for vulnerabilities, gas optimization, and security best practices with detailed reports."
                gradient="from-red-400 to-red-600"
              />
            </motion.div>
            <motion.div variants={item}>
              <FeatureCard
                icon={Zap}
                title="Basic Assistant"
                desc="Quick answers about blockchain, Solidity fundamentals, and general Web3 development questions."
                gradient="from-yellow-400 to-yellow-600"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Simple, intuitive, and powerful</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative">
            {[
              { num: 1, title: 'Connect', desc: 'Link your Web3 wallet' },
              { num: 2, title: 'Choose', desc: 'Select an AI model' },
              { num: 3, title: 'Build', desc: 'Ask & get AI responses' },
              { num: 4, title: 'Deploy', desc: 'Export & launch' },
            ].map((step, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="relative">
                <div className="text-center p-6 md:p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-white text-lg">
                    {step.num}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">Why ContractAI?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Cpu, title: 'Advanced Models', desc: 'Latest AI technology optimized for blockchain', gradient: 'from-blue-400 to-blue-600' },
              { icon: Network, title: 'Web3 Native', desc: 'Built for decentralized applications', gradient: 'from-green-400 to-green-600' },
              { icon: Infinity, title: 'Unlimited Potential', desc: 'Scale your projects without limits', gradient: 'from-purple-400 to-purple-600' },
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }}>
                <FeatureCard icon={feature.icon} title={feature.title} desc={feature.desc} gradient={feature.gradient} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32 mb-16 md:mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl border border-white/20 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent backdrop-blur-md p-8 md:p-12 lg:p-20 overflow-hidden">
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6">Ready to Build?</h2>
              <p className="text-gray-300 text-lg mb-8">Join thousands of developers using ContractAI to create secure, optimized smart contracts</p>
              <Link href={account ? '/chat' : '/'} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950/50 backdrop-blur-md">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-4">ContractAI</h3>
                <p className="text-gray-400 text-sm">Next-gen AI for smart contract development</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/chat" className="hover:text-white transition">Chat</Link></li>
                  <li><Link href="/marketplace" className="hover:text-white transition">Marketplace</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-white transition cursor-pointer">Twitter</li>
                  <li className="hover:text-white transition cursor-pointer">Discord</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2026 ContractAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </main>
  );
}
