import React from "react";
import { TransactionExamples } from "./TransactionExamples";
import { useWallet, useSendTransaction, getConfig, useTransactionModal, TransactionModal } from "@vechain/vechain-kit";

const EnterLotteryForm: React.FC = () => {
    const { account } = useWallet();

  return (
    <div>
        <h1>Enter Lottery</h1>
        <p>Coming soon</p>
    </div>
)
}

export default EnterLotteryForm
