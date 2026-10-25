
# Contracts Center

The contracts center manages enterprise revenue contracts and amendments. Contracts are connected to revenue accounts and preserve value, ARR, renewal timing, terms, obligations and contract status.

## Entities

- RevenueContract stores contract number, title, type, status, currency, value, ARR and renewal dates.
- ContractAmendment stores amendment number, type, approval payload, commercial deltas and effective dates.
- RevenueEvent records contract-related lifecycle activity for audit and downstream automations.

## APIs

- /v1/contracts
- /v1/contracts/dashboard
- /v1/contracts/amendments

## Controls

Contracts and amendments are tenant-scoped, workspace-aware, soft-deletable and indexed by status, contract type, renewal dates and related account.
