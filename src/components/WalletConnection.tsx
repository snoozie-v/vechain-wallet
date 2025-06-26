import { WalletButton, useWallet } from "@vechain/vechain-kit";
import React, { useState } from "react"

const WalletConnection: React.FC = () => {
  const { account, disconnect } = useWallet();
  const [statusTrigger, setStatusTrigger] = useState(0);

  const handleEnterSuccess = () => {
    setStatusTrigger((prev) => prev + 1); // Trigger status refresh
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>VeChain Wallet Connection</h1>
      <WalletButton />
    </div>
  );
};

  export default WalletConnection;
