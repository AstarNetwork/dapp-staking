import { expect } from "vitest";
import { given } from "../helpers";
import {
  getAccountLedger,
  getConstants,
  getCurrentEraInfo,
  getProtocolState,
  initApi,
} from "@astar-network/dapp-staking-v3";
import { TEST_USER_ADDRESS } from "./constants";
import { getEraLengths } from "@astar-network/dapp-staking-v3";

given("astar")(
  "getProtocolState returns correct values",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const protocolState = await getProtocolState();
    expect(protocolState).toMatchInlineSnapshot(`
      {
        "era": 846,
        "maintenance": false,
        "nextEraStart": 7070134,
        "periodInfo": {
          "nextSubperiodStartEra": 875,
          "number": 2,
          "subperiod": "BuildAndEarn",
        },
      }
    `);
  }
);

given("astar")(
  "getCurrentEraInfo returns correct values",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const eraInfo = await getCurrentEraInfo();
    expect(eraInfo).toMatchInlineSnapshot(`
      {
        "currentStakeAmount": {
          "buildAndEarn": 744820898631753695841302225n,
          "era": 846,
          "period": 2,
          "totalStake": 1876836768853030841279983116n,
          "voting": 1132015870221277145438680891n,
        },
        "nextStakeAmount": {
          "buildAndEarn": 744972945964017816220153935n,
          "era": 847,
          "period": 2,
          "totalStake": 1876988816185294961658834826n,
          "voting": 1132015870221277145438680891n,
        },
        "totalLocked": 2754652793647772292403673864n,
        "unlocking": 126744938819586733468547403n,
      }
    `);
  }
);

given("astar")(
  "getAccountLedger returns correct values",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const ledger = await getAccountLedger(TEST_USER_ADDRESS);
    expect(ledger).toMatchInlineSnapshot(`
      {
        "contractStakeCount": 1,
        "locked": 550000000000000000000n,
        "staked": {
          "buildAndEarn": 0n,
          "era": 0,
          "period": 0,
          "totalStake": 0n,
          "voting": 0n,
        },
        "stakedFuture": {
          "buildAndEarn": 550000000000000000000n,
          "era": 847,
          "period": 2,
          "totalStake": 550000000000000000000n,
          "voting": 0n,
        },
        "unlocking": [
          {
            "amount": 50000000000000000000n,
            "unlockBlock": 7129793n,
          },
        ],
      }
    `);
  }
);

given("astar")(
  "getConstants returns correct values",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const constants = await getConstants();
    expect(constants).toMatchInlineSnapshot(`
      {
        "eraRewardSpanLength": 16,
        "maxNumberOfContracts": 500,
        "maxNumberOfStakedContracts": 16,
        "maxUnlockingChunks": 8,
        "minBalanceAfterStaking": 10000000000000000000n,
        "minStakeAmount": 500000000000000000000n,
        "rewardRetentionInPeriods": 4,
        "unlockingPeriod": 9,
      }
    `);
  }
);

given("astar")(
  "getEraLengths returns correct values - Astar",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const eraLengths = await getEraLengths();
    expect(eraLengths).toMatchInlineSnapshot(`
      {
        "periodsPerCycle": 3,
        "standardEraLength": 7200,
        "standardErasPerBuildAndEarnPeriod": 111,
        "standardErasPerVotingPeriod": 11,
      }
    `);
  }
);

given("shiden")(
  "getEraLengths returns correct values - Shiden",
  async ({ networks: { shiden } }) => {
    initApi(shiden.api);
    const eraLengths = await getEraLengths();
    expect(eraLengths).toMatchInlineSnapshot(`
      {
        "periodsPerCycle": 6,
        "standardEraLength": 7200,
        "standardErasPerBuildAndEarnPeriod": 55,
        "standardErasPerVotingPeriod": 6,
      }
    `);
  }
);

given("astar")(
  "getEraLengths returns correct values for past blocks",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const currentBlock = Number(process.env.ASTAR_BLOCK_NUMBER);
    const eraLengths = await getEraLengths(currentBlock - 100);
    expect(eraLengths).toMatchInlineSnapshot(`
      {
        "periodsPerCycle": 3,
        "standardEraLength": 7200,
        "standardErasPerBuildAndEarnPeriod": 111,
        "standardErasPerVotingPeriod": 11,
      }
    `);
  }
);
