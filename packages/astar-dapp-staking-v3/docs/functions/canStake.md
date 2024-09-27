[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / canStake

# Function: canStake()

> **canStake**(`stakerAddress`, `stakes`, `getAccountLedgerCall`, `getProtocolStateCall`): `Promise`\<[`boolean`, `string`]\>

Checks if the staker can stake the provided stakes.

## Parameters

• **stakerAddress**: `string`

Staker address

• **stakes**: `StakeInfo`[]

Stakes array containing dApp address and amount to stake.

• **getAccountLedgerCall** = `getAccountLedger`

Method to get the account ledger (optional, used for testing).

• **getProtocolStateCall** = `getProtocolState`

Method to get the protocol state (optional, used for testing).

## Returns

`Promise`\<[`boolean`, `string`]\>

A tuple containing a boolean indicating if the staker can stake and a message explaining a reason.
If the method returns true, the second element of the tuple can contain a warning message or it is empty.

## Defined in

[logic/stake.ts:120](https://github.com/AstarNetwork/dapp-staking/blob/0eeb0e659e92439d12d988aa8e04d80fa51d55f9/packages/astar-dapp-staking-v3/src/logic/stake.ts#L120)
