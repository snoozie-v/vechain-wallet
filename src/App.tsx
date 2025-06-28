import React from 'react';
import EnterLotteryForm from './components/EnterLotteryForm';
import WalletConnection from './components/WalletConnection';
import LotteryStatus from './components/LotteryStatus';


const App: React.FC = () => {
  return (
      <div>
          <WalletConnection />
          <EnterLotteryForm />
      </div>
  );
};

export default App;
