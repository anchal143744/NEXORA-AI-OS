# Offline Operations

Phase: 22
Version: 0.22.0

## Purpose

The offline operations engine lets NEXORA continue business activity when connectivity is interrupted. It supports encrypted local storage metadata, offline queues, module-level permission controls and conflict resolution.

## API Surface

API group: `/v1/offline`

- `GET /policies` returns local cache and offline module policies.
- `POST /policies/cache` creates or updates cache policy.
- `POST /policies/modules` creates or updates offline module policy.
- `GET /stores` lists offline stores.
- `POST /stores` creates an offline store.
- `GET /queue` lists queued offline operations.
- `POST /queue` queues task, workflow, AI or record operations.
- `POST /queue/:id/execute` executes or validates queued operations.
- `GET /conflicts` lists sync conflicts.
- `POST /conflicts/:id/resolve` resolves conflicts.

## Supported Modules

- CRM.
- Finance.
- HR.
- Inventory.
- Projects.
- Workflows.
- AI Agents.

## Data Model

- `OfflineStore` tracks encrypted local store metadata.
- `LocalCachePolicy` governs cache strategy, TTL, record limits and offline mutation rules.
- `OfflineModulePolicy` defines module support, write permission and conflict policy.
- `OfflineQueueItem` stores offline task, workflow, AI and record operations.
- `OfflineConflict` stores local/remote version conflicts and resolution strategy.

## Security

Offline operations require encrypted cache metadata, device trust, offline permissions and module-level write validation before queue execution.