import { useMemo } from 'react';
import shtABI from '../contracts/abi/shtABI';
import hangManABI from '../contracts/abi/hangManABI';
import { SHT_ADDRESS, hangManAddress, tokenAddress, zeroAddress } from '../constants/addresses';
import type { MultiCallClause } from './useMultiCall';
import { useWallet } from '@vechain/vechain-kit';

// Hook to create contract clauses for hangman status data
export function useHangManStatusClauses(): MultiCallClause[] {
  const { account } = useWallet();
  const playerAddress = account?.address || zeroAddress;
  return useMemo(() => {
    try {
      const clauses: MultiCallClause[] = [
        // Get entry fee
        {
          contractAddress: hangManAddress,
          contractInterface: hangManABI,
          method: 'entryFee',
          args: [],
          comment: 'Get entry fee'
        },
        // Get token balance
        {
          contractAddress: tokenAddress,
          contractInterface: shtABI,
          method: 'balanceOf',
          args: [hangManAddress],
          comment: 'Get token balance'
        },
        // Get games
        {
          contractAddress: hangManAddress,
          contractInterface: hangManABI,
          method: 'games',
          args: [playerAddress],
          comment: 'Get games'
        },
        // Get displayed word
        {
          contractAddress: hangManAddress,
          contractInterface: hangManABI,
          method: 'getDisplayedWord',
          args: [],
          comment: 'Get displayed word'
        },
        // Get wrong Guesses
        {
          contractAddress: hangManAddress,
          contractInterface: hangManABI,
          method: 'getWrongGuesses',
          args: [],
          comment: 'Get wrong guesses'
        },
        { contractAddress: hangManAddress,
          contractInterface: hangManABI,
          method: 'getGuessedLetters',
          args: [],
          comment: 'Get guessed letters'
        },
      ];
      return clauses;
    } catch (error) {
      console.error('Error building hangman status clauses:', error);
      return [];
    }
  }, []);
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
