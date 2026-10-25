# Records Lifecycle

Phase: 23
Version: 0.23.0

## Purpose

The Records Lifecycle Engine governs how business records are created, retained, archived, deleted and recovered while preserving auditability and legal hold support.

## API Surface

API groups: `/v1/retention` and `/v1/records`

Retention:

- `GET /policies` lists retention policies.
- `POST /policies` creates retention policies.
- `GET /schedules` returns retention schedules.
- `GET /evaluate` evaluates record lifecycle dates.

Records:

- `GET /actions` lists lifecycle actions.
- `POST /actions` schedules lifecycle actions.
- `POST /actions/:id/execute` executes lifecycle actions.
- `POST /actions/:id/recover` recovers records during the recovery window.
- `GET /archives` lists archive jobs.
- `POST /archives` creates archive jobs.
- `POST /archives/:id/complete` completes archive jobs.

## Data Model

- `RecordsLifecyclePolicy` stores retention days, archive timing, deletion mode and recovery window.
- `RecordsLifecycleAction` stores record lifecycle actions and evidence.
- `RecordsArchiveJob` stores archive manifests, counts and storage location metadata.

## Events

- `retention.policy.created`.
- `records.lifecycle.action.created`.
- `records.archive.created`.