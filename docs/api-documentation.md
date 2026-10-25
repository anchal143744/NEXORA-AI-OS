# API Documentation

## Base URL

Local API base URL: http://localhost:4000/api

API versioning uses URI versioning. Versioned endpoints are exposed under /api/v1.

## Platform API Statistics

- Controllers: 313
- Method-level endpoints: 2002

## Critical Auth APIs

- POST /api/v1/auth/signup
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- POST /api/v1/auth/refresh
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password
- GET /api/v1/auth/me
- POST /api/v1/auth/email/request-verification
- POST /api/v1/auth/email/verify

## Critical Workspace APIs

- POST /api/v1/adaptive-workspace/generate-workspace
- GET /api/v1/adaptive-workspace/blueprints
- GET /api/v1/modules
- CRM, HR, Finance, Analytics and AI endpoints are present through their module controllers.

## Response Envelope

The backend returns normalized responses using an envelope shaped like:

- success
- data
- meta

The Phase 71 frontend API client unwraps data for application services.

## Security Headers

Protected endpoints require bearer access tokens and tenant/workspace context. The frontend sends Authorization, x-tenant-id and x-workspace-id when a session is present.

## Known API Gaps

- /api/v1/invites is not implemented for team invitation.
- OAuth authorization URL generation exists, but callback completion is not proven.
- AI Copilot chat endpoints generate responses and audit logs but do not yet dispatch business actions from natural-language commands.
- Live OpenAPI export was not regenerated during Phase 71.
