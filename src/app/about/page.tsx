'use client';

import { motion } from 'framer-motion';
import { Sparkles, Code, Shield, Zap, Users, Lock, TrendingUp, Wallet } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Header />

      <div className="container mx-auto px-6 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ContractAI</span>
          </h1>
          <p className="text-xl text-gray-400">
            The future of smart contract development is here. Own AI-powered tools as NFTs on the blockchain.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20 grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              We believe the future of software development lies at the intersection of AI and blockchain. ContractAI democratizes access to powerful AI tools for smart contract development by leveraging Web3 technology.
            </p>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Instead of paying recurring subscription fees, developers can own AI model NFTs - giving them permanent access, true ownership, and the potential for investment appreciation.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-2xl p-8">
            <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Web3-First Approach</h3>
            <p className="text-gray-400 text-sm">
              True ownership means you own your tools forever, not renting them from a corporation.
            </p>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose ContractAI?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lock,
                title: 'True Ownership',
                description: 'Own your AI models as NFTs. Your tools, your rules.'
              },
              {
                icon: Wallet,
                title: 'One-Time Payment',
                description: 'Pay once with ETH, use forever. No subscriptions.'
              },
              {
                icon: TrendingUp,
                title: 'Investment Potential',
                description: 'Model NFTs may appreciate as the platform grows.'
              },
              {
                icon: Zap,
                title: 'Always Available',
                description: 'Access your models 24/7 with unlimited usage.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gray-800/30 border border-purple-500/10 rounded-xl hover:border-purple-500/50 transition-all"
              >
                <item.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Models Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Current AI Models</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-800/50 border border-purple-500/20 rounded-2xl">
              <Code className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Contract Writer</h3>
              <p className="text-gray-400 mb-6">
                Generate production-ready smart contracts from natural language descriptions. Includes security patterns, gas optimization, and full ERC standard support.
              </p>
              <ul className="space-y-2 text-gray-300 text-sm mb-6">
                <li>✓ ERC20, ERC721, ERC1155 Support</li>
                <li>✓ Automated Gas Optimization</li>
                <li>✓ Security Best Practices</li>
                <li>✓ Complete Documentation</li>
                <li>✓ Test File Generation</li>
              </ul>
              <p className="text-purple-400 font-semibold">0.001 ETH on Sepolia</p>
            </div>

            <div className="p-8 bg-gray-800/50 border border-blue-500/20 rounded-2xl">
              <Shield className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Smart Contract Auditor</h3>
              <p className="text-gray-400 mb-6">
                Comprehensive security audits detect vulnerabilities, gas inefficiencies, and provide detailed reports with actionable recommendations.
              </p>
              <ul className="space-y-2 text-gray-300 text-sm mb-6">
                <li>✓ Vulnerability Detection</li>
                <li>✓ Gas Usage Analysis</li>
                <li>✓ Best Practice Checks</li>
                <li>✓ Detailed Reports</li>
                <li>✓ Code Quality Metrics</li>
              </ul>
              <p className="text-blue-400 font-semibold">0.001 ETH on Sepolia</p>
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Connect Your Wallet',
                description: 'Use your Ethereum wallet with Sepolia testnet ETH to get started.'
              },
              {
                step: 2,
                title: 'Purchase AI Model NFTs',
                description: 'Visit the marketplace and buy the AI model NFTs you want (0.001 ETH each).'
              },
              {
                step: 3,
                title: 'Start Using AI Tools',
                description: 'Access unlimited AI-powered smart contract assistance in the chat interface.'
              },
              {
                step: 4,
                title: 'Own Forever',
                description: 'Your NFTs stay in your wallet. Use them forever, trade them, or sell them.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Built With</h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gray-800/30 border border-purple-500/10 rounded-xl">
              <h4 className="font-bold mb-2">Frontend</h4>
              <p className="text-gray-400 text-sm">Next.js 15, React 19, Tailwind CSS</p>
            </div>
            <div className="p-6 bg-gray-800/30 border border-purple-500/10 rounded-xl">
              <h4 className="font-bold mb-2">AI & Streaming</h4>
              <p className="text-gray-400 text-sm">Google Gemini, AI SDK, Real-time Streaming</p>
            </div>
            <div className="p-6 bg-gray-800/30 border border-purple-500/10 rounded-xl">
              <h4 className="font-bold mb-2">Web3</h4>
              <p className="text-gray-400 text-sm">thirdweb, Sepolia Testnet, ERC1155 NFTs</p>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Own Your AI?</h2>
            <p className="text-gray-400 mb-8">
              Start building secure smart contracts with AI assistance today.
            </p>
            <Link href="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
              >
                Explore Marketplace
              </motion.button>
            </Link>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-purple-500/10">
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; 2026 ContractAI. Built with ❤️ for Web3 Developers.</p>
        </div>
      </footer>
    </main>
  );
}
