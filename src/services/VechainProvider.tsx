import React from 'react';
import { VeChainKitProvider } from '@vechain/vechain-kit';

interface VeChainProviderProps {
  children: React.ReactNode;
}

const MAINNET_WALLET_CONNECT_PROJECT_ID = '2f05ae7f1116030fde2d36508f472bfb';

export function VeChainProvider({ children }: VeChainProviderProps) {
  return (
    <VeChainKitProvider
      feeDelegation={{
        delegatorUrl: 'https://sponsor-testnet.vechain.energy/by/441',
        delegateAllTransactions: false,
      }}
      loginMethods={[
        // { method: 'vechain', gridColumn: 4 },
        { method: 'dappkit', gridColumn: 4 }
      ]}
      dappKit={{
        allowedWallets: ['veworld'],
        walletConnectOptions: {
          projectId: MAINNET_WALLET_CONNECT_PROJECT_ID,
          metadata: {
            name: 'SHT Lotto',
            description: 'A VeChain lottery dApp for SHT token holders',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            icons: ['/sht.png']
          }
        }
      }}
      darkMode={true}
      language="en"
      network={{ type: 'test' }}
    >
      {children}
    </VeChainKitProvider>
  );
}



