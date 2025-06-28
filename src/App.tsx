import React from 'react';
import EnterLotteryForm from './components/EnterLotteryForm';
import WalletConnection from './components/WalletConnection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
      <div>
          <WalletConnection />
          <EnterLotteryForm />
          <Footer />
      </div>
  );
};

export default App;
