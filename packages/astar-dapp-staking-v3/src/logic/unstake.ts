import { Subperiod } from "../models/library";
import type {
  ProtocolState,
  SingularStakingInfo,
  ExtrinsicPayload,
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
import { batchCalls, getApi, getDappAddressEnum, weiToToken } from "../utils";
import i18next from "i18next";

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
  const [canUnstakeResult, errorMessage] = await canUnstake(
    stakerAddress,
    contractAddress,
    amount
  );

  if (!canUnstakeResult) {
    throw new Error(errorMessage);
  }

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
  const claimStakerCalls = await getClaimStakerRewardsCalls(stakerAddress);
  const claimBonusCalls = await getClaimBonusRewardsCalls(stakerAddress);

  if (!claimStakerCalls && !claimBonusCalls) {
    return [];
  }

  return [
    ...(claimStakerCalls ? claimStakerCalls : []),
    ...(claimBonusCalls ? claimBonusCalls : []),
  ];
}

/**
 * Checks if staker can un-stake the given amount from the dApp.
 * @param stakerAddress The staker address.
 * @param dappAddress The dApp to un-stake from
 * @param amount The amount to un-stake
 * @param getProtocolStateCall Method to get the protocol state (optional, used for testing)
 * @param getStakerInfoCall Method to get the staker info (optional, used for testing)
 * @returns A tuple containing a boolean indicating if the staker can un-stake and a message explaining a reason.
 * If the method returns true, the second element of the tuple can contain a warning message or it is empty.
 */
export async function canUnstake(
  stakerAddress: string,
  dappAddress: string,
  amount: bigint,
  getProtocolStateCall: () => Promise<ProtocolState> = getProtocolState,
  getStakerInfoCall: (
    stakerAddress: string
  ) => Promise<Map<string, SingularStakingInfo>> = getStakerInfo
): Promise<[boolean, string]> {
  const [stakerInfo, protocolState, constants, ledger] = await Promise.all([
    getStakerInfoCall(stakerAddress),
    getProtocolStateCall(),
    getConstants(),
    getAccountLedger(stakerAddress),
  ]);

  const stake = getStake(stakerInfo, dappAddress);

  if (!stake) {
    return [
      false,
      i18next.t("noStakingInfoForContract", { address: dappAddress }),
    ];
  }
  const stakedAmount = stake.staked.totalStake;

  if (amount <= 0) {
    return [false, i18next.t("amountGt0")];
  }

  if (amount > stakedAmount) {
    return [false, i18next.t("unstakeGreaterThanStaked")];
  }

  if (protocolState.maintenance) {
    return [false, i18next.t("maintenanceMode")];
  }

  if (stake.staked.period !== protocolState.periodInfo.number) {
    return [false, i18next.t("unstakingInvalidPeriod")];
  }

  if (ledger.unlocking.length >= constants.maxUnlockingChunks) {
    return [false, i18next.t("tooManyUnlockingChunks")];
  }

  if (constants.minStakeAmount > stakedAmount - amount) {
    // Handle un-staking all tokens.
    return [
      true,
      i18next.t("unstakeAllWarning", {
        amount: weiToToken(constants.minStakeAmount),
      }),
    ];
  }

  if (
    stake.loyalStaker &&
    protocolState.periodInfo.subperiod === Subperiod.BuildAndEarn &&
    stake.staked.totalStake - amount < stake.staked.voting
  ) {
    // Handle possibility to lose bonus rewards.
    const message =
      stake.staked.buildAndEarn > BigInt(0)
        ? i18next.t("loseBonusWarningAmount", {
            amount: weiToToken(stake.staked.buildAndEarn),
          })
        : i18next.t("loseBonusWarning");

    return [true, message];
  }

  return [true, ""];
}

export async function getClaimUnlockedCall(): Promise<ExtrinsicPayload> {
  const api = await getApi();
  return api.tx.dappStaking.claimUnlocked();
}
