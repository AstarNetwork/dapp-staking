[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / canUnstake

# Function: canUnstake()

> **canUnstake**(`stakerAddress`, `dappAddress`, `amount`, `getProtocolStateCall`, `getStakerInfoCall`): `Promise`\<[`boolean`, `string`]\>

Checks if staker can un-stake the given amount from the dApp.

## Parameters

• **stakerAddress**: `string`

The staker address.

• **dappAddress**: `string`

The dApp to un-stake from

• **amount**: `bigint`

The amount to un-stake

• **getProtocolStateCall** = `getProtocolState`

Method to get the protocol state (optional, used for testing)

• **getStakerInfoCall** = `getStakerInfo`

Method to get the staker info (optional, used for testing)

## Returns

`Promise`\<[`boolean`, `string`]\>

A tuple containing a boolean indicating if the staker can un-stake and a message explaining a reason.
If the method returns true, the second element of the tuple can contain a warning message or it is empty.
