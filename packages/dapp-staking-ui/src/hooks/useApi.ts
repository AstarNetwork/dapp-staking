import { ApiPromise, WsProvider } from "@polkadot/api";
import { initApi } from "@astar-network/dapp-staking-v3";
import { useContext } from "react";
import { ApiContext } from "./ApiProvider";
import { RPC_ENDPOINT } from "@/configuration/constants";

let isInitialized = false;

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApi must be used within a ApiProvider");
  }

  const init = async () => {
    console.log("Initializing Dapp Staking API");
    const provider = new WsProvider(RPC_ENDPOINT);
    const api = await ApiPromise.create({ provider });

    initApi(api);
    context?.setApi(api);
  };

  if (!isInitialized) {
    init();
    isInitialized = true;
  }

  return context;
};
