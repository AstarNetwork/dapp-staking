[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getStakerInfo

# Function: getStakerInfo()

> **getStakerInfo**(`stakerAddress`, `includePreviousPeriods`): `Promise`\<`Map`\<`string`, `SingularStakingInfo`\>\>

Gets the staker information for the given address.
The staker info contains info about all staker for the given address.

## Parameters

• **stakerAddress**: `string`

Staker address.

• **includePreviousPeriods**: `boolean` = `false`

If true, the staker info will contain info about all previous periods.

## Returns

`Promise`\<`Map`\<`string`, `SingularStakingInfo`\>\>
