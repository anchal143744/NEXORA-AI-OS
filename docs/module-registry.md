# Module Registry

The module registry exposes adaptive business modules and persists per-tenant, per-business activation state through `ModuleActivation`.

APIs:

- `GET /api/v1/modules/discover`
- `GET /api/v1/modules/:moduleKey/metadata`
- `GET /api/v1/modules/businesses/:businessId`
- `POST /api/v1/modules/activate`

Supported modules: finance, crm, hr, inventory, projects, tasks, documents, analytics.
