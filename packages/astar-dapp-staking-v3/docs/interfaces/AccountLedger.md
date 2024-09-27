[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / AccountLedger

# Interface: AccountLedger

Account ledger.

## Properties

### contractStakeCount

> `readonly` **contractStakeCount**: `number`

Number of contracts staked by the account.

#### Defined in

[models/library/index.ts:69](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/models/library/index.ts#L69)

***

### locked

> `readonly` **locked**: `bigint`

Total tokens locked in dApp staking. Locked tokens can be used for staking

#### Defined in

[models/library/index.ts:52](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/models/library/index.ts#L52)

***

### staked

> `readonly` **staked**: `StakeAmount`

Stake information for a particular era.

#### Defined in

[models/library/index.ts:60](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/models/library/index.ts#L60)

***

### stakedFuture?

> `readonly` `optional` **stakedFuture**: `StakeAmount`

Stake information for the next era.
This is needed since stake amount is only applicable from the next era after it's been staked.

#### Defined in

[models/library/index.ts:65](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/models/library/index.ts#L65)

***

### unlocking

> `readonly` **unlocking**: [`UnlockingChunk`](UnlockingChunk.md)[]

Vector of all the unlocking chunks. This is also considered locked but cannot be used for staking.

#### Defined in

[models/library/index.ts:56](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/models/library/index.ts#L56)
