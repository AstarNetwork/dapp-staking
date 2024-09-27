import type { u128 } from "@polkadot/types";
import { getApi } from "../utils";

/**
 * Get the total token issuance of the network.
 * @param blockNumber Block number to query the total issuance at. If not provided, the total issuance at the current block will be returned.
 * @returns Total issuance of the network.
 */
export async function getTotalIssuance(blockNumber?: number): Promise<bigint> {
  const api = await getApi(blockNumber);
  const issuance = await api.query.balances.totalIssuance<u128>();

  return issuance.toBigInt();
}
