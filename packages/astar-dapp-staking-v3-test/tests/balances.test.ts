import { initApi } from "@astar-network/dapp-staking-v3";
import { getTotalIssuance } from "@astar-network/dapp-staking-v3/build/logic/balances";
import { given } from "../helpers";
import { expect } from "vitest";

given("astar")(
  "getTotalIssuance is correct",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const issuance = await getTotalIssuance();
    expect(issuance).toBe(8215337106808732243983056680n);
  }
);
