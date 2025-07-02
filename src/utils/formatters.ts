import { ethers } from 'ethers';

/**
 * Utility function to format SHT amounts (18 decimals)
 */
export function formatSHTAmount(amount: string | bigint): string {
  try {
    const bigIntAmount = typeof amount === 'string' ? BigInt(amount) : amount;
    const formatted = ethers.formatUnits(bigIntAmount.toString(), 18);
    const number = parseFloat(formatted);
    
    // Format with appropriate decimals and locale
    if (number >= 1000000) {
      return (number / 1000000).toLocaleString('en-US', { 
        maximumFractionDigits: 2,
        minimumFractionDigits: 0 
      }) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toLocaleString('en-US', { 
        maximumFractionDigits: 2,
        minimumFractionDigits: 0 
      }) + 'K';
    } else {
      return number.toLocaleString('en-US', { 
        maximumFractionDigits: 2,
        minimumFractionDigits: 0 
      });
    }
  } catch (error) {
    console.error('Error formatting SHT amount:', error);
    return '0';
  }
}

/**
 * Function to calculate ticket cost
 */
export function calculateTicketCost(ticketCount: number, entryAmount: bigint): bigint {
  return entryAmount * BigInt(ticketCount);
} 