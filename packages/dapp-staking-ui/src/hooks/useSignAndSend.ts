import type { Null, Result } from "@polkadot/types-codec";
import type { DispatchError, EventRecord } from "@polkadot/types/interfaces";
import type { ITuple, Signer } from "@polkadot/types/types";
import type { ExtrinsicPayload } from "@astar-network/dapp-staking-v3";
import { useAccount } from "./useAccount";

export const useSignAndSend = (signer: Signer) => {
  const { account, wallet } = useAccount();

  const signAndSend = async (
    call: ExtrinsicPayload,
    progressUpdateCallback: (isBusy: boolean, status: string) => void
  ): Promise<void> => {
    if (!account || !wallet) {
      throw new Error("Please connect your wallet and select account first.");
    }

    const unsubscribe = await call.signAndSend(
      account.address,
      {
        signer: signer ?? wallet.signer,
        nonce: -1,
        withSignedTransaction: true,
      },
      (result) => {
        progressUpdateCallback(true, result.status.type);

        if (result.isCompleted) {
          unsubscribe();
          progressUpdateCallback(false, "");
          const [isFailed, message] = isExtrinsicFailed(result.events);
          if (isFailed) {
            throw new Error(message);
          }
        }
      }
    );
  };

  const isExtrinsicFailed = (events: EventRecord[]): [boolean, string] => {
    let result = false;
    let message = "";
    events
      .filter(
        (record): boolean =>
          !!record.event && record.event.section !== "democracy"
      )
      .map(({ event: { data, method, section } }) => {
        if (section === "system" && method === "ExtrinsicFailed") {
          const [dispatchError] = data as unknown as ITuple<[DispatchError]>;
          message = dispatchError.type.toString();
          message = getErrorMessage(dispatchError);
          result = true;
        } else if (section === "ethCall" && method === "Executed") {
          const [, dispatchError] = data as unknown as ITuple<
            [Result<Null, DispatchError>]
          >;

          if (dispatchError?.isErr) {
            message = getErrorMessage(dispatchError.asErr);
            result = true;
          }
        } else if (section === "utility" && method === "BatchInterrupted") {
          const anyData = data as any;
          const error = anyData[1].registry.findMetaError(anyData[1].asModule);
          let message = `${error.section}.${error.name}`;
          message = `action: ${section}.${method} ${message}`;
          result = true;
        }
      });

    return [result, message];
  };

  const getErrorMessage = (dispatchError: DispatchError): string => {
    let message = "";
    if (dispatchError.isModule) {
      try {
        const mod = dispatchError.asModule;
        const error = dispatchError.registry.findMetaError(mod);

        message = `${error.section}.${error.name}`;
      } catch (error) {
        // swallow
        console.error(error);
      }
    } else if (dispatchError.isToken) {
      message = `${dispatchError.type}.${dispatchError.asToken.type}`;
    }

    return message;
  };

  return {
    signAndSend,
  };
};
