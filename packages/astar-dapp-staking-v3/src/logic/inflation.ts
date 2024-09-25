import type {
  PalletInflationActiveInflationConfig,
  PalletInflationInflationParameters,
} from "../models/chain";
import type { InflationConfiguration, InflationParam } from "../models/library";
import {
  mapInflationConfiguration,
  mapInflationParams,
} from "../models/mappers";
import { getApi } from "./util";

export async function getInflationConfiguration(
  block?: number
): Promise<InflationConfiguration> {
  const api = await getApi(block);
  const data =
    await api.query.inflation.activeInflationConfig<PalletInflationActiveInflationConfig>();

  return mapInflationConfiguration(data);
}

export async function getInflationParams(
  block?: number
): Promise<InflationParam> {
  const api = await getApi(block);
  const data =
    await api.query.inflation.inflationParams<PalletInflationInflationParameters>();

  return mapInflationParams(data);
}
