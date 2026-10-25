# Deployment Governance

Phase 19 adds deployment governance and change management foundations.

## Capabilities

- Environment management.
- Release draft and approval tracking.
- Feature flag creation and updates.
- Rollback controls.
- Change request tracking.

## API Group

- `/v1/deployment-governance`

## Data Models

- `DeploymentEnvironment`
- `ReleaseControl`
- `FeatureFlag`
- `ChangeRequest`

## Governance Notes

Release approval and rollback operations create admin operation records and publish domain events. Feature flag updates publish realtime event bus notifications for operational monitoring.
