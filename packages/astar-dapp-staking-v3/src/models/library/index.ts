import type { SubmittableExtrinsic } from "@polkadot/api/types";

type PeriodNumber = number;
type EraNumber = number;
type BlockNumber = number;

export type ExtrinsicPayload = SubmittableExtrinsic<"promise">;

export type ApiSupportedNetwork = "astar" | "shiden" | "shibuya";

/** dApp staking protocol subperiods */
export enum Subperiod {
  /** Voting subperiod. No rewards earned in this period */
  Voting = "Voting",
  /** Build and earn subperiod. Rewards can be earned in this period */
  BuildAndEarn = "BuildAndEarn",
}

/** Ongoing period info */
export interface PeriodInfo {
  /** Period number */
  number: PeriodNumber;
  /** Subperiod type (BuildAndEarn or Voting) */
  subperiod: Subperiod;
  /** Era in which the next subperiod should start */
  nextSubperiodStartEra: EraNumber;
}

/**
 * Era information.
 */
export interface EraInfo {
  /**
   * Tokens locked in the dApp staking.
   */
  readonly totalLocked: bigint;
  /**
   * Tokens that are unlocking. Counts in totalLocked.
   */
  readonly unlocking: bigint;
  /**
   *  Stake amount valid for ongoing era.
   */
  readonly currentStakeAmount: StakeAmount;
  /**
   * Stake amount valid from the next era.
   */
  readonly nextStakeAmount?: StakeAmount;
}

/** General information & state of the dApp staking protocol. */
export interface ProtocolState {
  /** Ongoing era number. */
  era: EraNumber;
  /** Block number at which the next era should start. */
  nextEraStart: BlockNumber;
  /** Ongoing period type and when is it expected to end. */
  periodInfo: PeriodInfo;
  /** `true` if pallet is in maintenance mode (disabled), `false` otherwise. */
  maintenance: boolean;
}

export interface StakeAmount {
  readonly voting: bigint;
  readonly buildAndEarn: bigint;
  readonly era: number;
  readonly period: number;
  readonly totalStake: bigint;
}

/** Staking info */
export interface SingularStakingInfo {
  /** Staked amount */
  readonly staked: StakeAmount;
  /** Indicated whether a staker is loyal staker (Staked in Voting subperiod and didn't unstake until the end of the period) */
  readonly loyalStaker: boolean;
}

/**
 * Account ledger.
 */
export interface AccountLedger {
  /**
   * Total tokens locked in dApp staking. Locked tokens can be used for staking
   */
  readonly locked: bigint;
  /**
   * Vector of all the unlocking chunks. This is also considered locked but cannot be used for staking.
   */
  readonly unlocking: UnlockingChunk[];
  /**
   * Stake information for a particular era.
   */
  readonly staked: StakeAmount;
  /**
   * Stake information for the next era.
   * This is needed since stake amount is only applicable from the next era after it's been staked.
   */
  readonly stakedFuture?: StakeAmount;
  /**
   * Number of contracts staked by the account.
   */
  readonly contractStakeCount: number;
}

/**
 * Tokens to be unlocked in some block.
 */
export interface UnlockingChunk {
  /**
   * Amount to be unlocked.
   */
  readonly amount: bigint;
  /**
   * Block in which the unlocking period is finished for this chunk.
   */
  readonly unlockBlock: bigint;
}

/**
 * dApp staking constants.
 */
export interface Constants {
  /**
   * Maximum length of the single era reward span entry.
   */
  eraRewardSpanLength: number;
  /**
   * Number of periods for which the rewards are kept for claiming.
   */
  rewardRetentionInPeriods: number;
  /**
   * Minimum amount of tokens that can be staked on a contract.
   */
  minStakeAmount: bigint;
  /**
   * Minimum transferable balance after staking (10 tokens). Intended to prevent all account funds from being locked by staking operation.
   */
  minBalanceAfterStaking: bigint;
  /**
   * Maximum number of staked contracts per staker account.
   */
  maxNumberOfStakedContracts: number;
  /**
   * Maximum number of contracts in dApp staking.
   */
  maxNumberOfContracts: number;
  /**
   * Maximum number of unlocking chunks per account.
   */
  maxUnlockingChunks: number;
  /**
   * Number of standard eras to pass before unlocking chunk can be claimed.
   */
  unlockingPeriod: number;
}

export interface PeriodEndInfo {
  readonly bonusRewardPool: bigint;
  readonly totalVpStake: bigint;
  readonly finalEra: number;
}

/**
 * Staker rewards.
 */
export interface StakerRewards {
  /**
   * Rewards amount.
   */
  amount: bigint;
  /**
   * dApp staking period when rewards were earned.
   */
  period: number;
  /**
   * Number of eras for which rewards can be claimed.
   */
  eraCount: number;
}

export interface EraReward {
  readonly stakerRewardPool: bigint;
  readonly staked: bigint;
  readonly dappRewardPool: bigint;
}

export interface EraRewardSpan {
  readonly span: EraReward[];
  readonly firstEra: number;
  readonly lastEra: number;
}

export type BonusRewards = {
  amount: bigint;
  contractsToClaim: Map<string, bigint>;
};

/** Stake call parameter */
export interface StakeInfo {
  /** Contract address */
  address: string;
  /** Amount to stake */
  amount: bigint;
}

export interface AccountInfo {
  readonly nonce: number;
  readonly consumers: number;
  readonly providers: number;
  readonly sufficients: number;
  readonly data: AccountData;
}

export interface AccountData {
  readonly free: bigint;
  readonly reserved: bigint;
  readonly frozen: bigint;
  readonly flags: bigint;
}

/**
 * Inflation pallet configuration
 * For details check https://github.com/AstarNetwork/Astar/blob/82b60ce04574c6546fa81220e94359bc76f09317/pallets/inflation/src/lib.rs#L473
 */
export interface InflationConfiguration {
  issuanceSafetyCap: bigint;
  collatorRewardPerBlock: bigint;
  treasuryRewardPerBlock: bigint;
  dappRewardPoolPerEra: bigint;
  baseStakerRewardPoolPerEra: bigint;
  adjustableStakerRewardPoolPerEra: bigint;
  bonusRewardPoolPerPeriod: bigint;
  idealStakingRate: number;
  recalculationEra: number;
}

/**
 * Inflation parameters
 * For details check https://github.com/AstarNetwork/Astar/blob/82b60ce04574c6546fa81220e94359bc76f09317/pallets/inflation/src/lib.rs#L548
 */
export interface InflationParam {
  readonly maxInflationRate: number;
  readonly treasuryPart: number;
  readonly collatorsPart: number;
  readonly dappsPart: number;
  readonly baseStakersPart: number;
  readonly adjustableStakersPart: number;
  readonly bonusPart: number;
  readonly idealStakingRate: number;
}

/**
 * Era lengths.
 */
export interface EraLengths {
  /** Build and earn subperiod length in standard eras */
  standardErasPerBuildAndEarnPeriod: number;
  /** Voting subperiod length in standard eras */
  standardErasPerVotingPeriod: number;
  /** Standard era length in blocks */
  standardEraLength: number;
  /** Number of dApp staking periods in an inflation cycle */
  periodsPerCycle: number;
}

export interface Dapp {
  address: string;
  name: string;
  description: string;
  iconUrl: string;
  mainCategory?: string;
  creationTime: number;
  shortDescription: string;
  url: string;
  imagesUrl: string[];
}
