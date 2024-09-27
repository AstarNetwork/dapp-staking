[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getUnstakeCall

# Function: getUnstakeCall()

> **getUnstakeCall**(`stakerAddress`, `contractAddress`, `amount`): `Promise`\<`ExtrinsicPayload`\>

Gets batch call containing the following calls:
 - Claim staker and bonus rewards
 - Unstake tokens
 - Unlock tokens

## Parameters

• **stakerAddress**: `string`

• **contractAddress**: `string`

• **amount**: `bigint`

## Returns

`Promise`\<`ExtrinsicPayload`\>

## Defined in

[logic/unstake.ts:30](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/logic/unstake.ts#L30)
