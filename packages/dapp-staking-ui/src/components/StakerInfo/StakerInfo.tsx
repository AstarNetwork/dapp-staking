import { memo, useMemo } from "react";
import { useDappStaking, useAccount, useApi } from "@/hooks";
import { weiToToken } from "@astar-network/dapp-staking-v3/utils";
import styles from "./StakerInfo.module.css";

const StakerInfo = () => {
  const { account } = useAccount();
  const { tokenSymbol, currentBlock } = useApi();
  const { ledger, claimUnlocked } = useDappStaking();

  const availableToWithdraw = useMemo(() => {
    if (!ledger) {
      return 0n;
    }

    return ledger?.unlocking
      .filter((x) => x.unlockBlock <= (currentBlock ?? 0n))
      .reduce((acc, x) => acc + x.amount, 0n);
  }, [ledger, currentBlock]);

  const canWithdraw = useMemo(
    () => availableToWithdraw > 0n,
    [availableToWithdraw]
  );

  // TODO rename to formatAccount and move to utils
  const formatReward = (reward: bigint | undefined) => {
    return reward !== undefined ? weiToToken(reward).toFixed(4) : "--";
  };

  if (!account) {
    return null;
  }

  return (
    <div>
      <div className={styles.container}>
        <b>Staker info</b>
        <div className={styles.rewardRow}>
          <div>
            Staked:{" "}
            <b>
              {formatReward(
                ledger?.stakedFuture?.totalStake || ledger?.staked.totalStake
              )}{" "}
              {tokenSymbol}
            </b>
          </div>
        </div>
        <div className={styles.rewardRow}>
          <div>
            Locked:{" "}
            <b>
              {formatReward(ledger?.locked)} {tokenSymbol}
            </b>
          </div>
        </div>
        <div className={styles.rewardRow}>
          <div>
            Unlocking:{" "}
            {ledger?.unlocking.map((unlocking, index) => (
              <div key={unlocking.unlockBlock}>
                <b>
                  {formatReward(unlocking.amount)} {tokenSymbol}
                </b>{" "}
                available in block {unlocking.unlockBlock.toString()}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rewardRow}>
          <div>
            Available to withdraw:{" "}
            <b>
              {formatReward(availableToWithdraw)} {tokenSymbol}
            </b>
          </div>
        </div>
        <div className={styles.rewardRow}>
          {canWithdraw && (
            <button type="button" onClick={claimUnlocked}>
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(StakerInfo);
