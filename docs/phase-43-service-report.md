# Phase 43 Service Report

Version: 0.43.0
Date: 2026-06-14

## Services Added

- ManufacturingCommandService: write-side service for all manufacturing create operations and event publication.
- ManufacturingQueryService: read-side service for tenant-scoped lists, filters and dashboards.
- ManufacturingCqrsService: command/query handler registry and CQRS facade.
- ManufacturingService: aggregate dashboard, readiness and CQRS exposure.
- manufacturing-calculations.ts: deterministic helpers for yield, OEE, risk and unit cost calculations.

## Event-Driven Coverage

- Manufacturing plant, line, work center, resource and event creation.
- BOM and BOM component creation.
- Production plan, schedule, order, operation, execution and material requirement creation.
- Telemetry, quality, maintenance, cost, metric, risk, digital twin and copilot events.

