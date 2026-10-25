# Security Audit

Phase 33 adds enterprise security audit and compliance monitoring.

## Audit Records

`SecurityAudit` stores security actions, actors, severity, source payload and event time.

## Compliance Violations

`ComplianceViolation` records framework, control ID, severity, remediation, evidence and resolution state.

## Eventing

Security audit and compliance violation creation publish domain events for realtime command center monitoring and notification workflows.