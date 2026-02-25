'use client';

import { motion } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from 'thirdweb/react';
import { getClient } from '@/app/client';
import { useState, useMemo } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Initialize client only once and only in browser (not during SSR)
  const client = useMemo(() => {
    try {
      return getClient();
    } catch (e) {
      console.warn('Client unavailable during render');
      return null;
    }
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Chat', href: '/chat' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <nav className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-google-blue to-goog-blue-600 flex items-center justify-center shadow-lg"
            >
              <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.div>
            <div className="hidden sm:flex flex-col gap-0">
              <h1 className="text-lg md:text-xl font-black text-gray-900">
                ContractAI
              </h1>
              <p className="text-xs text-gray-600 font-medium">Web3 Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-google-blue to-goog-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Wallet & Mobile Menu */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden lg:block">
              {client && <ConnectButton client={client} />}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden overflow-hidden"
        >
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              {client && <ConnectButton client={client} />}
            </div>
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
