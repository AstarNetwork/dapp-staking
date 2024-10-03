[**@astar-network/dapp-staking-v3**](../README.md) • **Docs**

***

[@astar-network/dapp-staking-v3](../globals.md) / ProtocolState

# Interface: ProtocolState

General information & state of the dApp staking protocol.

## Properties

### era

> **era**: `number`

Ongoing era number.

***

### maintenance

> **maintenance**: `boolean`

`true` if pallet is in maintenance mode (disabled), `false` otherwise.

***

### nextEraStart

> **nextEraStart**: `number`

Block number at which the next era should start.

***

### periodInfo

> **periodInfo**: [`PeriodInfo`](PeriodInfo.md)

Ongoing period type and when is it expected to end.
