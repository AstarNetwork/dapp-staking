[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getCurrentEraInfo

# Function: getCurrentEraInfo()

> **getCurrentEraInfo**(`block`?): `Promise`\<[`EraInfo`](../interfaces/EraInfo.md)\>

Gets the current era information containing total locked amount, unlocking amount, current and next stake amounts.

## Parameters

• **block?**: `number`

Block to query the era info at. If not provided, era info for the current block will be returned.

## Returns

`Promise`\<[`EraInfo`](../interfaces/EraInfo.md)\>

era info
