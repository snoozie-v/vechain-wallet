import React from 'react';

import WalletConnection from './components/WalletConnection';
import LotteryStatus from './components/LotteryStatus';


const App: React.FC = () => {
  return (
      <div>
          <LotteryStatus />
          <WalletConnection />
      </div>
  );
};

export default App;
