import { useMemo } from 'react';
import { humanAddress } from '@vechain/vechain-kit/utils';
import { useCurrentBlock } from '@vechain/vechain-kit';
import { useMultiCall } from './useMultiCall';
import { useLotteryStatusClauses } from './useContractClauses';
import { formatSHTAmount } from '../utils/formatters';

export interface LotteryStatusData {
  balance: string;
  balanceFormatted: string;
  playerCount: string;
  uniquePlayerCount: string;
  lastWinner: string;
  lastWinnerFormatted: string;
  lastWinningAmount: string;
  lastWinningAmountFormatted: string;
}

export function useLotteryStatus() {
  const { data: currentBlock } = useCurrentBlock();
  const clauses = useLotteryStatusClauses();
  
  const mapResponse = useMemo(() => {
    return (responses: any[]): LotteryStatusData => {
      try {
        // Extract values from responses
        const [
          balanceResponse,
          playerCountResponse, 
          uniquePlayerCountResponse,
          lastWinnerResponse,
          lastWinningAmountResponse
        ] = responses;

        const balance = balanceResponse?.[0]?.toString() || '0';
        const playerCount = playerCountResponse?.[0]?.toString() || '0';
        const uniquePlayerCount = uniquePlayerCountResponse?.[0]?.toString() || '0';
        const lastWinner = lastWinnerResponse?.[0]?.toString() || '0x0000000000000000000000000000000000000000';
        const lastWinningAmount = lastWinningAmountResponse?.[0]?.toString() || '0';

        return {
          balance,
          balanceFormatted: `${formatSHTAmount(balance)} SHT`,
          playerCount,
          uniquePlayerCount,
          lastWinner,
          lastWinnerFormatted: humanAddress(lastWinner),
          lastWinningAmount,
          lastWinningAmountFormatted: `${formatSHTAmount(lastWinningAmount)} SHT`,
        };
      } catch (error) {
        console.error('Error transforming lottery status response:', error);
        // Return fallback values
        const fallbackAmount = '0';
        const fallbackAddress = '0x0000000000000000000000000000000000000000';
        
        return {
          balance: fallbackAmount,
          balanceFormatted: `${formatSHTAmount(fallbackAmount)} SHT`,
          playerCount: '0',
          uniquePlayerCount: '0',
          lastWinner: fallbackAddress,
          lastWinnerFormatted: humanAddress(fallbackAddress),
          lastWinningAmount: fallbackAmount,
          lastWinningAmountFormatted: `${formatSHTAmount(fallbackAmount)} SHT`,
        };
      }
    };
  }, []);

  return useMultiCall<LotteryStatusData>({
    queryKey: ['lottery', 'status', currentBlock?.number || 0],
    clauses,
    mapResponse,
    staleTime: 0, // Always fresh data with new blocks
  });
} 