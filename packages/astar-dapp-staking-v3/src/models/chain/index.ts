import type {
  Compact,
  Struct,
  bool,
  u16,
  u32,
  Enum,
  u128,
  Vec,
  Option,
} from "@polkadot/types";
import type { AccountId32, Perquintill } from "@polkadot/types/interfaces";
import type { Codec } from "@polkadot/types/types";

interface PalletDappStakingV3PeriodType extends Enum {
  readonly isVoting: boolean;
  readonly isBuildAndEarn: boolean;
  readonly type: "Voting" | "BuildAndEarn";
}

interface PalletDappStakingV3PeriodInfo extends Struct {
  readonly number: Compact<u32>;
  readonly subperiod: PalletDappStakingV3PeriodType;
  readonly nextSubperiodStartEra: Compact<u32>;
}

interface StakeAmount {
  readonly voting: bigint;
  readonly buildAndEarn: bigint;
  readonly era: number;
  readonly period: number;
  readonly totalStake: bigint;
}

export interface PalletDappStakingV3StakeAmount extends Struct {
  readonly voting: Compact<u128>;
  readonly buildAndEarn: Compact<u128>;
  readonly era: Compact<u32>;
  readonly period: Compact<u32>;
}

export interface PalletDappStakingV3ProtocolState extends Struct {
  readonly era: Compact<u32>;
  readonly nextEraStart: Compact<u32>;
  readonly periodInfo: PalletDappStakingV3PeriodInfo;
  readonly maintenance: bool;
}

export interface EraInfo {
  readonly totalLocked: bigint;
  readonly unlocking: bigint;
  readonly currentStakeAmount: StakeAmount;
  readonly nextStakeAmount?: StakeAmount;
}

export interface PalletDappStakingV3EraInfo extends Struct {
  readonly totalLocked: Compact<u128>;
  readonly unlocking: Compact<u128>;
  readonly currentStakeAmount: PalletDappStakingV3StakeAmount;
  readonly nextStakeAmount: PalletDappStakingV3StakeAmount;
}

export interface PalletDappStakingV3SingularStakingInfo extends Struct {
  readonly staked: PalletDappStakingV3StakeAmount;
  readonly loyalStaker: bool;
}

export interface SmartContractAddress extends Struct {
  isEvm: boolean;
  asEvm?: Codec;
  isWasm: boolean;
  asWasm?: Codec;
}

export interface PalletDappStakingV3AccountLedger extends Struct {
  readonly locked: Compact<u128>;
  readonly unlocking: Vec<PalletDappStakingV3UnlockingChunk>;
  readonly staked: PalletDappStakingV3StakeAmount;
  readonly stakedFuture: Option<PalletDappStakingV3StakeAmount>;
  readonly contractStakeCount: Compact<u32>;
}

interface PalletDappStakingV3UnlockingChunk extends Struct {
  readonly amount: Compact<u128>;
  readonly unlockBlock: Compact<u32>;
}

export interface PalletDappStakingV3PeriodEndInfo extends Struct {
  readonly bonusRewardPool: Compact<u128>;
  readonly totalVpStake: Compact<u128>;
  readonly finalEra: Compact<u32>;
}

export interface PalletDappStakingV3EraRewardSpan extends Struct {
  readonly span: Vec<PalletDappStakingV3EraReward>;
  readonly firstEra: Compact<u32>;
  readonly lastEra: Compact<u32>;
}

interface PalletDappStakingV3EraReward extends Struct {
  readonly stakerRewardPool: Compact<u128>;
  readonly staked: Compact<u128>;
  readonly dappRewardPool: Compact<u128>;
}

export interface PalletDappStakingV3DAppInfo extends Struct {
  readonly owner: AccountId32;
  readonly id: Compact<u16>;
  readonly rewardBeneficiary: Option<AccountId32>;
}

export interface FrameSystemAccountInfo extends Struct {
  readonly nonce: u32;
  readonly consumers: u32;
  readonly providers: u32;
  readonly sufficients: u32;
  readonly data: PalletBalancesAccountData;
}

export interface PalletBalancesAccountData extends Struct {
  readonly free: u128;
  readonly reserved: u128;
  readonly frozen: u128;
  readonly flags: u128;
}

export interface PalletInflationActiveInflationConfig extends Struct {
  readonly issuanceSafetyCap: Compact<u128>;
  readonly collatorRewardPerBlock: Compact<u128>;
  readonly treasuryRewardPerBlock: Compact<u128>;
  readonly dappRewardPoolPerEra: Compact<u128>;
  readonly baseStakerRewardPoolPerEra: Compact<u128>;
  readonly adjustableStakerRewardPoolPerEra: Compact<u128>;
  readonly bonusRewardPoolPerPeriod: Compact<u128>;
  readonly idealStakingRate: Perquintill;
  readonly recalculationEra: Compact<u32>;
}

export interface PalletInflationInflationParameters extends Struct {
  readonly maxInflationRate: Compact<Perquintill>;
  readonly treasuryPart: Compact<Perquintill>;
  readonly collatorsPart: Compact<Perquintill>;
  readonly dappsPart: Compact<Perquintill>;
  readonly baseStakersPart: Compact<Perquintill>;
  readonly adjustableStakersPart: Compact<Perquintill>;
  readonly bonusPart: Compact<Perquintill>;
  readonly idealStakingRate: Compact<Perquintill>;
}
