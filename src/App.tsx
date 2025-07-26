import React from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HangManStatusCard } from './components/data-display/HangManStatusCard';
import { GuessHangmanForm } from './components/forms/HangManForm';


const App: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
    {/* Animated background elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <Header />
    
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 relative z-10 overflow-x-hidden">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full mb-6">
          <span className="text-purple-300 text-lg font-medium">🎯 Hanging SHT</span>
        </div>     
        {/* <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
          10k $SHT entry fee per game
        </h1>       
        <p className="text-lg sm:text-xl text-blue-100 mb-2 font-light">
          Wager up to 100k SHT - 10% burned forever
        </p> */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Win: Receive 2x entry amount</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Loss: Lose entry</span>
          </div>
        </div>
      </div>
            {/* Cards Section */}
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 xl:gap-8 w-full mb-0">
        <div className="w-full max-w-md xl:w-auto">
          <HangManStatusCard />
        </div>
        <div className="w-full max-w-md xl:w-auto">
          <GuessHangmanForm />
        </div>
      </div>

      
      {/* Decorative elements */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-4 text-blue-300/60">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent w-20"></div>
          <span className="text-xs font-medium">POWERED BY VECHAIN</span>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent w-20"></div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
);

export default App;
