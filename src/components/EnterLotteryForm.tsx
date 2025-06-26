// import React from 'react';
// import { useThor } from '@vechain/dapp-kit-react';
// import { useLotteryData } from '../hooks/useLotteryData';
// import { useLotteryActions } from '../hooks/useLotteryActions';
// import { ENTRY_AMOUNT } from '../constants/amounts';

// interface EnterLotteryFormProps {
//   lotteryAddress: string;
//   tokenAddress: string;
//   onEnterSuccess: () => void;
// }

// const EnterLotteryForm: React.FC<EnterLotteryFormProps> = ({
//   lotteryAddress,
//   tokenAddress,
//   onEnterSuccess,
// }) => {
//   const thor = useThor();
//   const { allowance, winProbability, dataError } = useLotteryData(0);
//   const {
//     checkAllowance,
//     approve,
//     enter,
//     isApproving,
//     isEntering,
//     isCheckingAllowance,
//     output,
//   } = useLotteryActions(onEnterSuccess);

//   const formattedAllowance =
//     allowance !== null ? (Number(allowance) / 10 ** 18).toFixed(2) : '0.00';
//   const needsApproval = allowance === null || allowance < ENTRY_AMOUNT;

//   return (
//     <div>
//       <h2>Enter Lottery</h2>

//       {!thor && <p>Please connect a wallet to participate.</p>}

//       <div>
//         <button
//           onClick={() => checkAllowance(thor)}
//           disabled={!thor || isCheckingAllowance || isApproving || isEntering}
//         >
//           {isCheckingAllowance ? 'Checking...' : 'Check Allowance'}
//         </button>
//       </div>
//       {allowance === null && !isCheckingAllowance ? (
//         <p>Loading allowance...</p>
//       ) : (
//         allowance !== null && <p>Approved tokens: {formattedAllowance} SHT</p>
//       )}

//       {needsApproval ? (
//         <button
//           onClick={approve}
//           disabled={!thor || isApproving || isEntering || isCheckingAllowance}
//         >
//           {isApproving ? 'Approving...' : `Approve ${Number(ENTRY_AMOUNT) / 10 ** 18} SHT`}
//         </button>
//       ) : (
//         <button
//           onClick={enter}
//           disabled={!thor || isApproving || isEntering || isCheckingAllowance}
//         >
//           {isEntering ? 'Entering...' : 'Enter Lottery (10,000 SHT)'}
//         </button>
//       )}

//       {winProbability !== null && <p>Your win probability: {winProbability}%</p>}
//       {dataError && <p>{dataError}</p>}
//       {output && <p>{output}</p>}
//     </div>
//   );
// };

// export default EnterLotteryForm;
