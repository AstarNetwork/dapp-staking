import { PeriodType } from "@astar-network/dapp-staking-v3/types";
import type {
  ProtocolState,
  SingularStakingInfo,
} from "@astar-network/dapp-staking-v3/types";

export const TEST_USER_ADDRESS =
  "aFjKNG8xRmYZDzGTAAMoSnyqJR3ncDChGyPqBaZuPBFwBMK";

export const TEST_CONTRACT_1 = "0xd59fc6bfd9732ab19b03664a45dc29b8421bda9a";
export const TEST_CONTRACT_2 =
  "bYLgJmSkWd4S4pTEacF2sNBWFeM4bNerS27FgNVcC9SqRE4";
export const ALREADY_STAKED_CONTRACT =
  "0xa602d021da61ec4cc44dedbd4e3090a05c97a435";
export const NON_STAKED_CONTRACT = "0x70d264472327b67898c919809a9dc4759b6c0f27";
export const NON_REGISTERED_CONTRACT =
  "0x70d264472327b67898c919809a9dc4759b6c0f28";

export const protocolStateMock: ProtocolState = {
  era: 0,
  maintenance: false,
  nextEraStart: 0,
  periodInfo: {
    nextSubperiodStartEra: 0,
    number: 1,
    subperiod: PeriodType.BuildAndEarn,
  },
};

export const stakeInfoMock: Map<string, SingularStakingInfo> = new Map([
  [
    ALREADY_STAKED_CONTRACT,
    {
      staked: {
        totalStake: 550_000_000_000_000_000_000n,
        period: 1,
        voting: 0n,
        buildAndEarn: 550_000_000_000_000_000_000n,
        era: 100,
      },
      loyalStaker: false,
    },
  ],
]);
