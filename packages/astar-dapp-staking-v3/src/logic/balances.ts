import type { u128 } from "@polkadot/types";
import { getApi } from "../utils";

export async function getTotalIssuance(blockNumber?: number): Promise<bigint> {
  const api = await getApi(blockNumber);
  const issuance = await api.query.balances.totalIssuance<u128>();

  return issuance.toBigInt();
}
