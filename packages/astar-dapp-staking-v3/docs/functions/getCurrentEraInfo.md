[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getCurrentEraInfo

# Function: getCurrentEraInfo()

> **getCurrentEraInfo**(`block`?): `Promise`\<`EraInfo`\>

Gets the current era information containing total locked amount, unlocking amount, current and next stake amounts.

## Parameters

• **block?**: `number`

Block to query the era info at. If not provided, era info for the current block will be returned.

## Returns

`Promise`\<`EraInfo`\>

era info

## Defined in

[logic/query.ts:76](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/logic/query.ts#L76)
