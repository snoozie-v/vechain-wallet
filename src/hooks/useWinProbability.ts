import { useMemo } from 'react';
import { useCurrentBlock } from '@vechain/vechain-kit';
import { useMultiCall } from './useMultiCall';
import { useWinProbabilityClauses } from './useContractClauses';

export function useWinProbability(address?: string) {
  const { data: currentBlock } = useCurrentBlock();
  const clauses = useWinProbabilityClauses(address);
  
  const mapResponse = useMemo(() => {
    return (responses: any[]): number => {
      try {
        const probabilityResponse = responses[0];
        const probabilityBigInt = probabilityResponse?.[0] || 0n;
        
        // Convert from contract response (likely in basis points or percentage format)
        // Assuming the contract returns percentage as uint256 (e.g., 1500 = 15.00%)
        const probability = Number(probabilityBigInt.toString()) / 100;
        
        return Math.min(probability, 100); // Cap at 100%
      } catch (error) {
        console.error('Error transforming win probability response:', error);
        return 0;
      }
    };
  }, []);

  return useMultiCall<number>({
    queryKey: ['win-probability', address || '', currentBlock?.number || 0],
    clauses,
    mapResponse,
    enabled: !!address,
    staleTime: 0, // Always fresh data with new blocks
  });
} 