import React, { useState } from 'react';
import { useWallet } from '@vechain/vechain-kit';
import { useStartHangmanGame } from '../../hooks/useStartHangmanGame';
import { useGuessHangmanLetter } from '../../hooks/useGuessHangManLetter.ts';
import { useHangManStatus } from '../../hooks/useHangManStatus';
import { ENTRY_AMOUNT } from '../../constants/amounts'; // Adapt if needed for entry fee
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loader } from '../ui/Loader';
import { Skeleton } from '../ui/Skeleton';
import Confetti from 'react-confetti';
import { formatSHTAmount } from '../../utils/formatters';

export function GuessHangmanForm() {
  const { account } = useWallet();
  const address = account?.address;
  
  const [letter, setLetter] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { data: gameStatus, isLoading: isLoadingStatus, refetch: refetchStatus } = useHangManStatus();
  const { mutateAsync: startGame, isPending: isStarting, error: startError, isSuccess: startSuccess, data: startTxData } = useStartHangmanGame(address);
  const { mutateAsync: guessLetter, isPending: isGuessing, error: guessError, isSuccess: guessSuccess, data: guessTxData } = useGuessHangmanLetter(address);

  const isOngoing = gameStatus?.game.status === 'ongoing';

  React.useEffect(() => {
    if ((startSuccess && startTxData) || (guessSuccess && guessTxData)) {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 10000);
      refetchStatus();
      return () => clearTimeout(timeout);
    }
  }, [startSuccess, startTxData, guessSuccess, guessTxData, refetchStatus]);

  const handleStartGame = async () => {
    if (!address) return;
    
    try {
      await startGame();
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleGuessLetter = async () => {
    if (!address || !letter) return;
    
    try {
      await guessLetter({ letter });
      setLetter('');
    } catch (error) {
      console.error('Failed to guess letter:', error);
    }
  };

  const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value.length <= 1 && /^[a-z]?$/.test(value)) {
      setLetter(value);
    }
  };

  if (isLoadingStatus) {
    return <Skeleton height={200} />;
  }

  if (!address) {
    return (
      <Card className="w-full max-w-md min-w-0 sm:min-w-[350px] lg:min-w-[400px]">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 flex items-center justify-center">
            <span className="text-3xl">🔗</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Connect Your Wallet</h3>
          <p className="text-blue-200/70 mb-6">Connect your wallet to play Hangman</p>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full">
            <span className="text-purple-200 text-sm font-medium">Entry fee: {formatSHTAmount(ENTRY_AMOUNT)} SHT</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md min-w-0 sm:min-w-[350px] lg:min-w-[400px]">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white text-sm">🧩</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Play Hangman</h2>
        </div>



        {/* Actions */}
        {!isOngoing ? (
          <Button
            onClick={handleStartGame}
            disabled={isStarting}
            variant="success"
            className="w-full h-14 text-lg font-bold transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-4 border-white p-1 ring-2 ring-white/50 shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isStarting && <Loader className="mr-2 h-5 w-5" />}
            {isStarting ? 'Starting...' : 'Start Game'}
          </Button>
        ) : (
          <>
            <Input
              type="text"
              minLength={1}
              maxLength={1}
              value={letter}
              onChange={handleLetterChange}
              className="w-full h-12 text-center text-lg font-bold bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400/50 focus:ring-purple-400/25"
              placeholder="Enter letter (a-z)"
            />
            <Button
              onClick={handleGuessLetter}
              disabled={isGuessing || !letter}
              variant="success"
              className="w-full h-14 text-lg font-bold transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-4 border-white p-1 ring-2 ring-white/50 shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGuessing && <Loader className="mr-2 h-5 w-5" />}
              {isGuessing ? 'Guessing...' : 'Guess Letter'}
            </Button>
          </>
        )}

        {/* Error Messages */}
        {(startError || guessError) ? (
          <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-300">⚠️</span>
              <p className="text-red-200 text-sm">Failed to perform action. Please try again.</p>
            </div>
          </div>
        ) : null}

        {/* Success Message */}
        {(startSuccess && startTxData) || (guessSuccess && guessTxData) ? (
          <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-300">🎉</span>
              <p className="text-green-200 text-sm font-medium">
                Action successful!
              </p>
            </div>
            <a
              href={`https://vechainstats.com/transaction/${(startTxData || guessTxData)?.txid || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 text-xs underline hover:no-underline transition-colors"
            >
              View transaction →
            </a>
          </div>
        ) : null}

        {/* Info */}
        <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-blue-300">💡</span>
            <p className="text-blue-200 text-sm">
              This transaction will approve SHT and start the game in one go!
            </p>
          </div>
        </div>
      </div>

      {showConfetti ? <Confetti /> : null}
    </Card>
  );
}
