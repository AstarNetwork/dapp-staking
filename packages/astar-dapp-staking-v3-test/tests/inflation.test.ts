import { initApi } from "@astar-network/dapp-staking-v3";
import {
  getInflationConfiguration,
  getInflationParams,
} from "@astar-network/dapp-staking-v3/build/logic/inflation";
import { given } from "../helpers";
import { expect } from "vitest";

given("astar")(
  "getInflationConfiguration has correct result",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const inflation = await getInflationConfiguration();
    expect(inflation).toMatchInlineSnapshot(`
      {
        "adjustableStakerRewardPoolPerEra": 705488598535856842272692n,
        "baseStakerRewardPoolPerEra": 440930374084910526420432n,
        "bonusRewardPoolPerPeriod": 27016685880930637774832747n,
        "collatorRewardPerBlock": 7131988564433525454n,
        "dappRewardPoolPerEra": 229283794524153473738624n,
        "idealStakingRate": 50,
        "issuanceSafetyCap": 8977594376582541123935105378n,
        "recalculationEra": 987,
        "treasuryRewardPerBlock": 11143732131927383522n,
      }
    `);
  }
);

given("astar")(
  "getInflationParams has correct result",
  async ({ networks: { astar } }) => {
    initApi(astar.api);
    const inflation = await getInflationParams();
    expect(inflation).toMatchInlineSnapshot(`
      {
        "adjustableStakersPart": 0.4,
        "baseStakersPart": 0.25,
        "bonusPart": 0.138,
        "collatorsPart": 0.032,
        "dappsPart": 0.13,
        "idealStakingRate": 0.5,
        "maxInflationRate": 0.07,
        "treasuryPart": 0.05,
      }
    `);
  }
);
