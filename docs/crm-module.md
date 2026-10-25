# CRM Module

The CRM module implements leads, customers, pipelines, and opportunities. All records are tenant and workspace scoped.

APIs:

- `POST /api/v1/crm/leads`
- `GET /api/v1/crm/leads`
- `PATCH /api/v1/crm/leads/:id`
- `DELETE /api/v1/crm/leads/:id`
- `POST /api/v1/crm/customers`
- `GET /api/v1/crm/customers`
- `PATCH /api/v1/crm/customers/:id`
- `DELETE /api/v1/crm/customers/:id`
- `POST /api/v1/crm/pipelines`
- `POST /api/v1/crm/opportunities`
- `PATCH /api/v1/crm/opportunities/:id`
- `POST /api/v1/crm/opportunities/:id/close`
