import type { ApiPromise } from "@polkadot/api";
import {
  isEthereumAddress,
  checkAddress,
  encodeAddress,
  decodeAddress,
} from "@polkadot/util-crypto";
import { hexToU8a, u8aToNumber, isHex } from "@polkadot/util";
import type { Bytes } from "@polkadot/types";
import type { SmartContractAddress } from "../models/chain";
import type { AccountInfo, ExtrinsicPayload } from "../models/library";
import { CHAIN_DECIMALS, EXISTENTIAL_DEPOSIT } from "../constants";

export function getDappAddressEnum(address: string) {
  if (isValidEthereumAddress(address)) {
    return { Evm: address };
  }

  if (isValidPolkadotAddress(address)) {
    return { Wasm: address };
  }

  throw new Error(
    `Invalid contract address ${address}. The address should be in H160 or SS58 format.`
  );
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
  console.log("Astar dApp staking v3 library has been initialized.");
}

export async function getApi(blockNumber?: number): Promise<ApiPromise> {
  if (!api) {
    throw new Error(
      "Astar dApp staking v3 library has not been initialized. Please call initApi first."
    );
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
  return Number(wei / BigInt(10 ** CHAIN_DECIMALS));
}

export function max(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}
