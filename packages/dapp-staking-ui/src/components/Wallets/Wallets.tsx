"use client";

import { memo, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useWallets } from "@polkadot-onboard/react";
import type { BaseWallet } from "@polkadot-onboard/core";
import { initApi } from "@astar-network/dapp-staking-v3";
import Wallet from "../Wallet/Wallet";
import styles from "./Wallets.module.css";
import { useApi } from "@/hooks/useApi";
import { useAccount } from "@/hooks/useAccount";
import { RPC_ENDPOINT } from "@/configuration/constants";

const Wallets = () => {
  const { wallets } = useWallets();
  const { setApi } = useApi();
  const { wallet, setWallet } = useAccount();

  useEffect(() => {
    const setupApi = async () => {
      const provider = new WsProvider(RPC_ENDPOINT);
      const api = await ApiPromise.create({ provider });

      setApi(api);
      initApi(api);
    };

    setupApi();
  }, [setApi]);

  const shouldRenderWallet = (w: BaseWallet): boolean =>
    wallet === undefined || wallet === w;

  if (!Array.isArray(wallets)) {
    console.error("Wallets is not an array");
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
