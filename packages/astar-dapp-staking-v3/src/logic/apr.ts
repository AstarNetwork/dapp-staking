import {
  Subperiod,
  type EraInfo,
  type EraLengths,
  type ProtocolState,
} from "../models/library";
import { getTotalIssuance } from "./balances";
import { getInflationConfiguration, getInflationParams } from "./inflation";
import { getCurrentEraInfo, getEraLengths, getProtocolState } from "./query";
import { getBlockTimeInSeconds } from "./system";
import { weiToToken } from "../utils";

/**
 * Calculates the staker APR
 * @param block Block to query the state at. If not provided, state for the current block will be returned.
 * @returns Staker APR %
 */
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

/**
 * Calculates the bonus APR
 * Usera is eligible for dApp staking bonus if they stake during the voting period and didn't unstake until the end of staking period.
 * @param simulatedVoteAmount Simulated vote amount to calculate the APR for
 * @param block Block to query the state at. If not provided, state for the current block will be returned.
 * @returns Bonus APR %
 */
export async function getBonusApr(
  simulatedVoteAmount = 1000,
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
    protocolState.periodInfo.subperiod === Subperiod.Voting
      ? eraInfo.nextStakeAmount?.totalStake ?? BigInt(0)
      : eraInfo.currentStakeAmount.totalStake
  );

  return currentStakeAmount;
}

function getVoteAmount(protocolState: ProtocolState, eraInfo: EraInfo): number {
  const currentVoteAmount = weiToToken(
    protocolState.periodInfo.subperiod === Subperiod.Voting
      ? eraInfo.nextStakeAmount?.voting ?? BigInt(0)
      : eraInfo.currentStakeAmount.voting
  );

  return currentVoteAmount;
}
