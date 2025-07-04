import { useMemo } from 'react';
import lotteryABI from '../contracts/abi/lotteryABI';
import shtABI from '../contracts/abi/shtABI';
import { LOTTERY_ADDRESS, SHT_ADDRESS } from '../constants/addresses';
import type { MultiCallClause } from './useMultiCall';

/**
 * Hook to create contract clauses for lottery status data
 */
export function useLotteryStatusClauses(): MultiCallClause[] {
  return useMemo(() => {
    try {
      const clauses: MultiCallClause[] = [
        // Get balance
        {
          contractAddress: LOTTERY_ADDRESS,
          contractInterface: lotteryABI,
          method: 'getBalance',
          args: [],
          comment: 'Get lottery balance'
        },
        // Get player count
        {
          contractAddress: LOTTERY_ADDRESS,
          contractInterface: lotteryABI,
          method: 'getPlayerCount',
          args: [],
          comment: 'Get total player count'
        },
        // Get unique player count
        {
          contractAddress: LOTTERY_ADDRESS,
          contractInterface: lotteryABI,
          method: 'getUniquePlayerCount',
          args: [],
          comment: 'Get unique player count'
        },
        // Get last winner
        {
          contractAddress: LOTTERY_ADDRESS,
          contractInterface: lotteryABI,
          method: 'getLastWinner',
          args: [],
          comment: 'Get last winner address'
        },
        // Get last winning amount
        {
          contractAddress: LOTTERY_ADDRESS,
          contractInterface: lotteryABI,
          method: 'getLastWinningAmount',
          args: [],
          comment: 'Get last winning amount'
        },
      ];

      return clauses;
    } catch (error) {
      console.error('Error building lottery status clauses:', error);
      return [];
    }
  }, []);
}

/**
 * Hook to create contract clause for win probability
 */
export function useWinProbabilityClauses(address?: string): MultiCallClause[] {
  return useMemo(() => {
    if (!address) return [];

    try {
      const clauses: MultiCallClause[] = [
        {
          contractAddress: LOTTERY_ADDRESS,
          contractInterface: lotteryABI,
          method: 'getWinProbability',
          args: [address],
          comment: `Get win probability for ${address}`
        },
        {
          contractAddress: LOTTERY_ADDRESS,
          contractInterface: lotteryABI,
          method: 'getPlayers',
          args: [],
          comment: `Get players for ${address}`,
        }
      ];

      return clauses;
    } catch (error) {
      console.error('Error building win probability clauses:', error);
      return [];
    }
  }, [address]);
}

/**
 * Hook to create contract clause for SHT balance
 */
export function useBalanceClauses(address?: string): MultiCallClause[] {
  return useMemo(() => {
    if (!address) return [];

    try {
      const clauses: MultiCallClause[] = [
        {
          contractAddress: SHT_ADDRESS,
          contractInterface: shtABI,
          method: 'balanceOf',
          args: [address],
          comment: `Get SHT balance for ${address}`
        },
      ];

      return clauses;
    } catch (error) {
      console.error('Error building balance clauses:', error);
      return [];
    }
  }, [address]);
} 
