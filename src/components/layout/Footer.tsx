import React from 'react';

export function Footer() {
  return (
    <footer className="relative z-20 mt-auto">
      {/* Glassmorphism background - removed border-t */}
      <div className="backdrop-blur-xl bg-white/5">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            {/* Logo and branding */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-white font-semibold">Hanging SHT</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a 
                href="https://vechainstats.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200/70 hover:text-blue-200 transition-colors duration-200"
              >
                VeChain Stats
              </a>
              <a 
                href="https://vechain.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200/70 hover:text-blue-200 transition-colors duration-200"
              >
                VeChain.org
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200/70 hover:text-blue-200 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>

            {/* Copyright and disclaimer */}
            <div className="text-center space-y-1">
              <p className="text-blue-200/60 text-xs">
                © 2025 Hanging SHT. Built on VeChain.
              </p>
              <p className="text-blue-200/50 text-xs max-w-md">
                Please play responsibly. This is an experimental dApp.
              </p>
            </div>

            {/* Decorative element */}
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none"></div>
    </footer>
  );
} 
