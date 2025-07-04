import { useMemo } from 'react';
import { useCurrentBlock } from '@vechain/vechain-kit';
import { useMultiCall } from './useMultiCall';
import { useWinProbabilityClauses } from './useContractClauses';

export interface WinProbabilityData {
  winProbability: number;
  userEntries: string;
}

export function useWinProbability(address?: string) {
  const { data: currentBlock } = useCurrentBlock();
  const clauses = useWinProbabilityClauses(address);
  
  const mapResponse = useMemo(() => {
    return (responses: any[]): WinProbabilityData => {
      try {
        const [probabilityResponse, playersResponse] = responses;

        const probabilityBigInt = probabilityResponse?.[0] || 0n;
        const probability = Number(probabilityBigInt.toString()) / 100;

        // Calculate user entries from players array
        const players = playersResponse?.[0] || [];
        const userEntries = address
          ? players.filter((player: string) => player.toLowerCase() === address.toLowerCase()).length.toString()
          : '0';

        return {
          winProbability: Math.min(probability, 100), // Cap at 100%
          userEntries,
        };
      } catch (error) {
        console.error('Error transforming win probability response:', error);
        return {
          winProbability: 0,
          userEntries: '0',
        };
      }
    };
  }, [address]);

  return useMultiCall<WinProbabilityData>({
    queryKey: ['win-probability', address || '', currentBlock?.number || 0],
    clauses,
    mapResponse,
    enabled: !!address,
    staleTime: 0, // Always fresh data with new blocks
  });
}
