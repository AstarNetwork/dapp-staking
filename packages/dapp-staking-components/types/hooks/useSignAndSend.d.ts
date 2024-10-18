import type { Signer } from "@polkadot/types/types";
import type { ExtrinsicPayload } from "@astar-network/dapp-staking-v3";
export declare const useSignAndSend: (signer: Signer, address: string) => {
    signAndSend: (call: ExtrinsicPayload, progressUpdateCallback: (isBusy: boolean, status: string) => void) => Promise<void>;
};
