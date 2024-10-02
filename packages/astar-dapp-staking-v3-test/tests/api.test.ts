import { expect } from "vitest";
import { given } from "../helpers";
import { getDappDetails, initApi } from "@astar-network/dapp-staking-v3";

given("astar")(
  "getDappDetails returns correct value",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const dApp = await getDappDetails(
      "0xa602d021da61ec4cc44dedbd4e3090a05c97a435"
    );

    expect(dApp?.name).toBe("Astar Core Contributors");
  }
);
