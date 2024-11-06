import React from "react";
import type { Signer } from "@polkadot/api/types";
import {
  getStakeCall,
  canStake,
  type StakeInfo,
} from "@astar-network/dapp-staking-v3";
import { useSignAndSend } from "@/hooks";

type StakeButtonProps = {
  stakerAddress: string;
  contractAddress: string;
  amountToStakeInWei: bigint;
  amountToLockInWei: bigint;
  signer: Signer;
  onTransactionStateChange?: (isBusy: boolean, status: string) => void;
  onError?: (message: string) => void;
};

const StakeButton: React.FC<StakeButtonProps> = ({
  signer,
  stakerAddress,
  contractAddress,
  amountToStakeInWei,
  amountToLockInWei,
  onTransactionStateChange,
  onError,
}: StakeButtonProps) => {
  const { signAndSend } = useSignAndSend(signer, stakerAddress);

  const handleStake = async () => {
    if (signer) {
      const stakeInfo: StakeInfo[] = [
        {
          address: contractAddress,
          amount: amountToStakeInWei,
        },
      ];

      try {
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
        await signAndSend(stakeCall, (isBusy: boolean, status: string) => {
          onTransactionStateChange?.(isBusy, status);
        });
      } catch (error) {
        const e = error as Error;
        onError?.(e.message);
      }
    } else {
      throw new Error("Signer prop is required.");
    }
  };

  return (
    <div>
      {signer ? (
        <button type="button" onClick={handleStake}>
          Stake
        </button>
      ) : (
        "Signer prop is required."
      )}
    </div>
  );
};

export default StakeButton;
