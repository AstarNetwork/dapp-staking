[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / getClaimBonusRewardsCalls

# Function: getClaimBonusRewardsCalls()

> **getClaimBonusRewardsCalls**(`stakerAddress`): `Promise`\<[`ExtrinsicPayload`](../type-aliases/ExtrinsicPayload.md)[] \| `undefined`\>

Creates calls to be executed to claim bonus rewards.
Bonus rewards should be claimed for each dApp contract separately.

## Parameters

• **stakerAddress**: `string`

Staker address

## Returns

`Promise`\<[`ExtrinsicPayload`](../type-aliases/ExtrinsicPayload.md)[] \| `undefined`\>

Extrinsics to be signed and executed.
