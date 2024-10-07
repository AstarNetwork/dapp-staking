import { tokenToWei, weiToToken } from "@astar-network/dapp-staking-v3/utils";
import { expect, test } from "vitest";

test("weiToToken", () => {
  expect(weiToToken(BigInt(1000000000000000000))).toBe(1);
  expect(weiToToken(BigInt(1500000000000000000))).toBe(1.5);
});

test("tokenToWei", () => {
  expect(tokenToWei(1.5)).toBe(BigInt(1500000000000000000));
});
