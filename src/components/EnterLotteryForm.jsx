import React, { useEffect } from "react";
import { useWallet, useSendTransaction, getConfig, useTransactionModal, TransactionModal } from "@vechain/vechain-kit";
import { ThorClient } from "@vechain/sdk-network";
import { ABIContract } from "@vechain/sdk-core";
import lotteryABI from "../abis/lotteryABI";
import shtABI from "../abis/shtABI";
import { LOTTERY_ADDRESS, TOKEN_ADDRESS } from "../constants/addresses";
import { ENTRY_AMOUNT, APPROVAL_AMOUNT, DECIMALS } from "../constants/amounts";
const thor = ThorClient.fromUrl("https://testnet.vechain.org");

const EnterLotteryForm = () => {
    const { account } = useWallet();
    const [allowance, setAllowance] = React.useState(0n);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasSufficientAllowance, setHasSufficientAllowance] = React.useState(false);

    // Check allowance when account changes
    async function checkAllowance() {
        if (!account?.address) {
            console.log("No account connected");
            return 0n;
        }
        setIsLoading(true);
        try {
            console.log("Checking allowance for:", account.address, LOTTERY_ADDRESS);
            const tokenContract = thor.contracts.load(TOKEN_ADDRESS, shtABI);
            const allowed = await tokenContract.read.allowance(account.address, LOTTERY_ADDRESS);
            const allowanceValue = BigInt(allowed.toString());
            console.log("Allowance retrieved:", allowanceValue);
            setAllowance(allowanceValue);
            return allowanceValue;
        } catch (err) {
            console.error("Failed to check allowance:", err);
            return 0n;
        } finally {
            setIsLoading(false);
        }
    }

    // Run checkAllowance when account changes
    useEffect(() => {
        if (account?.address) {
            checkAllowance();
        }
    }, [account?.address]);

    // Encode approve function data
    const encodedApproveData = React.useMemo(() => {
        if (!account?.address) {
            console.log("No account address, cannot encode approve data");
            return null;
        }
        try {
            const contract = ABIContract.ofAbi(shtABI);
            const encoded = contract.encodeFunctionInput("approve", [LOTTERY_ADDRESS, APPROVAL_AMOUNT]).toString();
            console.log("Encoded approve data:", encoded);
            return encoded;
        } catch (err) {
            console.error("Failed to encode approve data:", err);
            return null;
        }
    }, [account?.address]);

    const {
        sendTransaction,
        status,
        txReceipt,
        isTransactionPending,
        error,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? "",
    });

    async function approveLottery() {
        if (!account?.address) {
            console.error("No account connected");
            return;
        }
        if (!encodedApproveData) {
            console.error("No encoded approve data available");
            return;
        }

        // Check if approval is necessary
        const currentAllowance = await checkAllowance();
        if (currentAllowance >= APPROVAL_AMOUNT) {
            console.log("Sufficient allowance already exists:", currentAllowance);
            return;
        }

        setIsLoading(true);
        try {
            console.log("Sending approve transaction...");
            // Estimate gas for the transaction
            const gasEstimate = await thor.transactions.estimateGas([{
                to: TOKEN_ADDRESS,
                value: "0x0",
                data: encodedApproveData,
            }], account.address);
            console.log("Estimated gas:", gasEstimate);

            const txResponse = await sendTransaction([{
                to: TOKEN_ADDRESS,
                value: "0x0",
                data: encodedApproveData,
                comment: "Approve lottery contract to spend tokens",
                gas: gasEstimate.totalGas, // Use estimated gas
            }]);

            console.log("Transaction sent:", txResponse);
        } catch (err) {
            console.error("Approve transaction failed:", err);
        } finally {
            setIsLoading(false);
        }
    }

        const encodedEnterData = React.useMemo(() => {
        if (!account?.address) {
            console.log("No account address, cannot encode enter data");
            return null;
        }
        try { 
            const contract = ABIContract.ofAbi(lotteryABI);
            const encoded = contract.encodeFunctionInput("enter", []).toString();
            console.log("Encoded enter data:", encoded);
            return encoded;

        } catch (err) {
            console.error("Failed to encode enter data:", err);
            return null;
        }}, [account?.address]);

    async function enterLottery() {
        if (!account?.address) {
            console.error("No account connected");
            return;
        }
        if (!encodedEnterData) {
            console.error("No encoded enter data available");
            return;
        }

        const currentAllowance = await checkAllowance();
        if (currentAllowance < ENTRY_AMOUNT) {
            console.error("Insufficient allowance for entry:", currentAllowance);
            setHasSufficientAllowance(false);
            return;
        }

        setIsLoading(true);
        try {
            console.log("Sending enter transaction...");
            const gasEstimate = await thor.transactions.estimateGas(
                [{
                    to: LOTTERY_ADDRESS,
                    value: "0x0",
                    data: encodedEnterData,
                }],
                account.address
            );
            console.log("Estimated gas for enter:", gasEstimate);

            const txResponse = await sendTransaction([{
                to: LOTTERY_ADDRESS,
                value: "0x0",
                data: encodedEnterData,
                comment: "Enter lottery with tokens",
                gas: gasEstimate.totalGas,
            }]);

            console.log("Enter transaction sent:", txResponse);
        } catch (err) {
            console.error("Enter transaction failed:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h1>Enter Lottery</h1>
            <p>Coming soon</p>
            <button onClick={checkAllowance} disabled={isLoading || !account?.address}>
                Check Allowance
            </button>
            <p>Allowance: {allowance.toString() }</p>
            <button
                onClick={approveLottery}
                disabled={isLoading || isTransactionPending || !encodedApproveData || !account?.address}
            >
                Approve Lottery
            </button>
            {isLoading && <div>Loading...</div>}
            {status === "pending" && <div>Transaction Pending...</div>}
            {error && <div>Error: {error.message || error.reason || JSON.stringify(error)}</div>}
            {txReceipt && <div>Transaction Receipt: {JSON.stringify(txReceipt)}</div>}
            <button 
                onClick={enterLottery}
            >
                Enter Lottery
              </button>
        </div>
    );
};

export default EnterLotteryForm;
