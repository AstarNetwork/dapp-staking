import type { EraLengths } from "./models/library";

export const ORIGINAL_BLOCK_TIME = 12;
export const CHAIN_DECIMALS = 18;

// https://docs.astar.network/docs/learn/interoperability/xcm/integration/multilocation/#astar
export const EXISTENTIAL_DEPOSIT = 1_000_000n;

export const ERA_LENGTHS = new Map<string, EraLengths>([
  [
    "Shibuya Testnet",
    {
      standardErasPerBuildAndEarnPeriod: 20,
      standardErasPerVotingPeriod: 8,
      standardEraLength: 1800,
      periodsPerCycle: 2,
    },
  ],
  [
    "Shiden",
    {
      standardErasPerBuildAndEarnPeriod: 55,
      standardErasPerVotingPeriod: 6,
      standardEraLength: 7200,
      periodsPerCycle: 6,
    },
  ],
  [
    "Astar",
    {
      standardErasPerBuildAndEarnPeriod: 111,
      standardErasPerVotingPeriod: 11,
      standardEraLength: 7200,
      periodsPerCycle: 3,
    },
  ],
]);
