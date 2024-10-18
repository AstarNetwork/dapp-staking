"use client";

import { memo } from "react";
import { errorToast, infoToast } from "@/app/toast";
import type { Dapp as DappModel } from "@astar-network/dapp-staking-v3/types";
import { canStake, canUnstake } from "@astar-network/dapp-staking-v3";
import styles from "./Dapp.module.css";
import { useAccount, useDappStaking } from "@/hooks";
import InputWithButton from "../InputWithButton/InputWithButton";
import { StakeButton } from "@astar-network/dapp-staking-components";

const Dapp = ({ dApp }: { dApp: DappModel }) => {
  const { account, wallet } = useAccount();
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

  const handleProgress = (isBusy: boolean, status: string) => {
    infoToast(status);
  };

  return (
    <div className={styles.container}>
      <h4>{dApp.name}</h4>
      <div className={styles.logoAndDescription}>
        <img className={styles.logo} src={dApp.iconUrl} alt={dApp.name} />
        <div>{dApp.address}</div>
      </div>
      <div className={styles.images}>
        {dApp.imagesUrl.map((url, index) => (
          <img className={styles.image} key={url} src={url} alt={dApp.name} />
        ))}
      </div>
      <div>{dApp.description}</div>
      {account && wallet && (
        <div className={styles.inputs}>
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
          {wallet.signer && (
            <StakeButton
              signer={wallet.signer}
              stakerAddress={account.address}
              contractAddress={dApp.address}
              amountToLockInWei={BigInt("5000000000000000000")}
              amountToStakeInWei={BigInt("5000000000000000000")}
              onTransactionStateChange={(_, status) => infoToast(status)}
              onError={(message: string) => errorToast(message)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Dapp);
