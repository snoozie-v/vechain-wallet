import React, { useState, useCallback } from "react";
import { getLotteryStatus } from "../services/lotteryService";

// Update the interface to match the API response
interface LotteryStatusData {
  balance?: string; // Changed from number to string to match API
  playerCount?: string; // Changed from any to number, assuming these are numbers
  uniquePlayerCount?: string; // Changed from any to number
  lastWinner?: string; // Changed from any to string
  lastWinningAmount?: string; // Changed from number to string to match API
}

const LotteryStatus: React.FC = () => {
  const [status, setStatus] = useState<LotteryStatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLotteryStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const lotteryStatus = await getLotteryStatus();
      // Handle undefined explicitly
      setStatus(lotteryStatus ?? null); // Convert undefined to null
      console.log(lotteryStatus);
    } catch (err) {
      console.error("Failed to fetch lottery status:", err);
      setError("Failed to load lottery status. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h1>Lottery Status</h1>
      <button onClick={handleLotteryStatus} disabled={loading}>
        {loading ? "Loading..." : "Get Lottery Status"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {status ? (
        <>
          <p>Balance: {status.balance ?? "N/A"}</p>
          <p>Player Count: {status.playerCount ?? "N/A"}</p>
          <p>Unique Player Count: {status.uniquePlayerCount ?? "N/A"}</p>
          <p>Last Winner: {status.lastWinner ?? "N/A"}</p>
          <p>Last Winning Amount: {status.lastWinningAmount ?? "N/A"}</p>
        </>
      ) : (
        !loading && <p>No status available. Click the button to fetch.</p>
      )}
    </div>
  );
};

export default LotteryStatus;
