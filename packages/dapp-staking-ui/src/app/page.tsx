"use client";

import { Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import ConnectContainer from "@/components/ConnectContainer";
import { InjectedWalletProvider } from "@polkadot-onboard/injected-wallets";
import { extensionConfiguration } from "@/configuration/extensionConfiguration";
import { WalletAggregator } from "@polkadot-onboard/core";
import { PolkadotWalletsContextProvider } from "@polkadot-onboard/react";
import { CurrentAccountProvider } from "@/hooks/AccountProvider";
import { ApiProvider } from "@/hooks/ApiProvider";
import Dapps from "@/components/Dapps/Dapps";

const APP_NAME = "dApp staking Demo";

export default function Home() {
  const injectedWalletProvider = new InjectedWalletProvider(
    extensionConfiguration,
    APP_NAME
  );
  const walletAggregator = new WalletAggregator([injectedWalletProvider]);

  return (
    <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
      <ApiProvider>
        <CurrentAccountProvider>
          <div className={styles.page}>
            <div className={styles.header}>
              <h2>dApp staking library demo</h2>
              <ConnectContainer />
            </div>
            <main className={styles.main}>
              <Dapps />
            </main>
            <Toaster />
          </div>
        </CurrentAccountProvider>
      </ApiProvider>
    </PolkadotWalletsContextProvider>
  );
}
