# Synchronization Engine

Phase: 22
Version: 0.22.0

## Purpose

The synchronization engine coordinates reconnect handling, incremental synchronization, queue replay and conflict recovery across browser, desktop, tablet and mobile devices.

## API Surface

API group: `/v1/sync`

- `GET /status` returns latest sync snapshots, cursors, pending queue count and conflict count.
- `POST /start` starts a sync run snapshot.
- `POST /runs/:id/complete` completes a sync run and publishes completion events.
- `POST /reconnect` starts automatic recovery using cursor resume and queue replay.
- `GET /cursors` lists module/device cursors.
- `POST /cursors` creates or updates a cursor.
- `GET /changes` lists incremental queued changes.

## Data Model

- `SyncStatusSnapshot` stores run status, direction, modules, pending/synced/failed item counts, conflicts and latency.
- `SyncCursor` stores module-specific cursor values, change tokens and last sync timestamps.
- `OfflineQueueItem` and `OfflineConflict` feed sync changes and conflict recovery.

## Recovery Strategy

- Automatic reconnect handling.
- Exponential backoff metadata.
- Resume from cursor.
- Queue replay.
- Conflict scan and administrator resolution.

## Events

- `sync.started`.
- `sync.completed`.
- `sync.conflict.detected`.
- `offline.queue.item.synced`.