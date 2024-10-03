"use client";

import { memo } from "react";
import type { Dapp as DappModel } from "@astar-network/dapp-staking-v3/types";
import { canStake, canUnstake } from "@astar-network/dapp-staking-v3";
import styles from "./Dapp.module.css";
import { useAccount, useDappStaking } from "@/hooks";
import InputWithButton from "../InputWithButton/InputWithButton";

const Dapp = ({ dApp }: { dApp: DappModel }) => {
  const { account } = useAccount();
  const { stake, unstake } = useDappStaking();

  const validateStakeAmount = async (
    amount: bigint
  ): Promise<[boolean, string]> => {
    const result = await canStake(account?.address || "", [
      {
        address: dApp.address,
        amount,
      },
    ]);

    return result;
  };

  const validateUnstakeAmount = async (
    amount: bigint
  ): Promise<[boolean, string]> => {
    const result = await canUnstake(
      account?.address || "",
      dApp.address,
      amount
    );

    return result;
  };

  const handleStake = async (amount: bigint) => {
    if (account) {
      await stake(dApp.address, amount);
    }
  };

  const handleUnstake = async (amount: bigint) => {
    if (account) {
      await unstake(dApp.address, amount);
    }
  };

  return (
    <div className={styles.container}>
      <div>{dApp.name}</div>
      <div className={styles.logoAndDescription}>
        <img className={styles.logo} src={dApp.iconUrl} alt={dApp.name} />
        <div>{dApp.description}</div>
      </div>
      {account && (
        <>
          <InputWithButton
            buttonText="Stake"
            validateAmount={validateStakeAmount}
            onButtonClick={handleStake}
          />
          <InputWithButton
            buttonText="Unstake"
            validateAmount={validateUnstakeAmount}
            onButtonClick={handleUnstake}
          />
        </>
      )}
    </div>
  );
};

export default memo(Dapp);
