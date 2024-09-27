[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getTotalIssuance

# Function: getTotalIssuance()

> **getTotalIssuance**(`blockNumber`?): `Promise`\<`bigint`\>

Get the total token issuance of the network.

## Parameters

• **blockNumber?**: `number`

Block number to query the total issuance at. If not provided, the total issuance at the current block will be returned.

## Returns

`Promise`\<`bigint`\>

Total issuance of the network.

## Defined in

[logic/balances.ts:9](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/logic/balances.ts#L9)
