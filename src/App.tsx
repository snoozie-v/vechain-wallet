import React from 'react';
import { DAppKitProvider, WalletButton, useWallet } from '@vechain/dapp-kit-react';

// Main App Component
const App: React.FC = () => {
  return (
    <DAppKitProvider
      node={'https://testnet.vechain.org/'}
            // OPTIONAL: Required if you're not connecting to the main net
      usePersistence={true}

      logLevel="DEBUG"
      themeMode="LIGHT"
      allowedWallets={['veworld', 'sync2']}
      requireCertificate={false}
    >
      <WalletConnection />
    </DAppKitProvider>
  );
};

// Wallet Connection Component
const WalletConnection: React.FC = () => {
  const { account, source, disconnect } = useWallet();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>VeChain Wallet Connection</h1>
      {!account ? (
        <WalletButton />
      ) : (
        <div>
          <p><strong>Connected Account:</strong> {account}</p>
          <p><strong>Wallet Source:</strong> {source}</p>
          <button onClick={disconnect}>Disconnect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default App;
