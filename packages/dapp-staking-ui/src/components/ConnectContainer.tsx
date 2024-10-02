"use client";

import { useEffect, useState } from "react";
import { PolkadotWalletsContextProvider } from "@polkadot-onboard/react";
import { WalletAggregator } from "@polkadot-onboard/core";
import { InjectedWalletProvider } from "@polkadot-onboard/injected-wallets";
import { extensionConfiguration } from "../configuration/extensionConfiguration";
import Wallets from "./Wallets/Wallets";

const APP_NAME = "dApp staking Demo";

const ConnectContainer = () => {
  const [showWallets, setShowWallets] = useState(false);

  // const injectedWalletProvider = new InjectedWalletProvider(
  //   extensionConfiguration,
  //   APP_NAME
  // );

  // useEffect(() => {
  //   console.log(showWallets);
  // }, [showWallets]);

  // const walletAggregator = new WalletAggregator([injectedWalletProvider]);

  return (
    // <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
    <div>
      {!showWallets && (
        <button
          type="button"
          onClick={() => {
            setShowWallets(true);
          }}
        >
          Connect Wallet
        </button>
      )}

      {showWallets && <Wallets />}
    </div>
    // </PolkadotWalletsContextProvider>
  );
};

export default ConnectContainer;
