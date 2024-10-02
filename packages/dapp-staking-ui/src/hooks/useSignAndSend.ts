import type { ExtrinsicPayload } from "@astar-network/dapp-staking-v3";
import { useAccount } from "./useAccount";

export const useSignAndSend = () => {
  const { account, wallet } = useAccount();

  const signAndSend = async (
    call: ExtrinsicPayload,
    progressUpdateCallback: (status: string) => void
  ): Promise<void> => {
    if (!account || !wallet) {
      throw new Error("Please connect your wallet and select account first.");
    }

    try {
      const unsubscribe = await call.signAndSend(
        account.address,
        {
          signer: wallet.signer,
          nonce: -1,
          withSignedTransaction: true,
        },
        (result) => {
          console.log("stake result", result.toHuman());
          progressUpdateCallback(result.status.type);

          if (result.isCompleted) {
            unsubscribe();
          }
        }
      );
    } catch (error) {
      console.error(error);
      progressUpdateCallback(error);
    }
  };

  return {
    signAndSend,
  };
};
