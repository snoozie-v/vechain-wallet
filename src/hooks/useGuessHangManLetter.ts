import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSendTransaction } from '@vechain/vechain-kit';
import { buildGuessLetterClause } from '../utils/hangmanTransactions';
import { useCallback } from 'react';

interface GuessLetterParams {
  letter: string;
}

export function useGuessHangmanLetter(address?: string) {
  const queryClient = useQueryClient();
  const { sendTransaction, ...rest } = useSendTransaction({
    signerAccountAddress: address || '',
  });

  const clauseBuilder = useCallback(async (params: GuessLetterParams) => {
    return await buildGuessLetterClause(params);
  }, []);

  const mutation = useMutation({
    mutationFn: async (params: GuessLetterParams) => {
      if (!address) throw new Error('No address provided');
      
      const clauses = await clauseBuilder(params);
      return await sendTransaction(clauses);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hangman'] });
    },
  });

  return {
    ...mutation,
    ...rest,
    guessLetter: mutation.mutateAsync,
  };
}
