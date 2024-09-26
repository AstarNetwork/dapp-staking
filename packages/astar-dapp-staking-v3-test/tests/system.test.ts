import { expect } from "vitest";
import { initApi, getBalance } from "@astar-network/dapp-staking-v3";
import { given } from "../helpers";
import { TEST_USER_ADDRESS } from "./constants";
import { getBlockTimeInSeconds } from "@astar-network/dapp-staking-v3";

given("astar")(
  "getBalance returns correct values",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const balance = await getBalance(TEST_USER_ADDRESS);
    expect(balance).toMatchInlineSnapshot(`
      {
        "consumers": 1,
        "data": {
          "flags": 170141183460469231731687303715884105728n,
          "free": 635115152845567388025n,
          "frozen": 600000000000000000000n,
          "reserved": 0n,
        },
        "nonce": 12,
        "providers": 1,
        "sufficients": 0,
      }
    `);
  }
);

given("astar")(
  "getBlockTimeInSeconds returns correct values",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const balance = await getBlockTimeInSeconds();
    expect(balance).toBe(12);
  }
);
