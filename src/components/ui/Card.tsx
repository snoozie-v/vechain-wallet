import React from 'react';

export function Card({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`
      relative backdrop-blur-xl bg-white/10 
      border border-white/20 rounded-2xl shadow-2xl 
      p-8 transition-all duration-300 hover:shadow-purple-500/10 hover:shadow-3xl
      hover:bg-white/[0.15] hover:border-white/30
      ${className}
    `}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 