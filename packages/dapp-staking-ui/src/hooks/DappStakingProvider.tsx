"use client";

import { createContext, useState } from "react";
import type {
  AccountLedger,
  ProtocolState,
  SingularStakingInfo,
} from "@astar-network/dapp-staking-v3";

export type Rewards = {
  staker: bigint;
  bonus: bigint;
};

type DappStaking = {
  stakeInfo?: Map<string, SingularStakingInfo>;
  setStakeInfo: (stakeInfo: Map<string, SingularStakingInfo>) => void;
  protocolState?: ProtocolState;
  setProtocolState: (protocolState: ProtocolState) => void;
  rewards?: Rewards;
  setRewards: (rewards: Rewards) => void;
  ledger?: AccountLedger;
  setLedger: (ledger: AccountLedger) => void;
};

export const DappStakingContext = createContext<DappStaking | undefined>(
  undefined
);

export function DappStakingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stakeInfo, setStakeInfo] =
    useState<Map<string, SingularStakingInfo>>();
  const [protocolState, setProtocolState] = useState<ProtocolState>();
  const [rewards, setRewards] = useState<Rewards>();
  const [ledger, setLedger] = useState<AccountLedger>();

  return (
    <>
      <DappStakingContext.Provider
        value={{
          stakeInfo,
          protocolState,
          rewards,
          ledger,
          setStakeInfo,
          setProtocolState,
          setRewards,
          setLedger,
        }}
      >
        {children}
      </DappStakingContext.Provider>
    </>
  );
}
