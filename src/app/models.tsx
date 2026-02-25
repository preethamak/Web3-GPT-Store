'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Sparkles, Code, Lock, MessageSquare, Wallet, RefreshCw } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AnimatedCard, GlowButton } from '@/components/3DElements';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { getClient, NFT_PRICE_ETH } from './client';
import { sepolia } from 'thirdweb/chains';
import { getContract, prepareContractCall, readContract, sendTransaction } from 'thirdweb';
import { CONTRACT_ADDRESS } from '@/lib/constants';

const MarketplacePage: React.FC = () => {
  const { models, purchaseModel, createConversation, setActiveConversation, setActiveModel } = useStore();
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(false);
  const [purchasingModel, setPurchasingModel] = useState<string | null>(null);
  const activeAccount = useActiveAccount();

  // Check NFT ownership on mount and when account changes
  useEffect(() => {
    const checkOwnership = async () => {
      if (!activeAccount) return;

      setIsCheckingOwnership(true);
      try {
        const contract = getContract({
          client: getClient(),
          chain: sepolia,
          address: CONTRACT_ADDRESS,
        });

        // Check ownership for each model
        for (const model of models) {
          // Skip if model doesn't have tokenId (shouldn't happen but safety check)
          if (model.tokenId === undefined || model.tokenId === null) {
            console.warn(`Model ${model.id} is missing tokenId`);
            continue;
          }

          const balance = await readContract({
            contract,
            method: "function balanceOf(address account, uint256 id) view returns (uint256)",
            params: [activeAccount.address, BigInt(model.tokenId)],
          });

          if (balance > 0n && !model.purchased) {
            purchaseModel(model.id);
          }
        }
      } catch (error) {
        console.error('Error checking ownership:', error);
      } finally {
        setIsCheckingOwnership(false);
      }
    };

    checkOwnership();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);

  const checkNFTOwnership = async () => {
    if (!activeAccount) return;

    setIsCheckingOwnership(true);
    try {
      const contract = getContract({
        client: getClient(),
        chain: sepolia,
        address: CONTRACT_ADDRESS,
      });

      // Check ownership for each model
      for (const model of models) {
        // Skip if model doesn't have tokenId
        if (model.tokenId === undefined || model.tokenId === null) {
          console.warn(`Model ${model.id} is missing tokenId`);
          continue;
        }

        const balance = await readContract({
          contract,
          method: "function balanceOf(address account, uint256 id) view returns (uint256)",
          params: [activeAccount.address, BigInt(model.tokenId)],
        });

        if (balance > 0n && !model.purchased) {
          purchaseModel(model.id);
        }
      }
    } catch (error) {
      console.error('Error checking ownership:', error);
    } finally {
      setIsCheckingOwnership(false);
    }
  };

  const handleTryModel = (modelId: string) => {
    if (!activeAccount) {
      setPurchaseError('Please connect your wallet first');
      return;
    }
    
    setActiveModel(modelId);
    const convId = createConversation(modelId);
    setActiveConversation(convId);
    router.push('/chat');
  };

  const handlePurchaseClick = async (modelId: string, tokenId: number) => {
    if (!activeAccount) {
      setPurchaseError('Please connect your wallet first');
      return;
    }

    setPurchasingModel(modelId);
    setPurchaseError(null);
    setPurchaseSuccess(null);

    try {
      const contract = getContract({
        client: getClient(),
        chain: sepolia,
        address: CONTRACT_ADDRESS,
      });

      const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
      const priceInWei = "1000000000000000"; // 0.001 ETH

      const transaction = prepareContractCall({
        contract,
        method: "function claim(address _receiver, uint256 _tokenId, uint256 _quantity, address _currency, uint256 _pricePerToken, (bytes32[] proof, uint256 quantityLimitPerWallet, uint256 pricePerToken, address currency) _allowlistProof, bytes _data) payable",
        params: [
          activeAccount.address,
          BigInt(tokenId),
          BigInt(1),
          NATIVE_TOKEN,
          BigInt(priceInWei),
          {
            proof: [],
            quantityLimitPerWallet: BigInt(0),
            pricePerToken: BigInt(priceInWei),
            currency: NATIVE_TOKEN,
          },
          "0x",
        ],
        value: BigInt(priceInWei),
      });

      setPurchaseSuccess('Please confirm the transaction in your wallet...');

      // Import sendTransaction dynamically
      const { sendTransaction } = await import('thirdweb');
      
      const receipt = await sendTransaction({
        transaction,
        account: activeAccount,
      });

      setPurchaseSuccess('🎉 NFT purchased successfully! Redirecting to chat...');

      // Mark as purchased
      purchaseModel(modelId);
      setActiveModel(modelId);

      // Create conversation
      const convId = createConversation(modelId);
      setActiveConversation(convId);

      // Redirect after delay
      setTimeout(() => {
        router.push('/chat');
      }, 1500);

    } catch (error: any) {
      console.error('=== PURCHASE ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);

      let errorMessage = 'Transaction failed. ';
      if (error?.message) {
        if (error.message.includes('User rejected') || error.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected.';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds. You need at least 0.001 ETH + gas fees.';
        } else {
          errorMessage += error.message;
        }
      }
      setPurchaseError(errorMessage);
    } finally {
      setPurchasingModel(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Connect Wallet Button */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <ConnectButton
              client={getClient()}
              chain={sepolia}
            />
            {activeAccount && (
              <button
                onClick={checkNFTOwnership}
                disabled={isCheckingOwnership}
                className="px-4 py-2 rounded-lg border border-violet-500/30 hover:border-violet-500 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isCheckingOwnership ? 'animate-spin' : ''}`} />
                {isCheckingOwnership ? 'Checking...' : 'Refresh Ownership'}
              </button>
            )}
          </div>

          <div className="inline-block mb-4">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass border border-violet-500/30">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-400 font-medium">AI Models NFT</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your <span className="gradient-text">AI Model</span>
          </h1>
          
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Professional AI models for smart contract development and auditing.
            Purchase NFTs at 0.001 ETH each to unlock AI models forever.
          </p>

          {purchaseSuccess && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 max-w-md mx-auto">
              {purchaseSuccess}
            </div>
          )}

          {purchaseError && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 max-w-md mx-auto">
              {purchaseError}
            </div>
          )}
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
                    0.001 ETH
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
                      disabled={!activeAccount}
                    >
                      <MessageSquare className="w-5 h-5 mr-2 inline" />
                      Start Chat
                    </GlowButton>
                  ) : (
                    <>
                      {!activeAccount ? (
                        <div className="w-full">
                          <ConnectButton
                            client={getClient()}
                            chain={sepolia}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            console.log('=== BUY BUTTON CLICKED ===', model.id, model.tokenId);
                            handlePurchaseClick(model.id, model.tokenId);
                          }}
                          disabled={purchasingModel === model.id}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.75rem',
                            backgroundColor: purchasingModel === model.id ? 'rgb(100, 100, 100)' : 'rgb(124, 58, 237)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1rem',
                            border: 'none',
                            cursor: purchasingModel === model.id ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: purchasingModel === model.id ? 0.7 : 1,
                          }}
                        >
                          <Zap className="w-5 h-5 mr-2 inline" />
                          {purchasingModel === model.id ? 'Processing...' : `Purchase for ${NFT_PRICE_ETH} ETH`}
                        </button>
                      )}
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