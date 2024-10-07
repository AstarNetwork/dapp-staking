import { useContext, useEffect } from "react";
import { DappStakingContext } from "./DappStakingProvider";
import { useAccount } from "./useAccount";
import {
  getStakeCall,
  getStakerInfo,
  getStakerRewards,
  getBonusRewards,
  getUnstakeCall,
  subscribeToProtocolStateChanges,
  getClaimStakerRewardsCall,
  getAccountLedger,
} from "@astar-network/dapp-staking-v3";
import { useSignAndSend } from "./useSignAndSend";
import { errorToast, infoToast, successToast } from "@/app/toast";
import { useApi } from "./useApi";
import { batchCalls } from "@astar-network/dapp-staking-v3/utils";
import toast from "react-hot-toast";
import { getClaimUnlockedCall } from "../../../astar-dapp-staking-v3/build/logic/unstake";

let isHookInitialized = false;

export const useDappStaking = () => {
  const { account } = useAccount();
  const { isInitialized } = useApi();
  const { signAndSend } = useSignAndSend();
  const context = useContext(DappStakingContext);

  if (!context) {
    throw new Error("useDappStaking must be used within a DappStakingProvider");
  }

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (account) {
      fetchStakeInfo();
      fetchRewards();
      fetchAccountLedger();
    }

    if (!isHookInitialized) {
      subscribeToProtocolStateChanges((state) => {
        context.setProtocolState(state);
        fetchRewards();
      });

      isHookInitialized = true;
    }
  }, [account, isInitialized]);

  const fetchRewards = async () => {
    if (account) {
      const [staker, bonus] = await Promise.all([
        getStakerRewards(account.address),
        getBonusRewards(account.address),
      ]);

      const rewards = {
        staker: staker.amount,
        bonus,
      };
      context.setRewards(rewards);
    }
  };

  const fetchAccountLedger = async () => {
    if (account) {
      const ledger = await getAccountLedger(account.address);
      context.setLedger(ledger);
    }
  };

  const claimStakerRewards = async (): Promise<void> => {
    if (account) {
      const claimCall = await getClaimStakerRewardsCall(account.address);
      if (claimCall.length === 0) {
        toast.error("No rewards to claim.");
        return;
      }

      const batch = await batchCalls(claimCall);

      try {
        await signAndSend(batch, (isBusy, status) => {
          status && infoToast(status);

          if (!isBusy) {
            successToast("Claim staker rewards successful");
            fetchRewards();
          }
        });
      } catch (error) {
        const e = error as Error;
        errorToast(e.message);
      }
    }
  };

  const stake = async (
    contractAddress: string,
    stakeAmount: bigint
  ): Promise<void> => {
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
            fetchAccountLedger();
          }
        });
      } catch (error) {
        const e = error as Error;
        errorToast(e.message);
      }
    }
  };

  const unstake = async (
    contractAddress: string,
    amount: bigint
  ): Promise<void> => {
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
            fetchAccountLedger();
          }
        });
      } catch (error) {
        const e = error as Error;
        errorToast(e.message);
      }
    }
  };

  const claimUnlocked = async (): Promise<void> => {
    if (account) {
      const claimCall = await getClaimUnlockedCall();

      try {
        await signAndSend(claimCall, (isBusy, status) => {
          status && infoToast(status);

          if (!isBusy) {
            successToast("Claim unlocked successful");
            fetchAccountLedger();
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

  return {
    ...context,
    fetchStakeInfo,
    stake,
    unstake,
    claimStakerRewards,
    fetchAccountLedger,
    claimUnlocked,
  };
};
