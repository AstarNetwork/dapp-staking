[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getProtocolState

# Function: getProtocolState()

> **getProtocolState**(`block`?): `Promise`\<[`ProtocolState`](../interfaces/ProtocolState.md)\>

Gets the current protocol state containing information about current era, subperiod, etc...

## Parameters

• **block?**: `number`

Block to query the state at. If not provided, state for the current block will be returned.

## Returns

`Promise`\<[`ProtocolState`](../interfaces/ProtocolState.md)\>

protocol state
