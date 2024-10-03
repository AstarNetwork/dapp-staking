import { memo } from "react";
import { weiToToken } from "@astar-network/dapp-staking-v3/utils";
import { useDappStaking } from "@/hooks";
import { DAPP_ADDRESS } from "@/configuration/constants";

const StakingInfo = ({ dappAddress }: { dappAddress: string }) => {
  const { stakeInfo: info } = useDappStaking();

  return (
    <div>
      Your staking:
      {info &&
        weiToToken(info.get(dappAddress)?.staked.totalStake || BigInt(0))}
    </div>
  );
};

export default memo(StakingInfo);
