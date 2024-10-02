"use client";

import { useState } from "react";
import Wallets from "./Wallets/Wallets";

const APP_NAME = "dApp staking Demo";

const ConnectContainer = () => {
  const [showWallets, setShowWallets] = useState(false);

  return (
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
  );
};

export default ConnectContainer;
