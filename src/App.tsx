import React from 'react';
import EnterLotteryForm from './components/EnterLotteryForm';
import WalletConnection from './components/WalletConnection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
      <div>
          <WalletConnection />
          <div style={{ textAlign: "center" }}>
            <h2 >Enter for 10k $SHT</h2>
            <h4 >Winner pulled on Sundays 4pm UTC</h4>
            <p> 90% of prize distributed to one winner</p>
            <p> 10% of prize pool to be burned</p>
          </div>
          <EnterLotteryForm />
          <Footer />
      </div>
  );
};

export default App;
