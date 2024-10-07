import { memo } from "react";
import { useDappStaking, useAccount, useApi } from "@/hooks";
import { weiToToken } from "@astar-network/dapp-staking-v3/utils";
import styles from "./Rewards.module.css";

const Rewards = () => {
  const { account } = useAccount();
  const { tokenSymbol } = useApi();
  const { rewards, claimStakerRewards } = useDappStaking();

  const formatReward = (reward: bigint | undefined) => {
    return reward !== undefined ? weiToToken(reward).toFixed(4) : "--";
  };

  const canClaim = (reward: bigint | undefined): boolean =>
    reward !== undefined && reward > BigInt(0);

  if (!account) {
    return null;
  }

  return (
    <div>
      <div className={styles.container}>
        <b>Rewards</b>
        <div className={styles.rewardRow}>
          <div>
            Staker:{" "}
            <b>
              {formatReward(rewards?.staker)} {tokenSymbol}
            </b>
          </div>
          <div>
            {canClaim(rewards?.staker) && (
              <button type="button" onClick={claimStakerRewards}>
                Claim
              </button>
            )}
          </div>
        </div>
        <div className={styles.rewardRow}>
          <div>
            Bonus:{" "}
            <b>
              {formatReward(rewards?.bonus)} {tokenSymbol}
            </b>
          </div>
          <div>
            {canClaim(rewards?.bonus) && (
              <button
                type="button"
                onClick={() => alert("Implement me please")}
              >
                Claim
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Rewards);
