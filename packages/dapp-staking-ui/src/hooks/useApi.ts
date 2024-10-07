import { ApiPromise, WsProvider } from "@polkadot/api";
import { initApi } from "@astar-network/dapp-staking-v3";
import { useContext } from "react";
import { ApiContext } from "./ApiProvider";
import { RPC_ENDPOINT } from "@/configuration/constants";

let isApiInitialized = false;

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApi must be used within a ApiProvider");
  }

  const init = async () => {
    console.log("Initializing Dapp Staking API");
    isApiInitialized = true;
    const provider = new WsProvider(RPC_ENDPOINT);
    const api = await ApiPromise.create({ provider });

    initApi(api);
    context?.setApi(api);
    context.setIsInitialized(true);

    context.setChainDecimals(api.registry.chainDecimals[0]);
    context.setTokenSymbol(api.registry.chainTokens[0]);
  };

  if (!isApiInitialized) {
    init();
  }

  return context;
};
