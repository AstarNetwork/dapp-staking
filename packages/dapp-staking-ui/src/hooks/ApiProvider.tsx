"use client";

import { createContext, useState } from "react";
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
};

export const ApiContext = createContext<Api | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<ApiPromise>();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [chainDecimals, setChainDecimals] = useState<number>(18);
  const [tokenSymbol, setTokenSymbol] = useState<string>("");

  return (
    <>
      <ApiContext.Provider
        value={{
          api,
          isInitialized,
          chainDecimals,
          tokenSymbol,
          setApi,
          setIsInitialized,
          setChainDecimals,
          setTokenSymbol,
        }}
      >
        {children}
      </ApiContext.Provider>
    </>
  );
}
