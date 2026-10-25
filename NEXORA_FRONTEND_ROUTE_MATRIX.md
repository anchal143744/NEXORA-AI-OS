# NEXORA Frontend Route Matrix

Audit date: 2026-09-05

This matrix reflects the current V1 frontend scope after the 2026-09-05 stabilization pass. PASS requires verified route source, build compatibility, and runtime evidence where the route is public. BLOCKED means the route renders but the authenticated workflow cannot complete because the running API database is missing foundational V1 tables.

| Route | V1/Future | UI | API | Auth | RBAC | CRUD | Responsive | Tests | Status |
|---|---|---|---|---|---|---|---|---|---|
| `/` | V1 | Premium landing page | None required | Public | N/A | N/A | Build-validated | V1 smoke route check | PASS |
| `/auth/login` | V1 | Auth form with loading/error states | `/api/v1/auth/login` | Public login | Backend-enforced after login | N/A | Build-validated | V1 smoke route check | PASS |
| `/auth/signup` | V1 | Signup form with validation | `/api/v1/auth/signup` | Public signup | Backend-enforced after signup | Creates account/org context | Build-validated | Live API returned 500 because `Tenant` table is missing | BLOCKED |
| `/onboarding` | V1 | AI business setup wizard | `/api/v1/workspaces/generate` | Required for generation | Backend-enforced | Workspace generation | Build-validated | API-backed source check passed; live execution blocked by signup/database issue | BLOCKED |
| `/dashboard` | V1 | Dynamic workspace dashboard shell | Workspace config plus module APIs | Required for real data | Backend-enforced by downstream APIs | Read dashboard/config | Build-validated | Route 200; protected data flow blocked by signup/database issue | BLOCKED |
| `/crm` | V1 | CRM workspace | `/api/v1/crm/workspace` | Required | Backend CRM RBAC verified separately | Lead/stage/proposal workflows where supported | Build-validated | V1 smoke route check plus existing CRM runtime tests | PASS |
| `/crm/leads` | V1 sub-route | CRM leads workspace | `/api/v1/crm/*` | Required | Backend CRM RBAC verified separately | Lead workflows where supported | Build-validated | Covered by CRM runtime tests | PASS |
| `/crm/opportunities` | V1 sub-route | CRM opportunities workspace | `/api/v1/crm/*` | Required | Backend CRM RBAC verified separately | Opportunity stage workflows where supported | Build-validated | Covered by CRM runtime tests | PASS |
| `/finance` | V1 | Finance workspace with loading/error/empty states | `/api/v1/finance/workspace` | Required | Backend-enforced | Supported invoice/expense actions; unsupported actions disabled | Build-validated | API-backed source check passed; live execution blocked by signup/database issue | PARTIAL |
| `/people` | V1 | People workspace with loading/error/empty states | `/api/v1/hr/workspace` | Required | Backend-enforced | Supported HR actions only | Build-validated | API-backed source check passed; live execution blocked by signup/database issue | PARTIAL |
| `/hr` | V1 alias | People workspace alias | `/api/v1/hr/workspace` | Required | Backend-enforced | Same as People | Build-validated | API-backed source check passed; live execution blocked by signup/database issue | PARTIAL |
| `/projects` | V1 | API-backed Projects workspace | `/api/v1/projects`, `/api/v1/projects/tasks` | Required | Backend-enforced | Project/task create, update, and task status actions where supported | Build-validated | V1 smoke API contract check passed; live execution blocked by signup/database issue | PARTIAL |
| `/analytics` | V1 | Backend summary workspace | `/api/v1/analytics/summary` | Required | Backend-enforced | Read-only V1 summary | Build-validated | V1 smoke API contract check passed; live execution blocked by signup/database issue | PARTIAL |
| `/ai` | V1 | AI provider status and copilot workspace | `/api/v1/ai/providers`, `/api/v1/ai/chat`, `/api/v1/ai/insights` | Required for backend AI | Backend-enforced for `/api/v1/ai/*` | AI chat/insights where provider is configured | Build-validated | V1 smoke route and no-fallback checks passed; live execution blocked by signup/database issue | PARTIAL |
| `/settings` | V1 | Account-backed settings workspace | `/api/v1/auth/me` | Required for protected settings | Backend-enforced for profile read | Read-oriented V1 settings | Build-validated | V1 smoke API contract check passed; live execution blocked by signup/database issue | PARTIAL |

## Future Route Boundary

The repository currently contains 236 Next.js source page files, and the production build emits 239 routes including framework routes such as `_not-found`. V1 navigation is limited to CRM, Finance, People/HR, Projects, Analytics, AI, and Settings through the workspace module registry unless `NEXT_PUBLIC_NEXORA_SHOW_V2_MODULES=true` is explicitly set.

Future or non-V1 route families present in source include `ai-agents`, `autonomous-enterprise`, `autonomous-operations`, `enterprise-agi`, `enterprise-digital-twin`, `ecosystem-marketplace`, `growth-program`, `launch-readiness`, `production-deployment`, `public-beta`, and `public-launch`.
