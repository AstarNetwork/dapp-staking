[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getStakeCall

# Function: getStakeCall()

> **getStakeCall**(`stakerAddress`, `amountToLock`, `stakeInfo`): `Promise`\<`ExtrinsicPayload`\>

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

`Promise`\<`ExtrinsicPayload`\>

The batch call

## Defined in

[logic/stake.ts:42](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/logic/stake.ts#L42)
