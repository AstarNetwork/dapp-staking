[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getProtocolState

# Function: getProtocolState()

> **getProtocolState**(`block`?): `Promise`\<`ProtocolState`\>

Gets the current protocol state containing information about current era, subperiod, etc...

## Parameters

• **block?**: `number`

Block to query the state at. If not provided, state for the current block will be returned.

## Returns

`Promise`\<`ProtocolState`\>

protocol state

## Defined in

[logic/query.ts:36](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/logic/query.ts#L36)
