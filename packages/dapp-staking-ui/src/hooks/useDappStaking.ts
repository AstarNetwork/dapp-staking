import { useContext, useEffect } from "react";
import { DappStakingContext } from "./DappStakingProvider";
import { useAccount } from "./useAccount";
import {
  getStakeCall,
  getStakerInfo,
  getUnstakeCall,
} from "@astar-network/dapp-staking-v3";
import { useSignAndSend } from "./useSignAndSend";
import { errorToast, infoToast, successToast } from "@/app/toast";

export const useDappStaking = () => {
  const { account } = useAccount();
  const { signAndSend } = useSignAndSend();
  const context = useContext(DappStakingContext);

  if (!context) {
    throw new Error("useDappStaking must be used within a DappStakingProvider");
  }

  useEffect(() => {
    if (account) {
      fetchStakeInfo();
    }
  }, [account]);

  const stake = async (contractAddress: string, stakeAmount: bigint) => {
    if (account) {
      const stakeCall = await getStakeCall(account.address, stakeAmount, [
        {
          address: contractAddress,
          amount: stakeAmount,
        },
      ]);

      try {
        await signAndSend(stakeCall, (isBusy, status) => {
          status && infoToast(status);

          if (!isBusy) {
            successToast("Staking successful");
            fetchStakeInfo();
          }
        });
      } catch (error) {
        const e = error as Error;
        errorToast(e.message);
      }
    }
  };

  const unstake = async (contractAddress: string, amount: bigint) => {
    if (account) {
      const unstakeCall = await getUnstakeCall(
        account.address,
        contractAddress,
        amount
      );

      try {
        await signAndSend(unstakeCall, (isBusy, status) => {
          status && infoToast(status);

          if (!isBusy) {
            successToast("Un-staking successful");
            fetchStakeInfo();
          }
        });
      } catch (error) {
        const e = error as Error;
        errorToast(e.message);
      }
    }
  };

  const fetchStakeInfo = async () => {
    const stakeInfo = await getStakerInfo(account?.address || "");
    context.setStakeInfo(stakeInfo);
  };

  return { ...context, fetchStakeInfo, stake, unstake };
};
