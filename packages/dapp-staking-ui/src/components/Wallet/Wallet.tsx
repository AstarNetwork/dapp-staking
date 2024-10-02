"use client";

import { memo, useState } from "react";
import type { BaseWallet, Account } from "@polkadot-onboard/core";
import Image from "next/image";
import styles from "./Wallet.module.css";
import { useAccount } from "@/hooks/useAccount";

const Wallet = ({
  wallet,
  onWalletSelected,
}: {
  wallet: BaseWallet;
  onWalletSelected: (wallet: BaseWallet) => void;
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const { account, setAccount } = useAccount();

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountAddress = event.target.value;
    const selectedAccount = accounts.find(
      (acc) => acc.address === accountAddress
    );

    if (selectedAccount) {
      setAccount(selectedAccount);
    }
  };

  const walletClickHandler = async () => {
    onWalletSelected(wallet);
    if (!isBusy) {
      try {
        setIsBusy(true);
        await wallet.connect();
        const accounts = await wallet.getAccounts();
        setAccounts(accounts);

        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        // handle error
      } finally {
        setIsBusy(false);
      }
    }
  };

  const shortenAddress = (str: string) => {
    const size = 8;
    let result = str;
    if (str && str.length > 2 * size) {
      const start = str.slice(0, size);
      const end = str.slice(-size);
      result = `${start}...${end}`;
    }

    return result;
  };

  return (
    <div className={styles.container} tabIndex={0}>
      <div>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          onClick={walletClickHandler}
          style={{ margin: 5, display: "flex", alignItems: "center" }}
        >
          {wallet?.metadata?.iconUrl && (
            <Image
              width={24}
              height={24}
              src={wallet.metadata.iconUrl}
              alt="wallet icon"
            />
          )}
        </div>
      </div>
      <div>
        {accounts.length > 0 && (
          <select
            id="account-select"
            value={account?.address}
            onChange={handleAccountChange}
          >
            {accounts.map((account, index) => (
              <option key={account.address} value={account.address}>
                {shortenAddress(account.address)} ({account.name})
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default memo(Wallet);
