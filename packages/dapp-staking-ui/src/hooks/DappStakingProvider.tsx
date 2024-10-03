"use client";

import { createContext, useState } from "react";
import type { SingularStakingInfo } from "@astar-network/dapp-staking-v3";

type DappStaking = {
  stakeInfo?: Map<string, SingularStakingInfo>;
  setStakeInfo: (stakeInfo: Map<string, SingularStakingInfo>) => void;
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

  return (
    <>
      <DappStakingContext.Provider value={{ stakeInfo, setStakeInfo }}>
        {children}
      </DappStakingContext.Provider>
    </>
  );
}
