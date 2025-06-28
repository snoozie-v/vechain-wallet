import React, { useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { useWallet, useSendTransaction } from "@vechain/vechain-kit";
import { ThorClient } from "@vechain/sdk-network";
import { ABIContract } from "@vechain/sdk-core";
import lotteryABI from "../abis/lotteryABI";
import shtABI from "../abis/shtABI";
import { LOTTERY_ADDRESS, TOKEN_ADDRESS } from "../constants/addresses";
import { ENTRY_AMOUNT, APPROVAL_AMOUNT, DECIMALS } from "../constants/amounts";

// Initialize ThorClient
const thor = ThorClient.fromUrl("https://testnet.vechain.org");

// Load the lottery contract
const lotteryContract = thor.contracts.load(LOTTERY_ADDRESS, lotteryABI);

// Interface for lottery status data
interface LotteryStatusData {
  balance?: string;
  playerCount?: string;
  uniquePlayerCount?: string;
  lastWinner?: string;
  lastWinningAmount?: string;
}

// Get lottery status
const getLotteryStatus = async (): Promise<LotteryStatusData | null> => {
  try {
    const [playerCount, uniquePlayerCount, balance, lastWinner, lastWinningAmount] = await Promise.all([
      lotteryContract.read.getPlayerCount(),
      lotteryContract.read.getUniquePlayerCount(),
      lotteryContract.read.getBalance(),
      lotteryContract.read.getLastWinner(),
      lotteryContract.read.getLastWinningAmount(),
    ]);

    const formattedBalance = Math.floor(Number(balance) / 10 ** DECIMALS);
    const formattedWinningAmount = Math.floor(Number(lastWinningAmount) / 10 ** DECIMALS);
    return {
      playerCount: playerCount.toString(),
      uniquePlayerCount: uniquePlayerCount.toString(),
      balance: formattedBalance.toString(),
      lastWinner: lastWinner.toString(),
      lastWinningAmount: formattedWinningAmount.toString(),
    };
  } catch (error) {
    console.error("Error in getLotteryStatus:", error);
    return null;
  }
};

const EnterLotteryForm = () => {
  const { account } = useWallet();
  const [allowance, setAllowance] = React.useState(0n);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasSufficientAllowance, setHasSufficientAllowance] = React.useState(false);
  const [winPercentage, setWinPercentage] = React.useState(0);
  const [lotteryStatus, setLotteryStatus] = React.useState<LotteryStatusData | null>(null);
  const [statusError, setStatusError] = React.useState<string | null>(null);
  const { sendTransaction, status, txReceipt, error } = useSendTransaction({
    signerAccountAddress: account?.address ?? "",
  });

  // Format allowance for display
  const formatAllowance = (allowance: bigint) =>
    allowance === 0n ? "0" : `${(Number(allowance) / 10 ** DECIMALS).toFixed(4)}`;

  // Check allowance
  const checkAllowance = async () => {
    if (!account?.address) return;
    setIsLoading(true);
    try {
      const tokenContract = thor.contracts.load(TOKEN_ADDRESS, shtABI);
      const allowed = await tokenContract.read.allowance(account.address, LOTTERY_ADDRESS);
      const allowanceValue = BigInt(allowed.toString());
      setAllowance(allowanceValue);
      setHasSufficientAllowance(allowanceValue >= ENTRY_AMOUNT);
    } catch (err) {
      console.error("Allowance check failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get win probability
  const getWinProbability = async () => {
    if (!account?.address) return;
    setIsLoading(true);
    try {
      const winProbability = await lotteryContract.read.getWinProbability(account.address);
      setWinPercentage((Number(winProbability) / 100).toFixed(2));
    } catch (err) {
      console.error("Win probability fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get lottery status
  const handleLotteryStatus = useCallback(async () => {
    setIsLoading(true);
    setStatusError(null);
    try {
      const status = await getLotteryStatus();
      setLotteryStatus(status ?? null);
    } catch (err) {
      console.error("Failed to fetch lottery status:", err);
      setStatusError("Failed to load lottery status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (account?.address) {
      checkAllowance();
      getWinProbability();
      handleLotteryStatus();
    }
  }, [account?.address, handleLotteryStatus]);

  // Encode approve function data
  const encodedApproveData = React.useMemo(() => {
    if (!account?.address) return null;
    const contract = ABIContract.ofAbi(shtABI);
    return contract.encodeFunctionInput("approve", [LOTTERY_ADDRESS, APPROVAL_AMOUNT]).toString();
  }, [account?.address]);

  // Encode enter function data
  const encodedEnterData = React.useMemo(() => {
    if (!account?.address) return null;
    const contract = ABIContract.ofAbi(lotteryABI);
    return contract.encodeFunctionInput("enter", []).toString();
  }, [account?.address]);

  // Approve lottery
  const approveLottery = async () => {
    if (!account?.address || !encodedApproveData) return;
    setIsLoading(true);
    try {
      const gasEstimate = await thor.transactions.estimateGas(
        [{ to: TOKEN_ADDRESS, value: "0x0", data: encodedApproveData }],
        account.address
      );
      await sendTransaction([
        {
          to: TOKEN_ADDRESS,
          value: "0x0",
          data: encodedApproveData,
          gas: gasEstimate.totalGas,
        },
      ]);
      await checkAllowance();
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter lottery
  const enterLottery = async () => {
    if (!account?.address || !encodedEnterData || !hasSufficientAllowance) return;
    setIsLoading(true);
    try {
      const gasEstimate = await thor.transactions.estimateGas(
        [{ to: LOTTERY_ADDRESS, value: "0x0", data: encodedEnterData }],
        account.address
      );
      await sendTransaction([
        {
          to: LOTTERY_ADDRESS,
          value: "0x0",
          data: encodedEnterData,
          gas: gasEstimate.totalGas,
        },
      ]);
    } catch (err) {
      console.error("Enter failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful entry
  useEffect(() => {
    if (txReceipt && status === "success") {
      // Refresh all data points after successful entry
      checkAllowance();
      getWinProbability();
      handleLotteryStatus();
    }
  }, [txReceipt, status]);

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px", textAlign: "center" }}>Vechain Lottery</h1>

      {/* Lottery Status Section */}
      <div style={{ marginBottom: "24px", background: "rgba(248, 249, 250, 0.7)", padding: "16px", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "12px", textAlign: "center" }}>Lottery Status</h2>
        {lotteryStatus ? (
          <div style={{ textAlign: "center", fontSize: "14px" }}>
            <p>
              <strong>Prize Pool:</strong> {lotteryStatus.balance ?? "N/A"} SHT{" "}
              <span title="Current total prize pool." style={{ cursor: "help" }}>
                ℹ️
              </span>
            </p>
            <p>
              <strong>Total Entries:</strong> {lotteryStatus.playerCount ?? "N/A"}
            </p>
            <p>
              <strong>Unique Players:</strong> {lotteryStatus.uniquePlayerCount ?? "N/A"}
            </p>
            <p>
              <strong>Last Winner:</strong>{" "}
              {lotteryStatus.lastWinner && lotteryStatus.lastWinner !== "0x0000000000000000000000000000000000000000"
                ? `${lotteryStatus.lastWinner.slice(0, 6)}...${lotteryStatus.lastWinner.slice(-4)}`
                : "None"}{" "}
              <span title="Address of the most recent winner." style={{ cursor: "help" }}>
                ℹ️
              </span>
            </p>
            <p>
              <strong>Last Prize:</strong> {lotteryStatus.lastWinningAmount ?? "N/A"} SHT
            </p>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>No status available.</p>
        )}
        {statusError && <p style={{ color: "red", fontSize: "14px", marginTop: "8px", textAlign: "center" }}>{statusError}</p>}
        <div style={{ textAlign: "center" }}>
          <button
            aria-label="Refresh lottery status"
            style={{
              background: "#6c757d",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              marginTop: "12px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onClick={handleLotteryStatus}
            disabled={isLoading}
          >
            Refresh Status
          </button>
        </div>
      </div>

      {/* Entry Section */}
      {!account?.address ? (
        <div style={{ textAlign: "center" }}>
          <p>Please connect your wallet to participate.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "16px" }}>
            <p>
              <strong>Your Win Probability:</strong> {winPercentage}%{" "}
              <span title="Your chance of winning based on entries." style={{ cursor: "help" }}>
                ℹ️
              </span>
            </p>
            <div style={{ width: "100%", background: "#eee", borderRadius: "4px", height: "10px", marginBottom: "12px" }}>
              <div
                style={{ width: `${winPercentage}%`, background: "#28a745", height: "100%", borderRadius: "4px" }}
              />
            </div>
            <p>
              <strong>Allowance:</strong> {formatAllowance(allowance)} SHT{" "}
              <span title="Tokens the lottery can spend on your behalf." style={{ cursor: "help" }}>
                ℹ️
              </span>
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              aria-label="Check token allowance"
              style={{
                background: "#6c757d",
                color: "white",
                padding: "10px",
                borderRadius: "4px",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onClick={checkAllowance}
              disabled={isLoading}
            >
              Check Allowance
            </button>
            <button
              aria-label="Approve lottery contract"
              style={{
                background: hasSufficientAllowance ? "#ccc" : "#007bff",
                color: "white",
                padding: "10px",
                borderRadius: "4px",
                cursor: hasSufficientAllowance || isLoading ? "not-allowed" : "pointer",
              }}
              onClick={approveLottery}
              disabled={hasSufficientAllowance || isLoading}
            >
              Approve Lottery
            </button>
            <button
              aria-label="Enter lottery"
              style={{
                background: hasSufficientAllowance ? "#28a745" : "#ccc",
                color: "white",
                padding: "10px",
                borderRadius: "4px",
                cursor: hasSufficientAllowance && !isLoading ? "pointer" : "not-allowed",
              }}
              onClick={enterLottery}
              disabled={!hasSufficientAllowance || isLoading}
            >
              Enter Lottery
            </button>
          </div>
          {isLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #007bff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <span>Processing...</span>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
          {status === "pending" && <div style={{ marginTop: "10px" }}>Transaction Pending...</div>}
          {txReceipt && (
            <div style={{ color: "green", marginTop: "10px" }}>
              Success!{" "}
              <a
                href={`https://explore-testnet.vechain.org/transactions/${txReceipt.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Explorer
              </a>
              <Confetti />
            </div>
          )}
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {error.message.includes("network")
                ? "Network error. Please check your connection."
                : "Transaction failed. Please try again."}
            </div>
          )}
          {!hasSufficientAllowance && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
              Approve the lottery contract to proceed.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default EnterLotteryForm;
