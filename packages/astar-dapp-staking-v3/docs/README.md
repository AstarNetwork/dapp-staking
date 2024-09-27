**@astar-network/dapp-staking-v3** • [**Docs**](globals.md)

***

# Astar dApp staking v3 library

## Intro

The library contains set of function to be used to access Astar dApp staking v3 pallet.
More info on dApp staking can be found in the [docs](https://docs.astar.network/docs/use/dapp-staking/)

## How to use

```TypeScript
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import {
  initApi,
  getClaimLockAndStakeBatch,
} from "@astar-network/dapp-staking-v3";

/**
 * Staking demo
 */
async function stakeTest(): Promise<void> {
  // Initialize Polkadot api
  const wsProvider = new WsProvider("wss://rpc.shibuya.astar.network");
  const api = await ApiPromise.create({ provider: wsProvider });

  // Initialize keyring and create a signer account.
  const keyring = new Keyring({ type: "sr25519", ss58Format: 5 });
  const alice = keyring.addFromUri("//Alice");

  // Initialize dApp staking api
  initApi(api);

  // Stake on a dApp
  // Call dApp staking api to get a batch call to lock and stake
  const stakeAmount = 5_000_000_000_000_000_000n;
  const stakeBatch = await getClaimLockAndStakeBatch(
    alice.address,
    stakeAmount,
    [
      {
        address: "0xb196bac674bc0e02e78db10e3c015ed4ec802658",
        amount: stakeAmount,
      },
    ]
  );

  // Sign and send the batch call.
  await stakeBatch.signAndSend(alice, (result) => {
    console.log("Stake result:", result.status.toHuman());
  });
}

stakeTest()
  .catch((err) => console.error(err.message))
  .finally(() => process.exit());

```

## Available calls

TODO all public calls descriptions

## TODOs

- Test cases

  - Find good test case for staker rewards (Just wait for an era to pass and update block number in .env)
  - Bonus reward - find a suitable account
    - getUnstakeCall needs also account with bonus rewards

- Use `i18n` or create `consts` for all strings
