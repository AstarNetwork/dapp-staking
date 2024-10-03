import { expect, afterEach, vi } from "vitest";
import {
  getConstants,
  getStakeCall,
  initApi,
  canStake,
} from "@astar-network/dapp-staking-v3";
import {
  Subperiod,
  type AccountLedger,
  type ProtocolState,
  type ExtrinsicPayload,
  type StakeInfo,
} from "@astar-network/dapp-staking-v3/types";
import { given } from "../helpers";
import {
  ALREADY_STAKED_CONTRACT,
  NON_REGISTERED_CONTRACT,
  NON_STAKED_CONTRACT,
  protocolStateMock,
  TEST_CONTRACT_1,
  TEST_CONTRACT_2,
  TEST_USER_ADDRESS,
} from "./constants";
import { weiToToken } from "@astar-network/dapp-staking-v3/utils";

const stakeInfo: StakeInfo[] = [
  {
    address: TEST_CONTRACT_1,
    amount: 1_500_000_000_000_000_000_000n,
  },
  {
    address: TEST_CONTRACT_2,
    amount: 500_000_000_000_000_000_000n,
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

given("astar")(
  "getStakeCall returns correct call",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const stakeBatch = await getStakeCall(
      TEST_USER_ADDRESS,
      10_000_000_000_000_000_000n,
      [
        {
          address: ALREADY_STAKED_CONTRACT,
          amount: 10_000_000_000_000_000_000n,
        },
      ]
    );

    const calls = stakeBatch.method.args[0] as unknown as ExtrinsicPayload[];
    expect(calls.length).toBe(2);
    expect(calls[0].method).toBe("lock");
    expect(calls[0].args[0].toString()).toBe("10000000000000000000");
    expect(calls[1].method).toBe("stake");
    expect(calls[1].args[0].toString()).toBe(
      `{"evm":"${ALREADY_STAKED_CONTRACT}"}`
    );
    expect(calls[1].args[1].toString()).toBe("10000000000000000000");
  }
);

given("astar")(
  "getStakeCall fails if stake info is not provided",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    await expect(getStakeCall(TEST_USER_ADDRESS, 1n, [])).rejects.toThrow(
      "No stake info provided."
    );
  }
);

given("astar")(
  "getStakeCall fails if stake info has invalid values",
  async ({ networks: { astar } }) => {
    initApi(astar.api);

    // Staker address is not provided
    await expect(
      getStakeCall("", 1n, [{ address: "", amount: 1n }])
    ).rejects.toThrow("Staker address is not provided or invalid.");

    // Staker address is invalid (H160 address is provided)
    await expect(
      getStakeCall(TEST_CONTRACT_1, 1n, [{ address: "", amount: 1n }])
    ).rejects.toThrow("Staker address is not provided or invalid.");

    // dApp address is not provided
    await expect(
      getStakeCall(TEST_USER_ADDRESS, 1n, [{ address: "", amount: 1n }])
    ).rejects.toThrow("dApp address is not provided or invalid");

    // dApp address is invalid
    await expect(
      getStakeCall(TEST_USER_ADDRESS, 1n, [{ address: "zzzzz", amount: 1n }])
    ).rejects.toThrow("dApp address is not provided or invalid zzzzz");

    // Stake amount is not provided
    await expect(
      getStakeCall(TEST_USER_ADDRESS, 1n, [
        { address: TEST_CONTRACT_1, amount: 0n },
      ])
    ).rejects.toThrow("Amount must be greater than 0.");

    // Stake amount is lower than the minimum
    const constants = await getConstants();
    await expect(
      getStakeCall(TEST_USER_ADDRESS, 100_000_000_000_000_000_000n, [
        { address: NON_STAKED_CONTRACT, amount: 100_000_000_000_000_000_000n },
      ])
    ).rejects.toThrow(
      `Minimum staking amount is ${weiToToken(
        constants.minStakeAmount
      )} tokens per dApp.`
    );

    // dApp is not registered for staking
    await expect(
      getStakeCall(TEST_USER_ADDRESS, 500_000_000_000_000_000_000n, [
        {
          address: NON_REGISTERED_CONTRACT,
          amount: 500_000_000_000_000_000_000n,
        },
      ])
    ).rejects.toThrow(
      `The dApp ${NON_REGISTERED_CONTRACT} is not registered for dApp staking.`
    );

    // Account must hold more than minBalanceAfterStaking tokens after staking
    await expect(
      getStakeCall(TEST_USER_ADDRESS, 30_000_000_000_000_000_000n, [
        {
          address: ALREADY_STAKED_CONTRACT,
          amount: 30_000_000_000_000_000_000n,
        },
      ])
    ).rejects.toThrow(
      `Account must hold more than ${weiToToken(
        constants.minBalanceAfterStaking
      )} transferable tokens after you stake.`
    );
  }
);

const ledgerMock: AccountLedger = {
  contractStakeCount: 0,
  locked: 0n,
  staked: {
    buildAndEarn: 0n,
    era: 0,
    period: 0,
    totalStake: 0n,
    voting: 0n,
  },
  stakedFuture: {
    buildAndEarn: 0n,
    era: 0,
    period: 0,
    totalStake: 0n,
    voting: 0n,
  },
  unlocking: [],
};

given("astar")(
  "canStake fails if too many staked contracts",
  async ({ networks: { astar } }) => {
    initApi(astar.api);

    const updatedLedgerMock: AccountLedger = {
      ...ledgerMock,
      contractStakeCount: 1000,
    };

    const result = await canStake(TEST_USER_ADDRESS, stakeInfo, (_: string) =>
      Promise.resolve(updatedLedgerMock)
    );
    expect(result).toEqual([
      false,
      "There are too many contract stake entries for the account.",
    ]);
  }
);

given("astar")(
  "canStake fails if maintenance mode is enabled",
  async ({ networks: { astar } }) => {
    initApi(astar.api);

    const updatedProtocolStateMock: ProtocolState = {
      ...protocolStateMock,
      maintenance: true,
    };

    const result = await canStake(TEST_USER_ADDRESS, stakeInfo, undefined, () =>
      Promise.resolve(updatedProtocolStateMock)
    );
    expect(result).toEqual([
      false,
      "dApp staking pallet is in maintenance mode.",
    ]);
  }
);

given("astar")(
  "canStake fails if last period era",
  async ({ networks: { astar } }) => {
    initApi(astar.api);

    const updatedProtocolStateMock: ProtocolState = {
      ...protocolStateMock,
      era: 9,
      periodInfo: {
        ...protocolStateMock.periodInfo,
        nextSubperiodStartEra: 10,
      },
    };

    const result = await canStake(TEST_USER_ADDRESS, stakeInfo, undefined, () =>
      Promise.resolve(updatedProtocolStateMock)
    );
    expect(result).toEqual([
      false,
      "Period ends in the next era. It is not possible to stake in the last era of a period.",
    ]);
  }
);
