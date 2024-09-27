import type { SubmittableExtrinsic } from "@polkadot/api/types";

type PeriodNumber = number;
type EraNumber = number;
type BlockNumber = number;

export type ExtrinsicPayload = SubmittableExtrinsic<"promise">;

export enum PeriodType {
  Voting = "Voting",
  BuildAndEarn = "BuildAndEarn",
}

interface PeriodInfo {
  number: PeriodNumber;
  subperiod: PeriodType;
  nextSubperiodStartEra: EraNumber;
}

// General information & state of the dApp staking protocol.
export interface ProtocolState {
  // Ongoing era number.
  era: EraNumber;
  // Block number at which the next era should start.
  nextEraStart: BlockNumber;
  // Ongoing period type and when is it expected to end.
  periodInfo: PeriodInfo;
  // `true` if pallet is in maintenance mode (disabled), `false` otherwise.
  maintenance: boolean;
}

export interface StakeAmount {
  readonly voting: bigint;
  readonly buildAndEarn: bigint;
  readonly era: number;
  readonly period: number;
  readonly totalStake: bigint;
}

export interface SingularStakingInfo {
  readonly staked: StakeAmount;
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

export interface Constants {
  eraRewardSpanLength: number;
  rewardRetentionInPeriods: number;
  minStakeAmount: bigint;
  minStakeAmountToken?: number; // TODO set value
  minBalanceAfterStaking: bigint;
  maxNumberOfStakedContracts: number;
  maxNumberOfContracts: number;
  maxUnlockingChunks: number;
  unlockingPeriod: number;
}

export interface PeriodEndInfo {
  readonly bonusRewardPool: bigint;
  readonly totalVpStake: bigint;
  readonly finalEra: number;
}

export interface StakerRewards {
  amount: bigint;
  period: number;
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

export interface StakeInfo {
  address: string;
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

export interface EraLengths {
  standardErasPerBuildAndEarnPeriod: number;
  standardErasPerVotingPeriod: number;
  standardEraLength: number;
  periodsPerCycle: number;
}
