import type { u128, u32, Option } from "@polkadot/types";

import type {
  EraInfo,
  PalletDappStakingV3AccountLedger,
  PalletDappStakingV3EraInfo,
  PalletDappStakingV3EraRewardSpan,
  PalletDappStakingV3PeriodEndInfo,
  PalletDappStakingV3ProtocolState,
} from "../models/chain";
import type {
  AccountLedger,
  Constants,
  EraLengths,
  EraRewardSpan,
  PeriodEndInfo,
  ProtocolState,
  SingularStakingInfo,
} from "../models/library";
import {
  mapAccountLedger,
  mapCurrentEraInfo,
  mapEndPeriodInfo,
  mapEraRewards,
  mapsStakerInfo,
  mapToProtocolStateModel,
} from "../models/mappers";
import { bytesToNumber, getApi, isValidEthereumAddress } from "./util";
import { ERA_LENGTHS } from "../constants";

/**
 * Gets the current protocol state containing information about current era, subperiod, etc...
 * @param block Block to query the state at. If not provided, state for the current block will be returned.
 * @returns protocol state
 */
export async function getProtocolState(block?: number): Promise<ProtocolState> {
  const api = await getApi(block);
  const state =
    await api.query.dappStaking.activeProtocolState<PalletDappStakingV3ProtocolState>();

  return mapToProtocolStateModel(state);
}

/**
 * Gets the current era information containing total locked amount, unlocking amount, current and next stake amounts.
 * @param block Block to query the era info at. If not provided, era info for the current block will be returned.
 * @returns era info
 */
export async function getCurrentEraInfo(block?: number): Promise<EraInfo> {
  const api = await getApi(block);
  const info =
    await api.query.dappStaking.currentEraInfo<PalletDappStakingV3EraInfo>();

  return mapCurrentEraInfo(info);
}

export async function getStakerInfo(
  stakerAddress: string,
  includePreviousPeriods = false
): Promise<Map<string, SingularStakingInfo>> {
  const api = await getApi();
  const [stakerInfos, protocolState] = await Promise.all([
    api.query.dappStaking.stakerInfo.entries(stakerAddress),
    getProtocolState(),
  ]);

  return mapsStakerInfo(
    stakerInfos,
    protocolState.periodInfo.number,
    includePreviousPeriods
  );
}

export function getStake(
  stakerInfo: Map<string, SingularStakingInfo>,
  dappAddress: string
): SingularStakingInfo | undefined {
  const isEvmAddress = isValidEthereumAddress(dappAddress);

  return stakerInfo.get(isEvmAddress ? dappAddress.toLowerCase() : dappAddress);
}

export async function getAccountLedger(
  address: string
): Promise<AccountLedger> {
  const api = await getApi();
  const ledger =
    await api.query.dappStaking.ledger<PalletDappStakingV3AccountLedger>(
      address
    );

  return mapAccountLedger(ledger);
}

export async function getConstants(): Promise<Constants> {
  const api = await getApi();

  return {
    eraRewardSpanLength: (<u32>(
      api.consts.dappStaking.eraRewardSpanLength
    )).toNumber(),
    rewardRetentionInPeriods: (<u32>(
      api.consts.dappStaking.rewardRetentionInPeriods
    )).toNumber(),
    minStakeAmount: (<u128>(
      api.consts.dappStaking.minimumStakeAmount
    )).toBigInt(),
    minBalanceAfterStaking: 10_000_000_000_000_000_000n,
    maxNumberOfStakedContracts: (<u32>(
      api.consts.dappStaking.maxNumberOfStakedContracts
    )).toNumber(),
    maxNumberOfContracts: (<u32>(
      api.consts.dappStaking.maxNumberOfContracts
    )).toNumber(),
    maxUnlockingChunks: (<u32>(
      api.consts.dappStaking.maxUnlockingChunks
    )).toNumber(),
    unlockingPeriod: (<u32>api.consts.dappStaking.unlockingPeriod).toNumber(),
  };
}

export async function getPeriodEndInfo(
  period: number
): Promise<PeriodEndInfo | undefined> {
  const api = await getApi();
  const infoWrapped = await api.query.dappStaking.periodEnd<
    Option<PalletDappStakingV3PeriodEndInfo>
  >(period);

  if (infoWrapped.isNone) {
    return undefined;
  }

  const info = infoWrapped.unwrap();
  return mapEndPeriodInfo(info);
}

export async function getEraRewards(
  spanIndex: number
): Promise<EraRewardSpan | undefined> {
  const api = await getApi();
  const rewardsWrapped = await api.query.dappStaking.eraRewards<
    Option<PalletDappStakingV3EraRewardSpan>
  >(spanIndex);

  if (rewardsWrapped.isNone) {
    return undefined;
  }

  const rewards = rewardsWrapped.unwrap();
  return mapEraRewards(rewards);
}

export async function getEraLengths(block?: number): Promise<EraLengths> {
  const api = await getApi(block);
  if (api.rpc) {
    const [erasPerBuildAndEarn, erasPerVoting, eraLength, periodsPerCycle] =
      await Promise.all([
        api.rpc.state.call(
          "DappStakingApi_eras_per_build_and_earn_subperiod",
          ""
        ),
        api.rpc.state.call("DappStakingApi_eras_per_voting_subperiod", ""),
        api.rpc.state.call("DappStakingApi_blocks_per_era", ""),
        api.rpc.state.call("DappStakingApi_periods_per_cycle", ""),
      ]);

    return {
      standardErasPerBuildAndEarnPeriod: bytesToNumber(erasPerBuildAndEarn),
      standardErasPerVotingPeriod: bytesToNumber(erasPerVoting),
      standardEraLength: bytesToNumber(eraLength),
      periodsPerCycle: bytesToNumber(periodsPerCycle),
    };
  }

  // Can't use api.rpc for past blocks
  // Using constants should be fine, because era lengths are not expected to change
  // in near future.
  const currentApi = await getApi();
  const network = currentApi.runtimeChain.toHuman();
  const eraLen = ERA_LENGTHS.get(network);

  if (eraLen) {
    return eraLen;
  }

  throw new Error(`ERA_LENGTHS are not defined for this network: ${network}`);
}
