"use client";

import { createContext, useState } from "react";
import type { ApiPromise } from "@polkadot/api";

type Api = {
  api?: ApiPromise;
  setApi: (api: ApiPromise) => void;
};

export const ApiContext = createContext<Api | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<ApiPromise>();

  return (
    <>
      <ApiContext.Provider
        value={{
          api,
          setApi,
        }}
      >
        {children}
      </ApiContext.Provider>
    </>
  );
}
