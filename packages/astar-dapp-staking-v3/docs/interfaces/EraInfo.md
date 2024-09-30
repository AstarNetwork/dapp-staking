[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / EraInfo

# Interface: EraInfo

Era information.

## Properties

### currentStakeAmount

> `readonly` **currentStakeAmount**: [`StakeAmount`](StakeAmount.md)

Stake amount valid for ongoing era.

***

### nextStakeAmount?

> `readonly` `optional` **nextStakeAmount**: [`StakeAmount`](StakeAmount.md)

Stake amount valid from the next era.

***

### totalLocked

> `readonly` **totalLocked**: `bigint`

Tokens locked in the dApp staking.

***

### unlocking

> `readonly` **unlocking**: `bigint`

Tokens that are unlocking. Counts in totalLocked.
