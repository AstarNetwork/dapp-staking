import { memo, useEffect, useState } from "react";
import { useDappStaking, useAccount, useApi } from "@/hooks";
import { weiToToken } from "@astar-network/dapp-staking-v3/utils";
import styles from "./RewardsFor.module.css";

const Rewards = () => {
  const { account } = useAccount();
  const { tokenSymbol } = useApi();
  const {
    claimStakerRewardsFor,
    claimBonusRewardsFor,
    getStakerRewards,
    getBonusRewards,
  } = useDappStaking();
  const [stakerAddress, setStakerAddress] = useState<string>();
  const [stakerRewards, setStakerRewards] = useState<bigint | undefined>();
  const [bonusRewards, setBonusRewards] = useState<bigint | undefined>();

  const fetchRewards = async () => {
    if (stakerAddress) {
      const [staker, bonus] = await Promise.all([
        getStakerRewards(stakerAddress),
        getBonusRewards(stakerAddress),
      ]);

      setStakerRewards(staker.amount);
      setBonusRewards(bonus);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [stakerAddress]);

  const handleStakerAddressChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStakerAddress(event.target.value);
  };

  const handleClaimStakerRewards = async () => {
    if (stakerAddress) {
      await claimStakerRewardsFor(stakerAddress, fetchRewards);
    }
  };

  const handleClaimBonusRewards = async () => {
    if (stakerAddress) {
      await claimBonusRewardsFor(stakerAddress, fetchRewards);
    }
  };

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
        <b>Claim rewards for other stakers</b>
        <div className={styles.rewardRow}>
          Staker address:{" "}
          <input
            type="text"
            className={styles.stakerAddress}
            onChange={handleStakerAddressChange}
          />
        </div>
        <div className={styles.rewardRow}>
          <div>
            Staker:{" "}
            <b>
              {formatReward(stakerRewards)} {tokenSymbol}
            </b>
          </div>
          <div>
            {canClaim(stakerRewards) && (
              <button type="button" onClick={handleClaimStakerRewards}>
                Claim
              </button>
            )}
          </div>
        </div>
        <div className={styles.rewardRow}>
          <div>
            Bonus:{" "}
            <b>
              {formatReward(bonusRewards)} {tokenSymbol}
            </b>
          </div>
          <div>
            {canClaim(bonusRewards) && (
              <button type="button" onClick={handleClaimBonusRewards}>
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
