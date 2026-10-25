# Data Contracts

Phase 37 adds the enterprise Data Contract Registry for NEXORA AI.

## Capabilities

- Tenant-scoped and workspace-scoped data contracts.
- Contract versions with compatibility modes, publication dates and deprecation dates.
- Contract schema storage for API, event, analytics and partner data products.
- Quality rules, consumer metadata, tags and ownership.
- Event publication for contract and version creation.

## Database

- DataContract
- ContractVersion

The existing ApiKey model is reused for governed key issuance instead of creating a duplicate key store.
