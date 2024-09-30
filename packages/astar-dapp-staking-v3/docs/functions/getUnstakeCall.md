[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getUnstakeCall

# Function: getUnstakeCall()

> **getUnstakeCall**(`stakerAddress`, `contractAddress`, `amount`): `Promise`\<[`ExtrinsicPayload`](../type-aliases/ExtrinsicPayload.md)\>

Gets batch call containing the following calls:
 - Claim staker and bonus rewards
 - Unstake tokens
 - Unlock tokens

## Parameters

• **stakerAddress**: `string`

• **contractAddress**: `string`

• **amount**: `bigint`

## Returns

`Promise`\<[`ExtrinsicPayload`](../type-aliases/ExtrinsicPayload.md)\>
