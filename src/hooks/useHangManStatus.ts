import { useMemo } from 'react';
import { useCurrentBlock } from '@vechain/vechain-kit';
import { useMultiCall } from './useMultiCall';
import { formatSHTAmount } from '../utils/formatters';
import { zeroAddress } from '../constants/addresses';
import { useWallet } from '@vechain/vechain-kit';
import { useHangManStatusClauses } from './useContractClauses';

export interface HangManStatus {
  status: {
    entryFee: string;
    tokenBalance: string;
  };
  game: {
    active: boolean;
    displayedWord: string | null;
    wrongGuesses: string;
    status: string;
    guessedLetters: boolean[]; // New: bool[26]
  };
}

export function useHangManStatus() {
  const { account } = useWallet(); // Removed unused disconnect
  const playerAddress = account?.address || zeroAddress;
  const { data: currentBlock } = useCurrentBlock();
  const clauses = useHangManStatusClauses();

  const mapResponse = useMemo(() => {
    return (responses: any[]): HangManStatus => {
      console.log('res',responses)
      try {
        const [
          entryFeeResponse,
          tokenBalanceResponse,
          gamesResponse,
          displayedWordResponse,
          wrongGuessesResponse
        ] = responses;

        const entryFee = entryFeeResponse?.[0]?.toString() || '0';
        const tokenBalance = tokenBalanceResponse?.[0]?.toString() || '0';
        const [word, wrongFromGames, active, player] = gamesResponse || ['', '0', false, zeroAddress];

        const guessedLettersResponse = responses[5]?.[0] || Array(26).fill(false); // Fallback to false array
        let displayedWord: string | null = null;
        let wrongGuesses = '0';
        let status = 'none';
        console.log(displayedWord)
        if (player.toLowerCase() !== zeroAddress.toLowerCase()) {
          displayedWord = word;
          wrongGuesses = wrongFromGames.toString();

          if (active) {
            status = 'ongoing';
            if (displayedWordResponse?.[0]) {
              displayedWord = displayedWordResponse[0];
              wrongGuesses = wrongGuessesResponse?.[0]?.toString() || '0';
            } else {
              // Fallback if view functions reverted (e.g., no active game or no guesses yet)
              displayedWord = word.replace(/./g, ' _ ');
              wrongGuesses = '0';
            }
          } else {
            status = Number(wrongFromGames) >= 6 ? 'lost' : 'won';
          }
        }

        return {
          status: {
            entryFee: formatSHTAmount(entryFee),
            tokenBalance: formatSHTAmount(tokenBalance),
          },
          game: {
            active,
            displayedWord,
            wrongGuesses,
            status,
            guessedLetters: guessedLettersResponse  
          },
        };
      } catch (error) {
        console.error('Error transforming hangman status response:', error);
        // Return fallback values
        return {
          status: {
            entryFee: '0',
            tokenBalance: '0',
          },
          game: {
            active: false,
            displayedWord: null,
            wrongGuesses: '0',
            status: 'none',
            guessedLetters: guessedLettersResponse
          },
        };
      }
    };
  }, []);

  return useMultiCall<HangManStatus>({
    queryKey: ['hangman', 'status', currentBlock?.number || 0, playerAddress],
    clauses,
    mapResponse,
    staleTime: 0, // Always fresh data with new blocks
    caller: playerAddress, // New: Simulate msg.sender as player
  });
}
