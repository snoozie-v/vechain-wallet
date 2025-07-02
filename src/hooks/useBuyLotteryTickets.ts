import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSendTransaction } from '@vechain/vechain-kit';
import { buildBuyTicketsClauses, type BuyTicketsParams } from '../utils/transactions';
import { useCallback } from 'react';

export function useBuyLotteryTickets(address?: string) {
  const queryClient = useQueryClient();
  const { sendTransaction, ...rest } = useSendTransaction({
    signerAccountAddress: address || '',
  });

  const clauseBuilder = useCallback(async (params: BuyTicketsParams) => {
    return await buildBuyTicketsClauses(params);
  }, []);

  const mutation = useMutation({
    mutationFn: async (params: BuyTicketsParams) => {
      if (!address) throw new Error('No address provided');
      
      const clauses = await clauseBuilder(params);
      return await sendTransaction(clauses);
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['lottery'] });
      queryClient.invalidateQueries({ queryKey: ['sht', 'allowance'] });
      queryClient.invalidateQueries({ queryKey: ['win-probability'] });
    },
  });

  return {
    ...mutation,
    ...rest,
    buyTickets: mutation.mutateAsync,
  };
} 