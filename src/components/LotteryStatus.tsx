//  import React from 'react';
// import { useLotteryData } from '../hooks/useLotteryData';

// interface LotteryStatusProps {
//   lotteryAddress: string;
//   statusTrigger: number;
//   decimals: number;
// }

// const LotteryStatus: React.FC<LotteryStatusProps> = ({ lotteryAddress, statusTrigger, decimals }) => {
//   const { status, statusError } = useLotteryData(statusTrigger);

//   const balance = parseFloat(status.balance);
//   const lastWinningAmount = parseFloat(status.lastWinningAmount);

//   return (
//     <div>
//       <h2>Lottery Status</h2>
//       {statusError ? (
//         <p>{statusError}</p>
//       ) : (
//         <div>
//           <p>
//             <strong>Entry Count:</strong> {status.playerCount}
//           </p>
//           <p>
//             <strong>Unique Players:</strong> {status.uniquePlayerCount}
//           </p>
//           <p>
//             <strong>Current Prize Balance:</strong> {(balance * 0.9).toFixed(2)} SHT
//           </p>
//           <p>
//             <strong>Current Burn Balance:</strong> {(balance * 0.1).toFixed(2)} SHT
//           </p>
//           <p>
//             <strong>Last Winner:</strong> {status.lastWinner}
//           </p>
//           <p>
//             <strong>Last Winning Amount:</strong> {lastWinningAmount.toFixed(2)} SHT
//           </p>
//           <p>
//             <strong>Last Burn Amount:</strong>{' '}
//             {(lastWinningAmount / 0.9 - lastWinningAmount).toFixed(2)} SHT
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LotteryStatus;
