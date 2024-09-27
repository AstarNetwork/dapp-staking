import type {
  PalletInflationActiveInflationConfig,
  PalletInflationInflationParameters,
} from "../models/chain";
import type { InflationConfiguration, InflationParam } from "../models/library";
import {
  mapInflationConfiguration,
  mapInflationParams,
} from "../models/mappers";
import { getApi } from "../utils";

/**
 * Gets the active inflation configuration.
 * @param block Block to query the state at. If not provided, state for the current block will be returned.
 * @returns Inflation configuration.
 */
export async function getInflationConfiguration(
  block?: number
): Promise<InflationConfiguration> {
  const api = await getApi(block);
  const data =
    await api.query.inflation.activeInflationConfig<PalletInflationActiveInflationConfig>();

  return mapInflationConfiguration(data);
}

/**
 * Gets static inflation parameters used to calculate inflation configuration.
 * @param block Block to query the state at. If not provided, state for the current block will be returned.
 * @returns Static inflation parameters.
 */
export async function getInflationParams(
  block?: number
): Promise<InflationParam> {
  const api = await getApi(block);
  const data =
    await api.query.inflation.inflationParams<PalletInflationInflationParameters>();

  return mapInflationParams(data);
}
