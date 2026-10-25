# Threat Detection

Phase 33 adds a threat detection foundation that stores detection rules, threat objects and threat events.

## Core Objects

- `ThreatDetectionRule`
- `SecurityThreat`
- `ThreatEvent`

## Engine Behavior

- Rules define condition logic, response actions and severity.
- Threats store indicators, tactics, mitigation and confidence.
- Threat events correlate rules, threats and incidents for response workflows.
- Create operations publish domain events for realtime monitoring and audit trails.