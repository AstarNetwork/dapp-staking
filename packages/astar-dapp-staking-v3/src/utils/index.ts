import type { ApiPromise } from "@polkadot/api";
import {
  isEthereumAddress,
  checkAddress,
  encodeAddress,
  decodeAddress,
} from "@polkadot/util-crypto";
import { hexToU8a, u8aToNumber, isHex } from "@polkadot/util";
import type { Bytes } from "@polkadot/types";
import i18next from "i18next";
import type { SmartContractAddress } from "../models/chain";
import type { AccountInfo, ExtrinsicPayload } from "../models/library";
import { CHAIN_DECIMALS, EXISTENTIAL_DEPOSIT } from "../constants";
import { ethers } from "ethers";

i18next.init(
  {
    lng: "en", // if you're using a language detector, do not define the lng option
    debug: false,
    resources: {
      en: {
        translation: {
          i18initialized: "Translation engine has been initialized.",
          libInitialized: "Astar dApp staking v3 library has been initialized.",
          libNotInitialized:
            "Astar dApp staking v3 library has not been initialized. Please call initApi first.",
          invalidContractAddress:
            "Invalid contract address {{address}}. The address should be in H160 or SS58 format.",
          stakerAddressError: "Staker address is not provided or invalid.",
          maintenanceMode: "dApp staking pallet is in maintenance mode.",
          lastPeriodError:
            "Period ends in the next era. It is not possible to stake in the last era of a period.",
          noStakeInfo: "No stake info provided.",
          dAppAddressError:
            "dApp address is not provided or invalid {{address}}",
          amountGt0: "Amount must be greater than 0.",
          tooManyContractStakes:
            "There are too many contract stake entries for the account.",
          minStakingAmount:
            "Minimum staking amount is {{amount}} tokens per dApp.",
          dappNotRegistered:
            "The dApp {{address}} is not registered for dApp staking.",
          insufficientBalance:
            "The staking amount surpasses the current balance available for staking.",
          insufficientRemainingBalance:
            "Account must hold more than {{amount}} transferable tokens after you stake.",
          noStakingInfoForContract:
            "Staker account has no staking information for the contract {{address}}.",
          unstakeGreaterThanStaked:
            "Un-stake amount is greater than the staked amount.",
          unstakingInvalidPeriod:
            "Un-staking is rejected since the period in which past stake was active has passed.",
          tooManyUnlockingChunks:
            "Contract has too many unlocking chunks. Withdraw the existing chunks if possible or wait for current chunks to complete unlocking process to withdraw them.",
          unstakeAllWarning:
            "The operation will un-stake all of your staked tokens because the minimum staking amount is {{amount}} tokens.",
          loseBonusWarning:
            "You will loose eligibility for bonus reward at the end of current period if you unstake tokens now.",
          loseBonusWarningAmount:
            "You will loose eligibility for bonus reward at the end of current period if you unstake more than {{amount}} tokens.",
        },
      },
    },
  },
  (err, t) => {
    // initialized and ready to go!
    console.log(t("i18initialized"));
  }
);

export function getDappAddressEnum(address: string) {
  if (isValidEthereumAddress(address)) {
    return { Evm: address };
  }

  if (isValidPolkadotAddress(address)) {
    return { Wasm: address };
  }

  throw new Error(i18next.t("invalidContractAddress", { address }));
}

export function getContractAddress(
  address: SmartContractAddress
): string | undefined {
  return address.isEvm ? address.asEvm?.toString() : address.asWasm?.toString();
}

let api: ApiPromise;

/**
 * Initializes the library with the instance of the Polkadot `ApiPromise`.
 *
 * This function should be called once before any other function in the library.
 * @param apiInstance `ApiPromise` instance.
 */
export function initApi(apiInstance: ApiPromise): void {
  api = apiInstance;
  console.log(i18next.t("libInitialized"));
}

export async function getApi(blockNumber?: number): Promise<ApiPromise> {
  if (!api) {
    throw new Error(i18next.t("libNotInitialized"));
  }

  if (blockNumber !== undefined) {
    const hash = await api.rpc.chain.getBlockHash(blockNumber);
    return api.at(hash) as unknown as ApiPromise;
  }
  return api;
}

/**
 * Create a batch call from multiple calls
 * @param calls calls to batch
 * @returns batch call
 */
export async function batchCalls(
  calls: ExtrinsicPayload[]
): Promise<ExtrinsicPayload> {
  const api = await getApi();
  return calls.length === 1 ? calls[0] : api.tx.utility.batchAll(calls);
}

export function isValidPolkadotAddress(
  address: string,
  prefix?: number
): boolean {
  try {
    if (prefix || prefix === 0) {
      return checkAddress(address, prefix)[0];
    }
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (error) {
    return false;
  }
}

export function isValidEthereumAddress(address: string): boolean {
  return isEthereumAddress(address);
}

export function getAvailableBalance(accountInfo: AccountInfo): bigint {
  // According to https://wiki.polkadot.network/docs/learn-account-balances
  return (
    accountInfo.data.free -
    max(
      accountInfo.data.frozen - accountInfo.data.reserved,
      EXISTENTIAL_DEPOSIT
    )
  );
}

export function bytesToNumber(bytes: Bytes): number {
  return u8aToNumber(bytes.toU8a().slice(1, 4));
}

export function weiToToken(wei: bigint): number {
  return Number(ethers.formatUnits(wei.toString(), CHAIN_DECIMALS));
}

export function max(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}
