import {
  type SetupOption,
  setupContext,
} from "@acala-network/chopsticks-testing";
import { config as dotenvConfig } from "dotenv";

import { testingPairs } from "../helpers";

import type { Config, Context, NetworkKind } from "./types";
import networkDefs from "./all";

dotenvConfig();

const toNumber = (value: string | undefined): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return Number(value);
};

export type Network = Awaited<ReturnType<typeof setupContext>> & {
  options: SetupOption;
  config: (typeof networkDefs)[keyof typeof networkDefs][NetworkKind];
};
export type NetworkNames =
  (typeof networkDefs)[keyof typeof networkDefs][NetworkKind]["name"];

export const networkCreator = {} as Record<
  NetworkNames,
  (options?: Partial<SetupOption>) => (ctx: Context) => Promise<Network>
>;

const relaychains = ["polkadot", "kusama"] as const;

for (const def of Object.values(networkDefs)) {
  for (const relaychain of relaychains) {
    const config = def[relaychain];
    const { endpoint, name } = config;
    const upperName = name.toUpperCase();
    networkCreator[name] =
      (options?: Partial<SetupOption>) => async (ctx: Context) => {
        const setupConfig = (def as Config).config({
          network: relaychain,
          ...config,
          ...ctx,
        });

        const finalOptions: SetupOption = {
          timeout: 600000,
          wasmOverride: process.env[`${upperName}_WASM`],
          blockNumber: toNumber(process.env[`${upperName}_BLOCK_NUMBER`]),
          endpoint: process.env[`${upperName}_ENDPOINT`] ?? endpoint,
          //db: process.env.DB_PATH, commented for now because it causes issues with the tests
          ...setupConfig.options,
          ...options,
        };

        const network = await setupContext(finalOptions);

        if (setupConfig.storages) {
          await network.dev.setStorage(setupConfig.storages);
        }

        return {
          ...network,
          config,
          options: finalOptions,
        };
      };
  }
}

export const createContext = (keyringType: "ed25519" | "sr25519" = "ed25519") =>
  testingPairs(keyringType);

export const createNetworks = async (
  networkOptions: Partial<
    Record<NetworkNames, Partial<SetupOption> | undefined>
  >,
  context = createContext()
) => {
  const ret = {} as Record<NetworkNames, Network>;

  for (const [name, options] of Object.entries(networkOptions) as [
    NetworkNames,
    Partial<SetupOption> | undefined
  ][]) {
    ret[name] = await networkCreator[name](options)(context);
  }

  return ret;
};
