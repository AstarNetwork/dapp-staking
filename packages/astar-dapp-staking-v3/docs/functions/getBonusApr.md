[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getBonusApr

# Function: getBonusApr()

> **getBonusApr**(`simulatedVoteAmount`, `block`?): `Promise`\<`object`\>

Calculates the bonus APR

## Parameters

• **simulatedVoteAmount**: `number` = `1000`

Simulated vote amount to calculate the APR for

• **block?**: `number`

Block to query the state at. If not provided, state for the current block will be returned.

## Returns

`Promise`\<`object`\>

Bonus APR %

### simulatedBonusPerPeriod

> **simulatedBonusPerPeriod**: `number`

### value

> **value**: `number`

## Defined in

[logic/apr.ts:63](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/logic/apr.ts#L63)
