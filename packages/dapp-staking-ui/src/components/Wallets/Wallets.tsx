"use client";

import { memo } from "react";
import { useWallets } from "@polkadot-onboard/react";
import type { BaseWallet } from "@polkadot-onboard/core";
import Wallet from "../Wallet/Wallet";
import styles from "./Wallets.module.css";
import { useAccount } from "@/hooks";

const Wallets = () => {
  const { wallets } = useWallets();
  const { wallet, setWallet } = useAccount();

  const shouldRenderWallet = (w: BaseWallet): boolean =>
    wallet === undefined || wallet === w;

  if (!Array.isArray(wallets)) {
    console.error("Wallets is not an array.");
    return null;
  }

  return (
    <div className={styles.container}>
      {wallets.map(
        (wallet: BaseWallet) =>
          shouldRenderWallet(wallet) && (
            <Wallet
              key={wallet.metadata.title}
              wallet={wallet}
              onWalletSelected={() => setWallet(wallet)}
            />
          )
      )}
    </div>
  );
};

export default memo(Wallets);
