import type { u64 } from "@polkadot/types";
import type { FrameSystemAccountInfo } from "../models/chain";
import type { AccountInfo } from "../models/library";
import { mapBalanceInfo } from "../models/mappers";
import { getApi } from "../utils";
import { ORIGINAL_BLOCK_TIME } from "../constants";

export async function getBalance(address: string): Promise<AccountInfo> {
  const api = await getApi();
  const info = await api.query.system.account<FrameSystemAccountInfo>(address);

  return mapBalanceInfo(info);
}

export async function getBlockTimeInSeconds(block?: number): Promise<number> {
  const api = await getApi(block);

  if (api.consts.aura) {
    const blockTime = <u64>api.consts.aura.slotDuration;
    return blockTime.toNumber() / 1000;
  }

  return ORIGINAL_BLOCK_TIME;
}
