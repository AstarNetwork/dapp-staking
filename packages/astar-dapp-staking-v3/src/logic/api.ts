import axios from "axios";
import { TOKEN_API_URL } from "../constants";
import type { ApiSupportedNetwork, Dapp } from "../models/library";
import { getApi } from "../utils";

enum HttpCodes {
  NotFound = 404,
}

export async function getDappDetails(
  dappAddress: string
): Promise<Dapp | undefined> {
  const network = await getNetworkName();
  const url = `${TOKEN_API_URL}/v1/${network.toLowerCase()}/dapps-staking/dapps/${dappAddress}?forEdit=false`;

  try {
    const response = await axios.get<Dapp>(url);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === HttpCodes.NotFound
    ) {
      return undefined;
    }

    throw error;
  }
}

async function getNetworkName(): Promise<ApiSupportedNetwork> {
  const api = await getApi();
  const chain = api.runtimeChain.toHuman();

  switch (chain.toString().toLowerCase()) {
    case "astar":
      return "astar";
    case "shiden":
      return "shiden";
    case "shibuya testnet":
      return "shibuya";
    default:
      throw new Error(`Unsupported network: ${chain.toString()}`);
  }
}
