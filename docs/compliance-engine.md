# Compliance Engine

The Compliance Engine connects global compliance frameworks to country-specific rules, controls, data policies, retention policies and privacy controls.

## Supported Frameworks

- GDPR
- SOC2
- ISO27001
- CCPA
- HIPAA
- PDPA
- LGPD
- PIPEDA

## Core Tables

- `compliance_frameworks`
- `compliance_rules`
- `compliance_controls`
- `data_policies`
- `retention_policies`
- `privacy_controls`
- `country_compliance`

## Main APIs

- `GET /v1/localization/compliance/frameworks`
- `GET /v1/localization/compliance/rules`
- `GET /v1/localization/compliance/controls`
- `GET /v1/localization/compliance/data-policies`

## Tenant Boundary

Compliance frameworks and controls remain tenant scoped. Country compliance metadata links global country requirements to tenant compliance frameworks.