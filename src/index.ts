import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import {
  initApi,
  getStakeCall,
  subscribeToProtocolStateChanges,
} from "@astar-network/dapp-staking-v3";

// async function protocolState() {
//   const wsProvider = new WsProvider("ws://127.0.0.1:9944");
//   const api = await ApiPromise.create({ provider: wsProvider });

//   initApi(api);
//   const unsub = await subscribeToProtocolStateChanges((state) => {
//     console.log("Protocol state:", state);
//     // unsub();
//   });
// }

// protocolState();

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
  const stakeBatch = await getStakeCall(alice.address, stakeAmount, [
    {
      address: "0xb196bac674bc0e02e78db10e3c015ed4ec802658",
      amount: stakeAmount,
    },
  ]);

  // Sign and send the batch call.
  await stakeBatch.signAndSend(alice, (result) => {
    console.log("Stake result:", result.status.toHuman());
  });
}

stakeTest()
  .catch((err) => console.error(err.message))
  .finally(() => process.exit());
