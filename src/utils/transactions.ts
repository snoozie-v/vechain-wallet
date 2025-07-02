import { ethers, Interface } from 'ethers';
import lotteryABI from '../contracts/abi/lotteryABI';
import shtABI from '../contracts/abi/shtABI';
import { LOTTERY_ADDRESS, SHT_ADDRESS } from '../constants/addresses';
import { ENTRY_AMOUNT } from '../constants/amounts';
import { formatSHTAmount } from './formatters';
import { EnhancedClause } from '@vechain/vechain-kit';

// Create contract interfaces
const lotteryInterface = new ethers.Interface(lotteryABI);
const shtInterface = new ethers.Interface(shtABI);

// Interface for buy tickets parameters
export interface BuyTicketsParams {
  ticketCount: number;
  totalAmount: bigint;
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
export async function buildApproveClause(amount: bigint): Promise<TransactionClause> {
  const approveAmount = amount;
  
  return {
    to: SHT_ADDRESS,
    value: '0x0',
    data: shtInterface.encodeFunctionData('approve', [LOTTERY_ADDRESS, approveAmount.toString()]),
    comment: `Approve ${amount ? formatSHTAmount(amount) : 'unlimited'} SHT for lottery contract`
  };
}

// Build enter clause using correct ABI encoding
export async function buildEnterClause(): Promise<TransactionClause> {
  return {
    to: LOTTERY_ADDRESS,
    value: '0x0',
    data: lotteryInterface.encodeFunctionData('enter', []),
    comment: `Enter lottery with ${formatSHTAmount(ENTRY_AMOUNT)} SHT`
  };
}

// Build multiple enter clauses for buying multiple tickets
export async function buildEnterClauses(ticketCount: number): Promise<TransactionClause[]> {
  const clauses: TransactionClause[] = [];
  
  for (let i = 0; i < ticketCount; i++) {
    clauses.push({
      to: LOTTERY_ADDRESS,
      value: '0x0',
      data: lotteryInterface.encodeFunctionData('enter', []),
      comment: `Enter lottery ticket ${i + 1} of ${ticketCount} (${formatSHTAmount(ENTRY_AMOUNT)} SHT each)`
    });
  }
  
  return clauses;
}

// Build multi-clause transaction for buying tickets (approve + multiple enters)
export async function buildBuyTicketsClauses(params: BuyTicketsParams): Promise<TransactionClause[]> {
  const clauses: TransactionClause[] = [];
  
  // First clause: Approve the exact amount needed
  const approveClause = await buildApproveClause(params.totalAmount);
  clauses.push(approveClause);
  
  // Following clauses: Enter lottery for each ticket
  const enterClauses = await buildEnterClauses(params.ticketCount);
  clauses.push(...enterClauses);
  
  return clauses;
} 