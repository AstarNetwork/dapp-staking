import type { Option } from "@polkadot/types";
import {
  type AccountLedger,
  Subperiod,
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
  getClaimStakerRewardsCalls,
} from "./rewards";
import {
  batchCalls,
  getApi,
  getAvailableBalance,
  getDappAddressEnum,
  isValidEthereumAddress,
  isValidPolkadotAddress,
  weiToToken,
} from "../utils";
import type { PalletDappStakingV3DAppInfo } from "../models/chain";
import { getBalance } from "./system";
import i18next from "i18next";

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
  const claimStakerCall = await getClaimStakerRewardsCalls(stakerAddress);
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

/**
 * Checks if the staker can stake the provided stakes.
 * @param stakerAddress Staker address
 * @param stakes Stakes array containing dApp address and amount to stake.
 * @param getAccountLedgerCall Method to get the account ledger (optional, used for testing).
 * @param getProtocolStateCall Method to get the protocol state (optional, used for testing).
 * @returns A tuple containing a boolean indicating if the staker can stake and a message explaining a reason.
 * If the method returns true, the second element of the tuple can contain a warning message or it is empty.
 */
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
    return [false, i18next.t("stakerAddressError")];
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
    return [false, i18next.t("maintenanceMode")];
  }

  if (
    protocolState.periodInfo.subperiod === Subperiod.BuildAndEarn &&
    protocolState.periodInfo.nextSubperiodStartEra <= protocolState.era + 1
  ) {
    return [false, i18next.t("lastPeriodError")];
  }

  if (!stakes || stakes.length === 0) {
    return [false, i18next.t("noStakeInfo")];
  }

  for (const stake of stakes) {
    if (
      !stake.address ||
      (!isValidPolkadotAddress(stake.address) &&
        !isValidEthereumAddress(stake.address))
    ) {
      return [false, i18next.t("dAppAddressError", { address: stake.address })];
    }

    if (stake.amount <= 0) {
      return [false, i18next.t("amountGt0")];
    }

    if (ledger.contractStakeCount >= constants.maxNumberOfStakedContracts) {
      return [false, i18next.t("tooManyContractStakes")];
    }

    if (
      stake.amount < constants.minStakeAmount &&
      getStake(stakerInfo, stake.address) === undefined
    ) {
      return [
        false,
        i18next.t("minStakingAmount", {
          amount: weiToToken(constants.minStakeAmount),
        }),
      ];
    }

    const api = await getApi();
    const dapp = await api.query.dappStaking.integratedDApps<
      Option<PalletDappStakingV3DAppInfo>
    >(getDappAddressEnum(stake.address));
    if (dapp.isNone) {
      return [
        false,
        i18next.t("dappNotRegistered", { address: stake.address }),
      ];
    }
  }

  const availableTokensBalance = getAvailableBalance(accountInfo);
  if (stakeSum > availableTokensBalance) {
    return [false, i18next.t("insufficientBalance")];
  }

  if (constants.minBalanceAfterStaking > availableTokensBalance - stakeSum) {
    return [
      false,
      i18next.t("insufficientRemainingBalance", {
        amount: weiToToken(constants.minBalanceAfterStaking),
      }),
    ];
  }

  return [true, ""];
}
