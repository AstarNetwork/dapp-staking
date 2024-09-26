import type { Option } from "@polkadot/types";
import {
  type AccountLedger,
  PeriodType,
  type ProtocolState,
  type StakeInfo,
  type ExtrinsicPayload,
} from "../models/library";
import {
  getAccountLedger,
  getConstants,
  getProtocolState,
  getStake,
  getStakerInfo,
} from "./query";
import {
  getClaimBonusRewardsCalls,
  getClaimStakerRewardsCall,
} from "./rewards";
import {
  batchCalls,
  getApi,
  getAvailableBalance,
  getDappAddressEnum,
  isValidEthereumAddress,
  isValidPolkadotAddress,
} from "../utils";
import type { PalletDappStakingV3DAppInfo } from "../models/chain";
import { getBalance } from "./system";

/**
 * Gets batch call containing the following calls:
 *  - Claim staker and bonus rewards
 *  - Lock tokens
 *  - Cleanup expired entries id user reached maxNumberOfStakedContracts
 *  - Stake tokens
 * @param stakerAddress Staker address
 * @param amountToLock Amount to lock in wei
 * @param stakeInfo Stake info array containing dApp address and amount to stake (it is possible to stake to multiple dApps in one call)
 * @returns The batch call
 */
export async function getStakeCall(
  stakerAddress: string,
  amountToLock: bigint,
  stakeInfo: StakeInfo[]
): Promise<ExtrinsicPayload> {
  const [canStakeResult, errorMessage] = await canStake(
    stakerAddress,
    stakeInfo
  );
  if (!canStakeResult) {
    throw new Error(errorMessage);
  }

  const calls: ExtrinsicPayload[] = [];
  const api = await getApi();

  // Claim staker rewards
  const claimStakerCall = await getClaimStakerRewardsCall(stakerAddress);
  claimStakerCall && calls.push(...claimStakerCall);

  // Claim bonus rewards
  const claimBonusCalls = await getClaimBonusRewardsCalls(stakerAddress);
  claimBonusCalls && calls.push(...claimBonusCalls);

  // Lock tokens
  const lockCall =
    amountToLock > 0 ? api.tx.dappStaking.lock(amountToLock) : undefined;
  lockCall && calls.push(lockCall);

  // Cleanup expired entries if we reached maxNumberOfStakedContracts
  if (await shouldCleanupExpiredEntries(stakerAddress)) {
    const cleanupCall = api.tx.dappStaking.cleanupExpiredEntries();
    calls.push(cleanupCall);
  }

  // Stake tokens
  for (const info of stakeInfo) {
    const addressEnum = getDappAddressEnum(info.address);
    calls.push(api.tx.dappStaking.stake(addressEnum, info.amount));
  }

  return await batchCalls(calls);
}

async function shouldCleanupExpiredEntries(
  senderAddress: string
): Promise<boolean> {
  const [stakerInfo, constants, protocolState] = await Promise.all([
    getStakerInfo(senderAddress, true),
    getConstants(),
    getProtocolState(),
  ]);

  let expiredEntries = 0;

  for (const [_, info] of stakerInfo) {
    if (
      (info.staked.period < protocolState.periodInfo.number &&
        !info.loyalStaker) ||
      info.staked.period <
        protocolState.periodInfo.number - constants.rewardRetentionInPeriods
    ) {
      expiredEntries++;
    }
  }

  return expiredEntries > 0;
}

// Injecting methods for testing
export async function canStake(
  stakerAddress: string,
  stakes: StakeInfo[],
  getAccountLedgerCall: (
    address: string
  ) => Promise<AccountLedger> = getAccountLedger,
  getProtocolStateCall: () => Promise<ProtocolState> = getProtocolState
  //Returns: [result, errorMessage]
): Promise<[boolean, string]> {
  if (!stakerAddress || !isValidPolkadotAddress(stakerAddress)) {
    return [false, "Staker address is not provided or invalid."];
  }

  const [constants, ledger, protocolState, stakerInfo, accountInfo] =
    await Promise.all([
      getConstants(),
      getAccountLedgerCall(stakerAddress),
      getProtocolStateCall(),
      getStakerInfo(stakerAddress),
      getBalance(stakerAddress),
    ]);
  const stakeSum = stakes.reduce((acc, stake) => acc + stake.amount, 0n);

  if (protocolState.maintenance) {
    return [false, "dApp staking pallet is in maintenance mode."];
  }

  if (
    protocolState.periodInfo.subperiod === PeriodType.BuildAndEarn &&
    protocolState.periodInfo.nextSubperiodStartEra <= protocolState.era + 1
  ) {
    return [
      false,
      "Period ends in the next era. It is not possible to stake in the last era of a period.",
    ];
  }

  if (!stakes || stakes.length === 0) {
    return [false, "No stake info provided."];
  }

  for (const stake of stakes) {
    if (
      !stake.address ||
      (!isValidPolkadotAddress(stake.address) &&
        !isValidEthereumAddress(stake.address))
    ) {
      return [
        false,
        `dApp address is not provided or invalid ${stake.address}`,
      ];
    }

    if (stake.amount <= 0) {
      return [false, "Stake amount must be greater than 0."];
    }

    if (ledger.contractStakeCount >= constants.maxNumberOfStakedContracts) {
      return [
        false,
        "There are too many contract stake entries for the account.",
      ];
    }

    if (
      stake.amount < constants.minStakeAmount &&
      getStake(stakerInfo, stake.address) === undefined
    ) {
      return [
        false,
        `Minimum staking amount is ${constants.minStakeAmountToken} tokens per dApp.`,
      ];
    }

    const api = await getApi();
    const dapp = await api.query.dappStaking.integratedDApps<
      Option<PalletDappStakingV3DAppInfo>
    >(getDappAddressEnum(stake.address));
    if (dapp.isNone) {
      return [
        false,
        `The dApp ${stake.address} is not registered for dApp staking.`,
      ];
    }
  }

  const availableTokensBalance = getAvailableBalance(accountInfo);
  if (stakeSum > availableTokensBalance) {
    return [
      false,
      "The staking amount surpasses the current balance available for staking.",
    ];
  }

  if (constants.minBalanceAfterStaking > availableTokensBalance - stakeSum) {
    return [
      false,
      `Account must hold more than ${constants.minBalanceAfterStaking} transferable tokens after you stake.`,
    ];
  }

  return [true, ""];
}

/**
 * Gets batch call containing the following calls:
 *  - Claim staker and bonus rewards
 *  - Unstake tokens
 *  - Unlock tokens
 * @param stakerAddress
 * @param contractAddress
 * @param amount
 * @returns
 */
export async function getUnstakeCall(
  stakerAddress: string,
  contractAddress: string,
  amount: bigint
): Promise<ExtrinsicPayload> {
  const api = await getApi();

  const claimStakerCalls = await getClaimStakerAndBonusRewardsCalls(
    stakerAddress
  );

  const unstakeCalls = [
    api.tx.dappStaking.unstake(getDappAddressEnum(contractAddress), amount),
    api.tx.dappStaking.unlock(amount),
  ];

  const batch = await batchCalls([...claimStakerCalls, ...unstakeCalls]);

  return batch;
}

async function getClaimStakerAndBonusRewardsCalls(
  stakerAddress: string
): Promise<ExtrinsicPayload[]> {
  const claimStakerCalls = await getClaimStakerRewardsCall(stakerAddress);
  const claimBonusCalls = await getClaimBonusRewardsCalls(stakerAddress);

  if (!claimStakerCalls && !claimBonusCalls) {
    return [];
  }

  return [
    ...(claimStakerCalls ? claimStakerCalls : []),
    ...(claimBonusCalls ? claimBonusCalls : []),
  ];
}
