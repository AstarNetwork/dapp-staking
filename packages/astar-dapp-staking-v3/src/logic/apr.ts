import type { EraInfo } from "../models/chain";
import {
  PeriodType,
  type EraLengths,
  type ProtocolState,
} from "../models/library";
import { getTotalIssuance } from "./balances";
import { getInflationConfiguration, getInflationParams } from "./inflation";
import { getCurrentEraInfo, getEraLengths, getProtocolState } from "./query";
import { getBlockTimeInSeconds } from "./system";
import { weiToToken } from "../utils";

export async function getStakerApr(block?: number): Promise<number> {
  const [
    totalIssuance,
    inflationParams,
    eraLengths,
    eraInfo,
    protocolState,
    blockTime,
  ] = await Promise.all([
    getTotalIssuance(block),
    getInflationParams(block),
    getEraLengths(block),
    getCurrentEraInfo(block),
    getProtocolState(block),
    getBlockTimeInSeconds(block),
  ]);

  const cyclesPerYear = getCyclesPerYear(eraLengths, blockTime);
  const currentStakeAmount = getStakeAmount(protocolState, eraInfo);

  const stakedPercent = currentStakeAmount / weiToToken(totalIssuance);
  const {
    baseStakersPart,
    adjustableStakersPart,
    idealStakingRate,
    maxInflationRate,
  } = inflationParams;

  const stakerRewardPercent =
    baseStakersPart +
    adjustableStakersPart * Math.min(1, stakedPercent / idealStakingRate);
  const stakerApr =
    ((maxInflationRate * stakerRewardPercent) / stakedPercent) *
    cyclesPerYear *
    100;

  return stakerApr;
}

export async function getBonusApr(
  simulatedVoteAmount: number = 1000,
  block?: number
): Promise<{ value: number; simulatedBonusPerPeriod: number }> {
  const [
    inflationConfiguration,
    eraLengths,
    eraInfo,
    protocolState,
    blockTime,
  ] = await Promise.all([
    getInflationConfiguration(block),
    getEraLengths(block),
    getCurrentEraInfo(block),
    getProtocolState(block),
    getBlockTimeInSeconds(block),
  ]);

  const cyclesPerYear = getCyclesPerYear(eraLengths, blockTime);

  const formattedBonusRewardsPoolPerPeriod = weiToToken(
    inflationConfiguration.bonusRewardPoolPerPeriod
  );
  const voteAmount = getVoteAmount(protocolState, eraInfo);
  const bonusPercentPerPeriod = formattedBonusRewardsPoolPerPeriod / voteAmount;
  const simulatedBonusPerPeriod = simulatedVoteAmount * bonusPercentPerPeriod;
  const periodsPerYear = eraLengths.periodsPerCycle * cyclesPerYear;
  const simulatedBonusAmountPerYear = simulatedBonusPerPeriod * periodsPerYear;
  const bonusApr = (simulatedBonusAmountPerYear / simulatedVoteAmount) * 100;

  return { value: bonusApr, simulatedBonusPerPeriod };
}

function getCyclesPerYear(
  eraLength: EraLengths,
  blockTimeInSeconds: number
): number {
  // TODO read from chain
  const secsOneYear = 365 * 24 * 60 * 60;
  const periodLength =
    eraLength.standardErasPerBuildAndEarnPeriod +
    eraLength.standardErasPerVotingPeriod;

  const eraPerCycle = periodLength * eraLength.periodsPerCycle;
  const blocksStandardEraLength = eraLength.standardEraLength;
  const blockPerCycle = blocksStandardEraLength * eraPerCycle;
  const cyclePerYear = secsOneYear / blockTimeInSeconds / blockPerCycle;

  return cyclePerYear;
}

function getStakeAmount(
  protocolState: ProtocolState,
  eraInfo: EraInfo
): number {
  const currentStakeAmount = weiToToken(
    protocolState.periodInfo.subperiod === PeriodType.Voting
      ? eraInfo.nextStakeAmount?.totalStake ?? BigInt(0)
      : eraInfo.currentStakeAmount.totalStake
  );

  return currentStakeAmount;
}

function getVoteAmount(protocolState: ProtocolState, eraInfo: EraInfo): number {
  const currentVoteAmount = weiToToken(
    protocolState.periodInfo.subperiod === PeriodType.Voting
      ? eraInfo.nextStakeAmount?.voting ?? BigInt(0)
      : eraInfo.currentStakeAmount.voting
  );

  return currentVoteAmount;
}
