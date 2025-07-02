import React from 'react';
import { useLotteryStatus } from '../../hooks/useLotteryStatus';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { Skeleton, SkeletonText } from '../ui/Skeleton';
import { formatSHTAmount } from '../../utils/formatters';

export function LotteryStatusCard() {
  const { data: status, isLoading, error, refetch } = useLotteryStatus();

  // Calculate 10% burn amount
  const burnAmount = React.useMemo(() => {
    if (!status?.balance) return 'N/A';
    try {
      const balance = BigInt(status.balance);
      const burnValue = (balance * 10n) / 100n; // 10% burn
      return formatSHTAmount(burnValue);
    } catch (error) {
      console.error('Error calculating burn amount:', error);
      return 'N/A';
    }
  }, [status?.balance]);

  const renderSkeleton = () => (
    <div className="space-y-4">
      {/* Prize Pool Skeleton */}
      <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl">
        <div className="flex justify-between items-center">
          <Skeleton width="100px" height={20} />
          <Skeleton width="120px" height={28} />
        </div>
      </div>
      
      {/* Burn Amount Skeleton */}
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

      {/* Winner Info Skeleton */}
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

  return (
    <Card className="w-full max-w-md min-w-[400px]">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Lottery Status</h2>
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
            <p className="text-red-200 text-sm">Failed to load lottery status</p>
          </div>
        )}

        {isLoading ? (
          renderSkeleton()
        ) : status ? (
          <div className="space-y-4">
            {/* Prize Pool - Featured */}
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-green-200 font-medium">💰 Prize Pool</span>
                <span className="font-mono font-bold text-xl text-green-100">{status.balanceFormatted}</span>
              </div>
            </div>
            
            {/* Burn Amount */}
            <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-orange-200 font-medium">🔥 To be Burnt</span>
                <span className="font-mono font-bold text-lg text-orange-100">{burnAmount} SHT</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-blue-200/70 text-xs font-medium mb-1">Total Entries</div>
                <div className="font-mono font-bold text-white text-lg">{status.playerCount}</div>
              </div>
              
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-blue-200/70 text-xs font-medium mb-1">Unique Players</div>
                <div className="font-mono font-bold text-white text-lg">{status.uniquePlayerCount}</div>
              </div>
            </div>

            {/* Winner Info */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-sm">🏆 Last Winner</span>
                <span className="font-mono text-blue-100 text-sm">{status.lastWinnerFormatted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-sm">💎 Last Prize</span>
                <span className="font-mono text-blue-100 text-sm font-medium">{status.lastWinningAmountFormatted}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/50">📊</span>
            </div>
            <p className="text-white/60 text-sm">No status available</p>
          </div>
        )}
      </div>
    </Card>
  );
} 