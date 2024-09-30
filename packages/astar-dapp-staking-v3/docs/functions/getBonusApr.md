[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getBonusApr

# Function: getBonusApr()

> **getBonusApr**(`simulatedVoteAmount`, `block`?): `Promise`\<`object`\>

Calculates the bonus APR
Usera is eligible for dApp staking bonus if they stake during the voting period and didn't unstake until the end of staking period.

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
