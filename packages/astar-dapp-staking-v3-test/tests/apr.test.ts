import {
  getBonusApr,
  getStakerApr,
  initApi,
} from "@astar-network/dapp-staking-v3";

import { given } from "../helpers";
import { expect } from "vitest";

given("astar")(
  "getStakerApr returns correct value",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const apr = await getStakerApr();
    expect(apr).toBe(13.223914110585214);
  }
);

given("astar")(
  "getBonusApr returns correct value",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const apr = await getBonusApr();
    expect(apr.value).toBe(7.1402364157727325);
  }
);
