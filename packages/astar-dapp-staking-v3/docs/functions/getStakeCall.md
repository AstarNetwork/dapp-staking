[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getStakeCall

# Function: getStakeCall()

> **getStakeCall**(`stakerAddress`, `amountToLock`, `stakeInfo`): `Promise`\<[`ExtrinsicPayload`](../type-aliases/ExtrinsicPayload.md)\>

Gets batch call containing the following calls:
 - Claim staker and bonus rewards
 - Lock tokens
 - Cleanup expired entries id user reached maxNumberOfStakedContracts
 - Stake tokens

## Parameters

• **stakerAddress**: `string`

Staker address

• **amountToLock**: `bigint`

Amount to lock in wei

• **stakeInfo**: `StakeInfo`[]

Stake info array containing dApp address and amount to stake (it is possible to stake to multiple dApps in one call)

## Returns

`Promise`\<[`ExtrinsicPayload`](../type-aliases/ExtrinsicPayload.md)\>

The batch call
