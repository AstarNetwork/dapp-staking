import type {
  BonusRewards,
  StakerRewards,
  ExtrinsicPayload,
} from "../models/library";
import {
  getAccountLedger,
  getConstants,
  getEraRewards,
  getPeriodEndInfo,
  getProtocolState,
  getStakerInfo,
} from "./query";
import { getApi, getDappAddressEnum } from "../utils";

export async function getClaimStakerRewardsCall(
  senderAddress: string
): Promise<ExtrinsicPayload[] | undefined> {
  const { firstSpanIndex, lastSpanIndex, rewardsExpired, eraRewardSpanLength } =
    await getStakerEraRange(senderAddress);

  if (rewardsExpired || Number.isNaN(firstSpanIndex)) {
    return undefined;
  }

  const numberOfClaimCalls =
    (lastSpanIndex - firstSpanIndex) / eraRewardSpanLength + 1;

  const api = await getApi();
  const calls = Array(numberOfClaimCalls)
    .fill(0)
    .map(() => api.tx.dappStaking.claimStakerRewards());

  return calls;
}

export async function getStakerRewards(
  stakerAddress: string
): Promise<StakerRewards> {
  const ledger = await getAccountLedger(stakerAddress);

  // *** 1. Determine last claimable era.
  const {
    firstStakedEra,
    lastStakedEra,
    firstSpanIndex,
    lastSpanIndex,
    rewardsExpired,
    eraRewardSpanLength,
    lastStakedPeriod,
  } = await getStakerEraRange(stakerAddress);

  const result = {
    amount: BigInt(0),
    period: lastStakedPeriod,
    eraCount: 0,
  };

  if (rewardsExpired) {
    return result;
  }

  // *** 2. Create list of all claimable eras with stake amounts.
  const claimableEras: Map<number, bigint> = new Map();
  for (let era = firstStakedEra; era <= lastStakedEra; era++) {
    let stakedSum = BigInt(0);

    if (ledger.staked.era <= era && !ledger.stakedFuture) {
      stakedSum += ledger.staked.totalStake;
    } else if (ledger.stakedFuture) {
      if (ledger.stakedFuture.era <= era) {
        stakedSum += ledger.stakedFuture.totalStake;
      } else if (ledger.staked.era <= era) {
        stakedSum += ledger.staked.totalStake;
      }
    }

    claimableEras.set(era, stakedSum);
  }
  result.eraCount = claimableEras.size;

  // *** 3. Calculate rewards.
  for (
    let spanIndex = firstSpanIndex;
    spanIndex <= lastSpanIndex;
    spanIndex += eraRewardSpanLength
  ) {
    const span = await getEraRewards(spanIndex);
    if (!span) {
      continue;
    }

    for (let era = span.firstEra; era <= span.lastEra; era++) {
      const staked = claimableEras.get(era);
      if (staked) {
        const eraIndex = era - span.firstEra;
        result.amount +=
          (staked * span.span[eraIndex].stakerRewardPool) /
          span.span[eraIndex].staked;
      }
    }
  }

  return result;
}

async function getStakerEraRange(senderAddress: string) {
  const [protocolState, ledger, constants] = await Promise.all([
    getProtocolState(),
    getAccountLedger(senderAddress),
    getConstants(),
  ]);
  let rewardsExpired = false;

  // *** 1. Determine last claimable era.
  const currentPeriod = protocolState.periodInfo.number;
  const firstStakedEra = Math.min(
    ledger.staked.era > 0 ? ledger.staked.era : Number.POSITIVE_INFINITY,
    ledger.stakedFuture?.era ?? Number.POSITIVE_INFINITY
  );
  const lastStakedPeriod = Math.max(
    ledger.staked.period,
    ledger.stakedFuture?.period ?? 0
  );
  let lastStakedEra = 0;

  if (
    areRewardsExpired(
      lastStakedPeriod,
      currentPeriod,
      constants.rewardRetentionInPeriods
    )
  ) {
    // Rewards expired.
    rewardsExpired = true;
  } else if (lastStakedPeriod < currentPeriod) {
    // Find last era from past period.
    const periodInfo = await getPeriodEndInfo(lastStakedPeriod);
    lastStakedEra = periodInfo?.finalEra ?? 0; // periodInfo shouldn't be undefined for this case.
  } else if (lastStakedPeriod === currentPeriod) {
    // Find last era from current period.
    lastStakedEra = protocolState.era - 1;
  } else {
    throw "Invalid operation.";
  }

  if (firstStakedEra > lastStakedEra) {
    // No rewards earned. See if we need to distinguish this and rewards expired.
    rewardsExpired = true;
  }

  const firstSpanIndex =
    firstStakedEra - (firstStakedEra % constants.eraRewardSpanLength);
  const lastSpanIndex =
    lastStakedEra - (lastStakedEra % constants.eraRewardSpanLength);

  return {
    firstStakedEra,
    lastStakedEra,
    firstSpanIndex,
    lastSpanIndex,
    rewardsExpired,
    eraRewardSpanLength: constants.eraRewardSpanLength,
    lastStakedPeriod,
  };
}

function areRewardsExpired(
  stakedPeriod: number,
  currentPeriod: number,
  rewardRetentionInPeriods: number
): boolean {
  return stakedPeriod < currentPeriod - rewardRetentionInPeriods;
}

export async function getBonusRewards(senderAddress: string): Promise<bigint> {
  const result = await getBonusRewardsAndContractsToClaim(senderAddress);

  return result.amount;
}

export async function getClaimBonusRewardsCalls(
  senderAddress: string
): Promise<ExtrinsicPayload[] | undefined> {
  const result = await getBonusRewardsAndContractsToClaim(senderAddress);

  if (result.contractsToClaim.size === 0) {
    return undefined;
  }

  const api = await getApi();
  const contractAddresses = [...result.contractsToClaim.keys()];
  return contractAddresses.map((address) =>
    api.tx.dappStaking.claimBonusReward(getDappAddressEnum(address))
  );
}

async function getBonusRewardsAndContractsToClaim(
  senderAddress: string
): Promise<BonusRewards> {
  const result = {
    amount: BigInt(0),
    contractsToClaim: new Map<string, bigint>(),
  };
  const [stakerInfo, protocolState, constants] = await Promise.all([
    getStakerInfo(senderAddress, true),
    getProtocolState(),
    getConstants(),
  ]);

  for (const [contract, info] of stakerInfo.entries()) {
    // Staker is eligible to bonus rewards if he is a loyal staker and if rewards are not expired
    // and if stake amount doesn't refer to the past period.
    if (
      info.loyalStaker &&
      protocolState &&
      info.staked.period >=
        protocolState.periodInfo.number - constants.rewardRetentionInPeriods &&
      info.staked.period < protocolState.periodInfo.number
    ) {
      const periodEndInfo = await getPeriodEndInfo(info.staked.period);
      if (periodEndInfo) {
        const reward =
          (info.staked.voting * periodEndInfo.bonusRewardPool) /
          periodEndInfo.totalVpStake;
        result.amount += reward;
        result.contractsToClaim.set(contract, reward);
      } else {
        throw `Period end info not found for period ${info.staked.period}.`;
      }
    }
  }

  return result;
}
