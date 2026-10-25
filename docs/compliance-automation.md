# Compliance Automation

Phase: 23
Version: 0.23.0

## Purpose

Compliance Automation monitors governance posture and generates audit evidence for global businesses. Phase 23 focuses on GDPR and CCPA foundations while preserving compatibility with broader frameworks.

## API Surface

API group: `/v1/compliance`

- `GET /frameworks` returns supported compliance frameworks and controls.
- `GET /monitoring` lists monitoring runs.
- `POST /monitoring` starts monitoring runs.
- `POST /monitoring/:id/complete` completes monitoring and records findings.
- `GET /evidence` lists evidence packages.
- `POST /evidence` generates evidence packages.
- `GET /gdpr/readiness` returns GDPR readiness posture.
- `GET /ccpa/readiness` returns CCPA readiness posture.

## Data Model

- `ComplianceEvidencePackage` stores generated evidence by framework, control and source.
- `ComplianceMonitoringRun` stores control checks, findings, risk score and completion state.

## Evidence Sources

- Data catalog and classification coverage.
- Privacy requests and consent records.
- Retention policies and records lifecycle actions.
- Audit events and generated compliance packages.

## Events

- `compliance.evidence.generated`.
- `compliance.monitoring.completed`.