# Security Intelligence

Phase 33 adds the enterprise security command plane for NEXORA AI.

## Capabilities

- Security Command Center for incidents, alerts, investigations and posture.
- Security Intelligence Dashboard for threat, risk, audit and zero trust signals.
- Compliance Monitoring for violations, audit records and evidence readiness.
- Tenant and workspace scoped security telemetry across every endpoint.

## API Groups

- `/v1/security`
- `/v1/security-intelligence`
- `/v1/security-incidents`
- `/v1/security-alerts`
- `/v1/security-risk`

## Data Boundaries

All records include `tenantId`, optional `workspaceId`, timestamps, soft deletes and tenant-aware indexes. Services resolve tenant and workspace context through the shared tenant context layer.