"use client";

import { InjectedWalletProvider } from "@polkadot-onboard/injected-wallets";
import { extensionConfiguration } from "@/configuration/extensionConfiguration";
import { WalletAggregator } from "@polkadot-onboard/core";
import { PolkadotWalletsContextProvider } from "@polkadot-onboard/react";
import { Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import ConnectContainer from "@/components/ConnectContainer";
import {
  CurrentAccountProvider,
  ApiProvider,
  DappStakingProvider,
} from "@/hooks";
import Dapps from "@/components/Dapps/Dapps";
import ProtocolState from "@/components/ProtocolState/ProtocolState";
import Rewards from "@/components/Rewards/Rewards";
import RewardsFor from "@/components/RewardsFor/RewardsFor";
import StakerInfo from "@/components/StakerInfo/StakerInfo";

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
          <DappStakingProvider>
            <div className={styles.page}>
              <div className={styles.header}>
                <div className={styles.title}>
                  <h2>dApp staking library demo</h2>
                  <ConnectContainer />
                </div>
                <ProtocolState />
              </div>
              <main className={styles.main}>
                <StakerInfo />
                <Rewards />
                <Dapps />
                <RewardsFor />
              </main>
              <Toaster />
            </div>
          </DappStakingProvider>
        </CurrentAccountProvider>
      </ApiProvider>
    </PolkadotWalletsContextProvider>
  );
}
