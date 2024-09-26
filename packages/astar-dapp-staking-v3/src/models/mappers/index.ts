import type { Option, StorageKey, Compact } from "@polkadot/types";
import type { AnyTuple, Codec } from "@polkadot/types/types";
import type { Perquintill } from "@polkadot/types/interfaces";
import type {
  EraInfo,
  FrameSystemAccountInfo,
  PalletDappStakingV3AccountLedger,
  PalletDappStakingV3EraInfo,
  PalletDappStakingV3EraRewardSpan,
  PalletDappStakingV3PeriodEndInfo,
  PalletDappStakingV3ProtocolState,
  PalletDappStakingV3SingularStakingInfo,
  PalletDappStakingV3StakeAmount,
  PalletInflationActiveInflationConfig,
  PalletInflationInflationParameters,
  SmartContractAddress,
} from "../chain";
import type {
  AccountInfo,
  AccountLedger,
  EraRewardSpan,
  InflationConfiguration,
  InflationParam,
  PeriodEndInfo,
  PeriodType,
  ProtocolState,
  SingularStakingInfo,
  StakeAmount,
} from "../library";
import { getContractAddress } from "../../utils";

export function mapToProtocolStateModel(
  state: PalletDappStakingV3ProtocolState
): ProtocolState {
  return {
    era: state.era.toNumber(),
    nextEraStart: state.nextEraStart.toNumber(),
    periodInfo: {
      number: state.periodInfo.number.toNumber(),
      subperiod: <PeriodType>state.periodInfo.subperiod.type,
      nextSubperiodStartEra: state.periodInfo.nextSubperiodStartEra.toNumber(),
    },
    maintenance: state.maintenance.isTrue,
  };
}

export function mapCurrentEraInfo(info: PalletDappStakingV3EraInfo): EraInfo {
  return {
    totalLocked: info.totalLocked.toBigInt(),
    unlocking: info.unlocking.toBigInt(),
    currentStakeAmount: mapStakeAmount(info.currentStakeAmount),
    nextStakeAmount: mapStakeAmount(info.nextStakeAmount),
  };
}

export function mapsStakerInfo(
  stakers: [StorageKey<AnyTuple>, Codec][],
  currentPeriod: number,
  includePreviousPeriods: boolean
): Map<string, SingularStakingInfo> {
  const result = new Map<string, SingularStakingInfo>();
  for (const [key, value] of stakers) {
    const v = <Option<PalletDappStakingV3SingularStakingInfo>>value;

    if (v.isSome) {
      const unwrappedValue = v.unwrap();
      const address = getContractAddress(
        key.args[1] as unknown as SmartContractAddress
      );

      if (
        address &&
        (unwrappedValue.staked.period.toNumber() === currentPeriod ||
          includePreviousPeriods)
      ) {
        result.set(address, <SingularStakingInfo>{
          loyalStaker: unwrappedValue.loyalStaker.isTrue,
          staked: mapStakeAmount(unwrappedValue.staked),
        });
      }
    }
  }

  return result;
}

function mapStakeAmount(dapp: PalletDappStakingV3StakeAmount): StakeAmount {
  return {
    voting: dapp.voting.toBigInt(),
    buildAndEarn: dapp.buildAndEarn.toBigInt(),
    era: dapp.era.toNumber(),
    period: dapp.period.toNumber(),
    totalStake: dapp.voting.toBigInt() + dapp.buildAndEarn.toBigInt(),
  };
}

export function mapAccountLedger(
  ledger: PalletDappStakingV3AccountLedger
): AccountLedger {
  return <AccountLedger>{
    locked: ledger.locked.toBigInt(),
    unlocking: ledger.unlocking.map((chunk) => ({
      amount: chunk.amount.toBigInt(),
      unlockBlock: chunk.unlockBlock.toBigInt(),
    })),
    staked: mapStakeAmount(ledger.staked),
    stakedFuture: ledger.stakedFuture.isSome
      ? mapStakeAmount(ledger.stakedFuture.unwrap())
      : undefined,
    contractStakeCount: ledger.contractStakeCount.toNumber(),
  };
}

export function mapEndPeriodInfo(
  info: PalletDappStakingV3PeriodEndInfo
): PeriodEndInfo {
  return {
    bonusRewardPool: info.bonusRewardPool.toBigInt(),
    totalVpStake: info.totalVpStake.toBigInt(),
    finalEra: info.finalEra.toNumber(),
  };
}

export function mapEraRewards(
  rewards: PalletDappStakingV3EraRewardSpan
): EraRewardSpan {
  return {
    firstEra: rewards.firstEra.toNumber(),
    lastEra: rewards.lastEra.toNumber(),
    span: rewards.span.map((reward) => ({
      stakerRewardPool: reward.stakerRewardPool.toBigInt(),
      staked: reward.staked.toBigInt(),
      dappRewardPool: reward.dappRewardPool.toBigInt(),
    })),
  };
}

export function mapBalanceInfo(
  balanceInfo: FrameSystemAccountInfo
): AccountInfo {
  return {
    nonce: balanceInfo.nonce.toNumber(),
    consumers: balanceInfo.consumers.toNumber(),
    providers: balanceInfo.providers.toNumber(),
    sufficients: balanceInfo.sufficients.toNumber(),
    data: {
      free: balanceInfo.data.free.toBigInt(),
      reserved: balanceInfo.data.reserved.toBigInt(),
      frozen: balanceInfo.data.frozen.toBigInt(),
      flags: balanceInfo.data.flags.toBigInt(),
    },
  };
}

export function mapInflationConfiguration(
  data: PalletInflationActiveInflationConfig
): InflationConfiguration {
  return {
    issuanceSafetyCap: data.issuanceSafetyCap.toBigInt(),
    collatorRewardPerBlock: data.collatorRewardPerBlock.toBigInt(),
    treasuryRewardPerBlock: data.treasuryRewardPerBlock.toBigInt(),
    dappRewardPoolPerEra: data.dappRewardPoolPerEra.toBigInt(),
    baseStakerRewardPoolPerEra: data.baseStakerRewardPoolPerEra.toBigInt(),
    adjustableStakerRewardPoolPerEra:
      data.adjustableStakerRewardPoolPerEra.toBigInt(),
    bonusRewardPoolPerPeriod: data.bonusRewardPoolPerPeriod.toBigInt(),
    idealStakingRate: Number(
      data.idealStakingRate.toBigInt() / BigInt("10000000000000000")
    ),
    recalculationEra: data.recalculationEra.toNumber(),
  };
}

function quntilToNumber(value: Compact<Perquintill>): number {
  return Number(value.toHuman()?.toString().replace("%", "") ?? 0) / 100;
}

export function mapInflationParams(
  data: PalletInflationInflationParameters
): InflationParam {
  return {
    maxInflationRate: quntilToNumber(data.maxInflationRate),
    adjustableStakersPart: quntilToNumber(data.adjustableStakersPart),
    baseStakersPart: quntilToNumber(data.baseStakersPart),
    idealStakingRate: quntilToNumber(data.idealStakingRate),
    treasuryPart: quntilToNumber(data.treasuryPart),
    collatorsPart: quntilToNumber(data.collatorsPart),
    dappsPart: quntilToNumber(data.dappsPart),
    bonusPart: quntilToNumber(data.bonusPart),
  };
}
