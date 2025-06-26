import React from 'react';
import { VeChainKitProvider } from '@vechain/vechain-kit';
import WalletConnection from './components/WalletConnection';

console.log('test', 'test');

const App: React.FC = () => {
  return (
    <VeChainKitProvider
      network={{
        type: 'test',
      }}
      darkMode={false}
      language="en"
      dappKit={{
        allowedWallets: ['veworld'], // Focus on VeWorld
      }}
    >
      <WalletConnection />
    </VeChainKitProvider>
  );
};

export default App;
