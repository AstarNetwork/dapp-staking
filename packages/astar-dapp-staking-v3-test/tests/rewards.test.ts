import {
  getBonusRewards,
  getClaimBonusRewardsCalls,
  getClaimStakerRewardsCall,
  getStakerRewards,
  initApi,
} from "@astar-network/dapp-staking-v3";
import { given } from "../helpers";
import { expect } from "vitest";
import { TEST_USER_ADDRESS } from "./constants";

// TODO update this test with proper use case
given("astar")(
  "getStakerRewards returns correct values",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const rewards = await getStakerRewards(TEST_USER_ADDRESS);
    expect(rewards).toMatchInlineSnapshot(`
      {
        "amount": 0n,
        "eraCount": 0,
        "period": 2,
      }
    `);
  }
);

// TODO update this test with proper use case
given("astar")(
  "getClaimStakerRewardsCall returns correct number of calls",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const rewards = await getClaimStakerRewardsCall(TEST_USER_ADDRESS);
    expect(rewards.length).toBe(0);
  }
);

// TODO update this test with proper use case
given("astar")(
  "getBonusRewards returns correct reward",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const rewards = await getBonusRewards(TEST_USER_ADDRESS);
    expect(rewards).toBe(0n);
  }
);

// TODO update this test with proper use case
given("astar")(
  "getClaimBonusRewardsCalls returns correct number of calls",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const rewards = await getClaimBonusRewardsCalls(TEST_USER_ADDRESS);
    expect(rewards.length).toBe(0);
  }
);
