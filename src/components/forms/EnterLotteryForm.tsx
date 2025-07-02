import React, { useState, useMemo } from 'react';
import { useWallet } from '@vechain/vechain-kit';
import { useBuyLotteryTickets } from '../../hooks/useBuyLotteryTickets';
import { useWinProbability } from '../../hooks/useWinProbability';
import { ENTRY_AMOUNT } from '../../constants/amounts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loader } from '../ui/Loader';
import { Skeleton } from '../ui/Skeleton';
import Confetti from 'react-confetti';
import { formatSHTAmount, calculateTicketCost } from '../../utils/formatters';

export function EnterLotteryForm() {
  const { account } = useWallet();
  const address = account?.address;
  
  const [ticketCount, setTicketCount] = useState(1);
  const [showConfetti, setShowConfetti] = React.useState(false);
  
  const { mutateAsync: buyTickets, isPending: isBuying, error: buyError, isSuccess, data: txData } = useBuyLotteryTickets(address);
  const { data: winProbability, isLoading: isLoadingProbability, refetch: refetchWin } = useWinProbability(address);

  // Safely handle winProbability with proper fallback
  const safeWinProbability = useMemo(() => {
    return typeof winProbability === 'number' && !isNaN(winProbability) ? winProbability : 0;
  }, [winProbability]);

  const totalCost = useMemo(() => {
    return calculateTicketCost(ticketCount, ENTRY_AMOUNT);
  }, [ticketCount]);

  const formattedCost = useMemo(() => {
    return formatSHTAmount(totalCost);
  }, [totalCost]);

  React.useEffect(() => {
    if (isSuccess && txData) {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 10000);
      refetchWin();
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, txData, refetchWin]);

  const handleBuyTickets = async () => {
    if (!address || ticketCount < 1) return;
    
    try {
      await buyTickets({
        ticketCount,
        totalAmount: totalCost
      });
    } catch (error) {
      console.error('Failed to buy tickets:', error);
    }
  };

  const handleTicketCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setTicketCount(Math.max(1, Math.min(100, value))); // Limit between 1-100 tickets
  };

  const renderWinProbabilitySkeleton = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-2">
          <span className="text-blue-200/70 text-sm">Your Win Probability</span>
        </div>
        <div className="mb-4">
          <Skeleton width="80px" height={36} className="mx-auto" />
        </div>
        
        <div className="relative w-full bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm">
          <Skeleton variant="rectangular" height="100%" width="25%" />
        </div>
      </div>
    </div>
  );

  if (!address) {
    return (
      <Card className="w-full max-w-md min-w-0 sm:min-w-[350px] lg:min-w-[400px]">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 flex items-center justify-center">
            <span className="text-3xl">🔗</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Connect Your Wallet</h3>
          <p className="text-blue-200/70 mb-6">Connect your wallet to participate in the lottery</p>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full">
            <span className="text-purple-200 text-sm font-medium">Entry fee: {formatSHTAmount(ENTRY_AMOUNT)} SHT per ticket</span>
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
            <span className="text-white text-sm">🎲</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Buy Lottery Tickets</h2>
        </div>

        {/* Win Probability Section */}
        {isLoadingProbability ? renderWinProbabilitySkeleton() : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-2">
                <span className="text-blue-200/70 text-sm">Your Win Probability</span>
              </div>
              <div className="text-3xl font-bold text-white mb-4">
                {safeWinProbability.toFixed(2)}%
              </div>
              
              <div className="relative w-full bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                <div
                  className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 h-4 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${Math.min(safeWinProbability, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Ticket Count Input */}
          <div className="space-y-3">
            <label className="block text-blue-200/70 text-sm font-medium">
              Number of Tickets
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              value={ticketCount}
              onChange={handleTicketCountChange}
              className="w-full h-12 text-center text-lg font-bold bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400/50 focus:ring-purple-400/25"
              placeholder="1"
            />
            <p className="text-blue-200/60 text-xs text-center">
              Choose 1-100 tickets ({formatSHTAmount(ENTRY_AMOUNT)} SHT each)
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-sm">Tickets:</span>
                <span className="text-white font-medium">{ticketCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-sm">Price per ticket:</span>
                <span className="text-white font-medium">{formatSHTAmount(ENTRY_AMOUNT)} SHT</span>
              </div>
              <div className="border-t border-white/10 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Cost:</span>
                  <span className="text-green-300 font-bold text-lg">{formattedCost} SHT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buy Button */}
          <Button
            onClick={handleBuyTickets}
            disabled={isBuying || ticketCount < 1}
            variant="success"
            className="w-full h-14 text-lg font-bold transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-0 shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isBuying && <Loader className="mr-2 h-5 w-5" />}
            {isBuying ? 'Processing...' : `🎯 Buy ${ticketCount} Ticket${ticketCount > 1 ? 's' : ''}`}
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="text-blue-200/70 text-xs font-medium">
                Single transaction - Approval + {ticketCount} Entr{ticketCount > 1 ? 'ies' : 'y'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {buyError ? (
          <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-300">⚠️</span>
              <p className="text-red-200 text-sm">Failed to buy tickets. Please try again.</p>
            </div>
          </div>
        ) : null}

        {/* Success Message */}
        {isSuccess && txData ? (
          <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-300">🎉</span>
              <p className="text-green-200 text-sm font-medium">
                {ticketCount} ticket{ticketCount > 1 ? 's' : ''} purchased! Good luck!
              </p>
            </div>
            <a
              href={`https://vechainstats.com/transaction/${(txData as any)?.txid || ''}`}
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
              This transaction will approve SHT and purchase all tickets in one go!
            </p>
          </div>
        </div>
      </div>

      {showConfetti ? <Confetti /> : null}
    </Card>
  );
} 