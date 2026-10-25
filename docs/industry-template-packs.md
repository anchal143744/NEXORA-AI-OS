# Industry Template Packs

Phase: 21
Version: 0.21.0

## Purpose

Industry template packs let NEXORA generate business operating structures for common industries without hardcoding navigation or module behavior in the frontend.

## Supported Templates

- Healthcare.
- Education.
- Manufacturing.
- Retail.
- Professional services.

## Backend Surface

API group: `/v1/industry-templates`

- `GET /` lists template packs by industry or status.
- `POST /` creates a template pack.
- `POST /bootstrap` creates or updates the default Phase 21 template packs.
- `POST /:id/install` installs a template into a tenant/workspace and activates modules when `businessId` is provided.

## Data Model

`IndustryTemplatePack` stores modules, workflows, dashboards, KPIs, AI agents, navigation and compliance metadata for an industry.

## Installation Behavior

Template installation increments `installCount`, publishes an ecosystem event and returns a workspace blueprint. When a `businessId` is included, NEXORA writes real `ModuleActivation` records for the template's modules.

## Events

- `industry_template.installed`