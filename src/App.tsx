import React from 'react';
import { VeChainKitProvider } from '@vechain/vechain-kit';
import WalletConnection from './components/WalletConnection';

const App: React.FC = () => {
  return (
    <VeChainKitProvider
      network={{
        type: 'test',
      }}
      darkMode={false}
      language='en'
      dappKit={{
        allowedWallets: ['sync2', 'veworld'], // Corrected syntax
      }}
      >
      <WalletConnection />
    </VeChainKitProvider>
  );
};

export default App;
