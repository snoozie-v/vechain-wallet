    import React from "react"
    import { VeChainKitProvider } from "@vechain/vechain-kit"
    
    const VechainProvider: React.FC = ({children}: any) => {
      
      return (
    <VeChainKitProvider
      feeDelegation={{
        delegatorUrl: "https://sponsor-mainnet.vechain.energy/by/441",
        // set to false if you want to delegate ONLY social login transactions
        // social login transactions sponsorship is currently mandatory
        delegateAllTransactions: false,
      }}
      loginMethods={[
        // {method: "vechain", gridColumn: 4},
        {method: "dappkit", gridColumn: 4},
      ]}
      dappKit={{
        allowedWallets: ["veworld", "sync2"],
        // walletConnectOptions: {
        //   projectId:
        //     // Get this on https://cloud.reown.com/sign-in
        //     process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
        //   metadata: {
        //     name: "React Dapp Template",
        //     description: "This is the description of your app visible in VeWorld upon connection request.",
        //     url: typeof window !== "undefined" ? window.location.origin : "",
        //     icons: ["https://path-to-logo.png"],
        //   },
        // },
      }}
      darkMode={false}
      language="en"
      network={{
        type: "main",
      }}
    >
    {children}
    </VeChainKitProvider>
    )
    }
    export default VechainProvider



