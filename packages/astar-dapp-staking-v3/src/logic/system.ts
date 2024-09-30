import type { u64 } from "@polkadot/types";
import type { FrameSystemAccountInfo } from "../models/chain";
import type { AccountInfo } from "../models/library";
import { mapBalanceInfo } from "../models/mappers";
import { getApi } from "../utils";
import { ORIGINAL_BLOCK_TIME } from "../constants";

/**
 * Gets the balance of the account.
 * @param address Address of the account.
 * @returns Account balance.
 */
export async function getBalance(address: string): Promise<AccountInfo> {
  const api = await getApi();
  const info = await api.query.system.account<FrameSystemAccountInfo>(address);

  return mapBalanceInfo(info);
}

/**
 * Gets the block time in seconds. This is not actual block time, but configured block time.
 * @param block Block to get the info for (optional).
 * @returns Block time.
 */
export async function getBlockTimeInSeconds(block?: number): Promise<number> {
  const api = await getApi(block);

  if (api.consts.aura) {
    const blockTime = <u64>api.consts.aura.slotDuration;
    return blockTime.toNumber() / 1000;
  }

  return ORIGINAL_BLOCK_TIME;
}
