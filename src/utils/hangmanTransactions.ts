import { Interface } from 'ethers';
import hangManABI from '../contracts/abi/hangManABI';
import shtABI from '../contracts/abi/shtABI';
import { hangManAddress, tokenAddress } from '../constants/addresses';
import { ENTRY_AMOUNT } from '../constants/amounts';
import { formatSHTAmount } from '../utils/formatters';
import { EnhancedClause } from '@vechain/vechain-kit';

// Create contract interfaces
const hangManInterface = new Interface(hangManABI);
const shtInterface = new Interface(shtABI);

// Interface for guess letter parameters
export interface GuessLetterParams {
  letter: string;
}

// Define clause type
export interface TransactionClause {
  to: string;
  value: string;
  data: string;
  comment: string;
}

type MethodName<T> = T extends (nameOrSignature: infer U) => any ? U : never;

export type BuildClauseParams<T extends Interface> = {
    contractInterface: T;
    method: MethodName<T["getFunction"]>;
    args?: unknown[];
    value?: any;
} & Omit<EnhancedClause, "data" | "abi" | "value">;

export const buildClause = <T extends Interface>({ value = "0", contractInterface, args = [], method, ...others }: BuildClauseParams<T>): EnhancedClause => {
    return {
        value,
        data: contractInterface.encodeFunctionData(method, args),
        abi: JSON.parse(JSON.stringify(contractInterface.getFunction(method))),
        ...others,
    };
};

// Build approve clause using correct ABI encoding
export function buildApproveClause(amount: bigint): TransactionClause {
  const approveAmount = amount;
  
  return {
    to: tokenAddress,
    value: '0x0',
    data: shtInterface.encodeFunctionData('approve', [hangManAddress, approveAmount.toString()]),
    comment: `Approve ${amount ? formatSHTAmount(amount) : 'unlimited'} SHT for hangman contract`
  };
}

// Build start game clause using correct ABI encoding
export function buildStartGameClause(): TransactionClause {
  return {
    to: hangManAddress,
    value: '0x0',
    data: hangManInterface.encodeFunctionData('startGame', []),
    comment: `Start Hangman game with ${formatSHTAmount(ENTRY_AMOUNT)} SHT`
  };
}

// Build multi-clause transaction for starting game (approve + start)
export function buildStartHangmanGameClauses(): TransactionClause[] {
  const clauses: TransactionClause[] = [];
  
  // First clause: Approve the exact amount needed
  const approveClause = buildApproveClause(ENTRY_AMOUNT);
  clauses.push(approveClause);
  
  // Following clause: Start game
  const startClause = buildStartGameClause();
  clauses.push(startClause);
  
  return clauses;
}

// Build guess letter clause
export function buildGuessLetterClause(params: GuessLetterParams): TransactionClause[] {
  const hexLetter = `0x${params.letter.charCodeAt(0).toString(16).padStart(2, '0')}`;
  
  return [{
    to: hangManAddress,
    value: '0x0',
    data: hangManInterface.encodeFunctionData('guessLetter', [hexLetter]),
    comment: `Guess letter ${params.letter}`
  }];
}
