import { useMemo } from 'react';
import { useCurrentBlock } from '@vechain/vechain-kit';
import { useMultiCall } from './useMultiCall';
import { useBalanceClauses } from './useContractClauses';
import { formatSHTAmount } from '../utils/formatters';

export function useSHTBalance(address?: string) {
  const { data: currentBlock } = useCurrentBlock();
  const clauses = useBalanceClauses(address);
  
  const mapResponse = useMemo(() => {
    return (responses: any[]): bigint => {
      try {
        const balanceResponse = responses[0];
        const balance = balanceResponse?.[0] || 0n;
        return BigInt(balance.toString());
      } catch (error) {
        console.error('Error transforming balance response:', error);
        return 0n;
      }
    };
  }, []);

  const query = useMultiCall<bigint>({
    queryKey: ['sht', 'balance', address || '', currentBlock?.number || 0],
    clauses,
    mapResponse,
    enabled: !!address,
    staleTime: 0, // Always fresh data with new blocks
  });

  // Add formatted balance to the return value
  const formattedBalance = useMemo(() => {
    if (query.data) {
      return formatSHTAmount(query.data);
    }
    return '0';
  }, [query.data]);

  return {
    ...query,
    formattedBalance,
  };
} 