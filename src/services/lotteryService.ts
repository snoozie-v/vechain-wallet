import { ThorClient } from "@vechain/sdk-network";
import { DECIMALS } from "../constants/amounts";
import lotteryABI from "../abis/lotteryABI";
import { LOTTERY_ADDRESS } from "../constants/addresses";

// Initialize ThorClient
const thor = ThorClient.fromUrl("https://testnet.vechain.org");

// Load the lottery contract
const lotteryContract = thor.contracts.load(LOTTERY_ADDRESS, lotteryABI);

// Interface for lottery status data
export interface LotteryStatusData {
  balance?: string;
  playerCount?: string;
  uniquePlayerCount?: string;
  lastWinner?: string;
  lastWinningAmount?: string;
}

// Get ThorClient (for debugging or other uses)
export const getThor = async () => {
  console.log(thor);
  return thor;
};

// Get lottery status
export const getLotteryStatus = async (): Promise<LotteryStatusData | null> => {
  try {
    const [playerCount, uniquePlayerCount, balance, lastWinner, lastWinningAmount] =
      await Promise.all([
        lotteryContract.read.getPlayerCount(),
        lotteryContract.read.getUniquePlayerCount(),
        lotteryContract.read.getBalance(),
        lotteryContract.read.getLastWinner(),
        lotteryContract.read.getLastWinningAmount(),
      ]);

    const formattedBalance = Math.floor(Number(balance) / 10 ** DECIMALS);
    const formattedWinningAmount = Math.floor(Number(lastWinningAmount) / 10 ** DECIMALS);
    return {
      playerCount: playerCount.toString(), // Total entries
      uniquePlayerCount: uniquePlayerCount.toString(), // Unique Players
      balance: formattedBalance.toString(),
      lastWinner: lastWinner,
      lastWinningAmount: formattedWinningAmount.toString(),
    };
  } catch (error) {
    console.error("Error in getLotteryStatus:", error);
    return null;
  }
};


