import React from 'react';
import { WalletButton as VeChainWalletButton, useWallet } from '@vechain/vechain-kit';
import { Button } from '../ui/Button';

export function Header() {
  const { account, disconnect } = useWallet();

  return (
    <header className="w-full relative z-20">
      {/* Glassmorphism background */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                SHT Lotto
              </h1>
              <p className="text-blue-200/70 text-xs font-medium">VeChain Lottery</p>
            </div>
          </div>
          
          {/* Wallet Connection */}
          <div className="flex flex-col items-center gap-3">
            <div className="transform transition-transform hover:scale-105">
              <VeChainWalletButton connectionVariant='popover' buttonStyle={{
                backgroundColor: 'transparent',
                border: '1px solid #fff',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '10px',
              }}/>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
    </header>
  );
} 