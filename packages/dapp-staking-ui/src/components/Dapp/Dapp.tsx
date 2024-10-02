"use client";

import { memo, useEffect, useState } from "react";
import type { Dapp as DappModel } from "@astar-network/dapp-staking-v3/types";
import {
  canStake as checkCanStake,
  getStakeCall,
} from "@astar-network/dapp-staking-v3";
import styles from "./Dapp.module.css";
import { useAccount } from "@/hooks/useAccount";

const Dapp = ({ dApp }: { dApp: DappModel }) => {
  const { account, wallet } = useAccount();
  const [stakeAmount, setStakeAmount] = useState<bigint>(BigInt(0));
  const [canStake, setCanStake] = useState(false);
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    console.log(stakeAmount, account);

    const checkStakeAmount = async () => {
      if (account) {
        const canStakeResult = await checkCanStake(account?.address, [
          {
            address: dApp.address,
            amount: stakeAmount,
          },
        ]);

        setCanStake(canStakeResult[0]);
        setMessage(canStakeResult[1]);
      }
    };

    checkStakeAmount();
  }, [stakeAmount, account, dApp.address]);

  const handleStakeAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const stakeAmountInWei = BigInt(
      Number(event.target.value) * Number(10 ** 18)
    );
    setStakeAmount(stakeAmountInWei);
  };

  const handleStake = async () => {
    if (account && wallet) {
      const stakeCall = await getStakeCall(account.address, stakeAmount, [
        {
          address: dApp.address,
          amount: stakeAmount,
        },
      ]);

      stakeCall.signAndSend(
        account.address,
        {
          signer: wallet.signer,
          nonce: -1,
          withSignedTransaction: true,
        },
        (result) => {
          console.log("stake result", result);
        }
      );
    }
  };

  return (
    <div className={styles.container}>
      <div>{dApp.name}</div>
      <div className={styles.logoAndDescription}>
        <img className={styles.logo} src={dApp.iconUrl} alt={dApp.name} />
        <div>{dApp.description}</div>
      </div>
      <div>
        <input
          type="number"
          min="0"
          placeholder="0 ASTR"
          onChange={handleStakeAmountChange}
        />
        <button type="button" disabled={!canStake} onClick={handleStake}>
          Stake
        </button>
      </div>
      <div>{message}</div>
    </div>
  );
};

export default memo(Dapp);
