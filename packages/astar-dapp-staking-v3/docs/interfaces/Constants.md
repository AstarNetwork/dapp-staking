[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / Constants

# Interface: Constants

dApp staking constants.

## Properties

### eraRewardSpanLength

> **eraRewardSpanLength**: `number`

Maximum length of the single era reward span entry.

***

### maxNumberOfContracts

> **maxNumberOfContracts**: `number`

Maximum number of contracts in dApp staking.

***

### maxNumberOfStakedContracts

> **maxNumberOfStakedContracts**: `number`

Maximum number of staked contracts per staker account.

***

### maxUnlockingChunks

> **maxUnlockingChunks**: `number`

Maximum number of unlocking chunks per account.

***

### minBalanceAfterStaking

> **minBalanceAfterStaking**: `bigint`

Minimum transferable balance after staking (10 tokens). Intended to prevent all account funds from being locked by staking operation.

***

### minStakeAmount

> **minStakeAmount**: `bigint`

Minimum amount of tokens that can be staked on a contract.

***

### rewardRetentionInPeriods

> **rewardRetentionInPeriods**: `number`

Number of periods for which the rewards are kept for claiming.

***

### unlockingPeriod

> **unlockingPeriod**: `number`

Number of standard eras to pass before unlocking chunk can be claimed.
