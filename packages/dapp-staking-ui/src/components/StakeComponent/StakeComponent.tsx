import { memo } from "react";
import type { Signer } from "@polkadot/api/types";
import {
  getStakeCall,
  canStake,
  type StakeInfo,
} from "@astar-network/dapp-staking-v3";
import { useSignAndSend } from "@/hooks";
import { on } from "events";

type StakerComponentProps = {
  stakerAddress: string;
  contractAddress: string;
  amountToStakeInWei: bigint;
  amountToLockInWei: bigint;
  signer: Signer;
  onTransactionStateChange?: (isBusy: boolean, status: string) => void;
  onError?: (message: string) => void;
};

const StakerComponent: React.FC<StakerComponentProps> = ({
  signer,
  stakerAddress,
  contractAddress,
  amountToStakeInWei,
  amountToLockInWei,
  onTransactionStateChange,
  onError,
}: StakerComponentProps) => {
  const { signAndSend } = useSignAndSend(signer);

  const handleStake = async () => {
    if (signer) {
      const stakeInfo: StakeInfo[] = [
        {
          address: contractAddress,
          amount: amountToStakeInWei,
        },
      ];

      const [result, error] = await canStake(stakerAddress, stakeInfo);
      if (!result) {
        onError?.(error);
        return;
      }

      const stakeCall = await getStakeCall(
        stakerAddress,
        amountToLockInWei,
        stakeInfo
      );
      await signAndSend(stakeCall, (isBusy, status) => {
        onTransactionStateChange?.(isBusy, status);
      });
    } else {
      throw new Error("Please connect your wallet and select account first.");
    }
  };

  return (
    <div>
      {signer ? (
        <button type="button" onClick={handleStake}>
          Stake
        </button>
      ) : (
        "Please connect your wallet and select account first."
      )}
    </div>
  );
};

export default memo(StakerComponent);
