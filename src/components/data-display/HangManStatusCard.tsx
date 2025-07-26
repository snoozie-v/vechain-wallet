import React from 'react';
import { useHangManStatus } from '../../hooks/useHangManStatus';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { Skeleton } from '../ui/Skeleton';

export function HangManStatusCard() {
  const { data, isLoading, error, refetch } = useHangManStatus();
  const renderSkeleton = () => (
    <div className="space-y-4">
      {/* Entry Fee Skeleton */}
      <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl">
        <div className="flex justify-between items-center">
          <Skeleton width="100px" height={20} />
          <Skeleton width="120px" height={28} />
        </div>
      </div>
      
      {/* SHT Balance Skeleton */}
      <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl">
        <div className="flex justify-between items-center">
          <Skeleton width="90px" height={20} />
          <Skeleton width="100px" height={24} />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
          <Skeleton width="80px" height={12} className="mb-2" />
          <Skeleton width="40px" height={24} />
        </div>
        
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
          <Skeleton width="90px" height={12} className="mb-2" />
          <Skeleton width="35px" height={24} />
        </div>
      </div>

      {/* Game Info Skeleton */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex justify-between items-center">
          <Skeleton width="80px" height={16} />
          <Skeleton width="100px" height={16} />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton width="70px" height={16} />
          <Skeleton width="80px" height={16} />
        </div>
      </div>
    </div>
  );

  const getGameStatusDisplay = (gameStatus: string) => {
    if (gameStatus === 'none') return "No game started";
    if (gameStatus === 'ongoing') return "Ongoing";
    return gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1);
  };

  return (
    <Card className="w-full max-w-md min-w-0 sm:min-w-[350px] lg:min-w-[400px]">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm">🧩</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Hangman Status</h2>
            <p className='text-xs text-white'> Refreshes with each block</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {isLoading && <Loader className="h-3 w-3" />}
            ↻
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
            <p className="text-red-200 text-sm">Failed to load hangman status</p>
          </div>
        )}

        {isLoading ? (
          renderSkeleton()
        ) : data ? (
          <div className="space-y-4">
            {/* Entry Fee - Featured */}
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-green-200 font-medium">💰 Entry Fee</span>
                <span className="font-mono font-bold text-xl text-green-100">{data.status.entryFee} tokens</span>
              </div>
            </div>
            
            {/* SHT Balance */}
            <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-orange-200 font-medium">🔥 SHT Balance</span>
                <span className="font-mono font-bold text-lg text-orange-100">{data.status.tokenBalance} tokens</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-blue-200/70 text-xs font-medium mb-1">Game Status</div>
                <div className="font-mono font-bold text-white text-lg">{getGameStatusDisplay(data.game.status)}</div>
              </div>
              
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-blue-200/70 text-xs font-medium mb-1">Wrong Guesses</div>
                <div className="font-mono font-bold text-white text-lg">{data.game.wrongGuesses}/6</div>
                            <div className="mt-4">
                  <span className="text-blue-200/70 text-sm">Guessed Letters:</span>
                  <span className="text-white font-medium ml-2">
                    {data.game.guessedLetters
                      .map((guessed, index) => guessed ? String.fromCharCode(97 + index) : null)
                      .filter(Boolean)
                      .sort()
                      .join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-sm">📝 Current Word</span>
                <span className="font-mono text-blue-100 text-sm">{data.game.displayedWord ? data.game.displayedWord.split('').join(' ') : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-sm">🎯 Active</span>
                <span className="font-mono text-blue-100 text-sm font-medium">{data.game.active ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/50">🧩</span>
            </div>
            <p className="text-white/60 text-sm">No status available</p>
          </div>
        )}
      </div>
    </Card>
  );
}
