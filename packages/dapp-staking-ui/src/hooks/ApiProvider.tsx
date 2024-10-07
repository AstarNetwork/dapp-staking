"use client";

import { createContext, useEffect, useState } from "react";
import type { u32 } from "@polkadot/types";
import type { ApiPromise } from "@polkadot/api";

type Api = {
  api?: ApiPromise;
  setApi: (api: ApiPromise) => void;
  isInitialized: boolean;
  setIsInitialized: (isInitialized: boolean) => void;
  chainDecimals: number;
  setChainDecimals: (chainDecimals: number) => void;
  tokenSymbol: string;
  setTokenSymbol: (tokenSymbol: string) => void;
  currentBlock?: bigint;
  setCurrentBlock?: (currentBlock: bigint) => void;
};

export const ApiContext = createContext<Api | undefined>(undefined);
let unsubscribe: () => void;

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<ApiPromise>();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [chainDecimals, setChainDecimals] = useState<number>(18);
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [currentBlock, setCurrentBlock] = useState<bigint>();

  useEffect(() => {
    if (api) {
      unsubscribe?.();
      unsubscribe = api.query.system.number((blockNumber: u32) => {
        setCurrentBlock(blockNumber.toBigInt());
      }) as unknown as () => void;
    }
  }, [api]);

  return (
    <>
      <ApiContext.Provider
        value={{
          api,
          isInitialized,
          chainDecimals,
          tokenSymbol,
          currentBlock,
          setApi,
          setIsInitialized,
          setChainDecimals,
          setTokenSymbol,
          setCurrentBlock,
        }}
      >
        {children}
      </ApiContext.Provider>
    </>
  );
}
