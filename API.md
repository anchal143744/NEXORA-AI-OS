# NEXORA AI OS API

## Base URL

```text
http://localhost:4000/api/v1
```

Swagger/OpenAPI JSON:

```text
http://localhost:4000/docs-json
```

## Authentication

```http
Authorization: Bearer <access_token>
X-Tenant-Id: <tenant_id>
X-Workspace-Id: <workspace_id>
X-Request-Id: <client_request_id>
```

## Core API Groups

- /auth
- /users
- /tenants
- /workspaces
- /rbac
- /audit
- /activity
- /notifications
- /workflows
- /ai
- /agents
- /crm
- /finance
- /hr
- /projects
- /analytics
- /search
- /knowledge-graph
- /operations

## Example Login Request

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "change-me"
}
```

## Example Authenticated Request

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
X-Tenant-Id: <tenant_id>
X-Workspace-Id: <workspace_id>
```

## OpenAPI Validation

The release E2E script verifies OpenAPI generation and route health through `npm.cmd run api:e2e`.

## Production Launch Validation

Production API release requires `/api/v1/health/live`, `/api/v1/health/ready`, `/docs-json` and authenticated tenant-scoped workflows to pass against the hosted API URL.
