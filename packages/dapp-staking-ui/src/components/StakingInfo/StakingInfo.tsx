import { memo } from "react";
import { weiToToken } from "@astar-network/dapp-staking-v3/utils";
import { useApi, useDappStaking } from "@/hooks";

const StakingInfo = ({ dappAddress }: { dappAddress: string }) => {
  const { stakeInfo: info } = useDappStaking();
  const { tokenSymbol } = useApi();

  return (
    <div>
      Your staking:
      <b>
        {info &&
          weiToToken(
            info.get(dappAddress)?.staked.totalStake || BigInt(0)
          )}{" "}
        {tokenSymbol}
      </b>
    </div>
  );
};

export default memo(StakingInfo);
