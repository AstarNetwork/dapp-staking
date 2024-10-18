import React from "react";
import type { Signer } from "@polkadot/api/types";
type StakeButtonProps = {
    stakerAddress: string;
    contractAddress: string;
    amountToStakeInWei: bigint;
    amountToLockInWei: bigint;
    signer: Signer;
    onTransactionStateChange?: (isBusy: boolean, status: string) => void;
    onError?: (message: string) => void;
};
declare const StakeButton: React.FC<StakeButtonProps>;
export default StakeButton;
