[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / AccountLedger

# Interface: AccountLedger

Account ledger.

## Properties

### contractStakeCount

> `readonly` **contractStakeCount**: `number`

Number of contracts staked by the account.

***

### locked

> `readonly` **locked**: `bigint`

Total tokens locked in dApp staking. Locked tokens can be used for staking

***

### staked

> `readonly` **staked**: [`StakeAmount`](StakeAmount.md)

Stake information for a particular era.

***

### stakedFuture?

> `readonly` `optional` **stakedFuture**: [`StakeAmount`](StakeAmount.md)

Stake information for the next era.
This is needed since stake amount is only applicable from the next era after it's been staked.

***

### unlocking

> `readonly` **unlocking**: [`UnlockingChunk`](UnlockingChunk.md)[]

Vector of all the unlocking chunks. This is also considered locked but cannot be used for staking.
