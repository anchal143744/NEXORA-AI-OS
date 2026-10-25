# Data Governance

Phase: 23
Version: 0.23.0

## Purpose

The Data Governance Engine gives NEXORA a tenant-aware foundation for data cataloging, classification, ownership, lineage and quality monitoring.

## API Surface

API group: `/v1/data-governance`

- `GET /catalog` lists governed data assets.
- `POST /catalog` creates a data catalog asset.
- `POST /classifications` records data classification events.
- `POST /ownership` assigns business owners and stewards.
- `GET /lineage` lists data lineage edges.
- `POST /lineage` records source-to-target data lineage.
- `GET /quality` lists quality checks.
- `POST /quality/checks` executes quality checks.

## Data Model

- `DataCatalogAsset` stores asset identity, type, owner, steward, classification and quality score.
- `DataClassificationEvent` stores classification history and evidence.
- `DataOwnershipAssignment` stores owner, steward and department ownership records.
- `DataLineageEdge` stores source-to-target lineage.
- `DataQualityCheck` stores quality results, thresholds and issues.

## Events

- `data.governance.asset.created`.
- `data.classified`.
- `data.lineage.recorded`.
- `data.quality.checked`.