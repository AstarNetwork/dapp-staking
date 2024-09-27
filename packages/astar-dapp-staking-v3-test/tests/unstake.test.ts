import { expect } from "vitest";
import { given } from "../helpers";
import {
  canUnstake,
  getUnstakeCall,
  initApi,
} from "@astar-network/dapp-staking-v3";
import {
  ALREADY_STAKED_CONTRACT,
  protocolStateMock,
  stakeInfoMock,
  TEST_CONTRACT_1,
  TEST_USER_ADDRESS,
} from "./constants";
import type {
  ExtrinsicPayload,
  ProtocolState,
} from "@astar-network/dapp-staking-v3/types";
import { getDappAddressEnum } from "@astar-network/dapp-staking-v3/utils";

given("astar")(
  "getUnstakeCall returns correct call",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const unstakeBatch = await getUnstakeCall(
      TEST_USER_ADDRESS,
      ALREADY_STAKED_CONTRACT,
      10_000_000_000_000_000_000n
    );

    // TODO make claim rewards to be part of the batch
    const calls = unstakeBatch.method.args[0] as unknown as ExtrinsicPayload[];
    expect(calls.length).toBe(2);
    expect(calls[0].method).toBe("unstake");
    expect(calls[0].args[0].toString()).toBe(
      JSON.stringify(getDappAddressEnum(ALREADY_STAKED_CONTRACT)).toLowerCase()
    );
    expect(calls[0].args[1].toString()).toBe("10000000000000000000");
    expect(calls[1].method).toBe("unlock");
    expect(calls[1].args[0].toString()).toBe("10000000000000000000");
  }
);

given("astar")(
  "getUnstakeCall fails if no staking info",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    await expect(
      getUnstakeCall(
        TEST_USER_ADDRESS,
        TEST_CONTRACT_1,
        10_000_000_000_000_000_000n
      )
    ).rejects.toThrow(
      "Staker account has no staking information for the contract."
    );
  }
);

given("astar")(
  "getUnstakeCall fails if 0 amount",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    await expect(
      getUnstakeCall(TEST_USER_ADDRESS, ALREADY_STAKED_CONTRACT, 0n)
    ).rejects.toThrow("Amount must be greater than 0.");
  }
);

given("astar")(
  "getUnstakeCall fails if unstake amount is greater than total staked amount",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    await expect(
      getUnstakeCall(
        TEST_USER_ADDRESS,
        ALREADY_STAKED_CONTRACT,
        1_000_000_000_000_000_000_000n
      )
    ).rejects.toThrow("Unstake amount is greater than the staked amount.");
  }
);

given("astar")(
  "canUnstake fails if maintenance mode is enabled",
  async ({ networks: { astar } }) => {
    initApi(astar.api);

    const updatedProtocolStateMock: ProtocolState = {
      ...protocolStateMock,
      maintenance: true,
    };

    const result = await canUnstake(
      TEST_USER_ADDRESS,
      ALREADY_STAKED_CONTRACT,
      1n,
      () => Promise.resolve(updatedProtocolStateMock)
    );
    expect(result).toEqual([
      false,
      "dApp staking pallet is in maintenance mode.",
    ]);
  }
);

given("astar")(
  "canUnstake warns about unstaking all tokens",
  async ({ networks: { astar } }) => {
    initApi(astar.api);

    const result = await canUnstake(
      TEST_USER_ADDRESS,
      ALREADY_STAKED_CONTRACT,
      100_000_000_000_000_000_000n
    );
    expect(result).toEqual([
      true,
      "The operation will unstake all of your staked tokens because the minimum staking amount is 500000000000000000000 tokens.",
    ]);
  }
);

given("astar")(
  "canUnstake fails for different staking and current period",
  async ({ networks: { astar } }) => {
    initApi(astar.api);

    const updatedStakeInfoMock = stakeInfoMock;
    updatedStakeInfoMock.set(ALREADY_STAKED_CONTRACT, {
      staked: {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        ...updatedStakeInfoMock.get(ALREADY_STAKED_CONTRACT)!.staked,
        period: 2,
      },
      loyalStaker: false,
    });

    const result = await canUnstake(
      TEST_USER_ADDRESS,
      ALREADY_STAKED_CONTRACT,
      10_000_000_000_000_000_000n,
      () => Promise.resolve(protocolStateMock),
      () => Promise.resolve(updatedStakeInfoMock)
    );
    expect(result).toEqual([
      false,
      "Unstaking is rejected since the period in which past stake was active has passed.",
    ]);
  }
);
