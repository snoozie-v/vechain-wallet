import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSendTransaction } from '@vechain/vechain-kit';
import { buildStartHangmanGameClauses } from '../utils/hangmanTransactions';
import { useCallback } from 'react';

export function useStartHangmanGame(address?: string) {
  const queryClient = useQueryClient();
  const { sendTransaction, ...rest } = useSendTransaction({
    signerAccountAddress: address || '',
  });

  const clauseBuilder = useCallback(async () => {
    return await buildStartHangmanGameClauses();
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error('No address provided');
      
      const clauses = await clauseBuilder();
      return await sendTransaction(clauses);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hangman'] });
      queryClient.invalidateQueries({ queryKey: ['sht', 'allowance'] });
    },
  });

  return {
    ...mutation,
    ...rest,
    startGame: mutation.mutateAsync,
  };
}
