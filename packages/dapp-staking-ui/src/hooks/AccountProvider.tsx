"use client";

import { createContext, useState } from "react";
import type { Account, BaseWallet } from "@polkadot-onboard/core";

type CurrentAccount = {
  account?: Account;
  setAccount: (account: Account) => void;
  wallet?: BaseWallet;
  setWallet: (wallet: BaseWallet) => void;
};

export const CurrentAccountContext = createContext<CurrentAccount | undefined>(
  undefined
);

export function CurrentAccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [account, setAccount] = useState<Account>();
  const [wallet, setWallet] = useState<BaseWallet>();

  return (
    <>
      <CurrentAccountContext.Provider
        value={{
          account,
          setAccount,
          wallet,
          setWallet,
        }}
      >
        {children}
      </CurrentAccountContext.Provider>
    </>
  );
}
