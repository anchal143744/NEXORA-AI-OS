# NEXORA Frontend V1 Release Report

Audit date: 2026-09-05

## 1. Overall Frontend Completion

Frontend source completion: 84%.

Runtime release status: RED.

Reason: all V1 page routes and the single-origin health gateway respond through `http://localhost:3000`, and build/typecheck/lint/tests pass, but the real signup flow is blocked by the running Docker API database missing foundational tables such as `Tenant`. A V1 frontend release cannot be marked GREEN until signup, login, onboarding, workspace generation, and protected module API checks pass against the live backend.

## 2. Route-By-Route Status

Total source page routes: 236.

Total routes emitted by the production build: 239, including framework routes such as `_not-found`.

V1 primary routes: 13, plus CRM sub-routes included in this validation pass.

| Route | Purpose | Current Result | API Result | Status |
|---|---|---:|---|---|
| `/` | Landing page | HTTP 200 | No API required | PASS |
| `/auth/signup` | Account creation UI | HTTP 200 | `POST /api/v1/auth/signup` returns 500 because `public."Tenant"` is missing in the API database | BLOCKED |
| `/auth/login` | Login UI | HTTP 200 | Not fully testable because signup is blocked; backend endpoint exists | BLOCKED |
| `/onboarding` | AI business setup wizard | HTTP 200 | Uses real `/api/v1/workspaces/generate`; authenticated execution blocked by signup/database issue | BLOCKED |
| `/dashboard` | Dynamic workspace dashboard | HTTP 200 | Protected data flow blocked by signup/database issue | BLOCKED |
| `/crm` | CRM workspace | HTTP 200 | CRM remains the verified reference implementation, but this pass could not retest it with a new live user | PASS WITH PRIOR EVIDENCE |
| `/crm/leads` | CRM leads | HTTP 200 | CRM runtime/RBAC previously verified | PASS WITH PRIOR EVIDENCE |
| `/crm/opportunities` | CRM opportunities | HTTP 200 | CRM runtime/RBAC previously verified | PASS WITH PRIOR EVIDENCE |
| `/finance` | Finance workspace | HTTP 200 | Real `/api/v1/finance/workspace` client; live authenticated execution blocked | PARTIAL |
| `/people` | People/HR workspace | HTTP 200 | Real `/api/v1/hr/workspace` client; live authenticated execution blocked | PARTIAL |
| `/hr` | HR alias | HTTP 200 | Real `/api/v1/hr/workspace` client; live authenticated execution blocked | PARTIAL |
| `/projects` | Projects workspace | HTTP 200 | Real `/api/v1/projects` and `/api/v1/projects/tasks` client; live authenticated execution blocked | PARTIAL |
| `/analytics` | Analytics summary | HTTP 200 | Real `/api/v1/analytics/summary` client; live authenticated execution blocked | PARTIAL |
| `/ai` | AI V1 workspace | HTTP 200 | Real `/api/v1/ai/providers`, `/api/v1/ai/chat`, `/api/v1/ai/insights`; live authenticated execution blocked | PARTIAL |
| `/settings` | Account/workspace settings | HTTP 200 | Real `/api/v1/auth/me`; live authenticated execution blocked | PARTIAL |

## 3. Functional Features Completed

- Browser API requests remain single-origin through `/api/*`; the web client does not hardcode `localhost:4000`.
- Onboarding business profile persistence now calls the real `POST /api/v1/tenants/businesses` backend endpoint instead of returning a local success object.
- Workspace generation now requires a backend-returned workspace ID; the previous fake `workspace-generated` fallback was removed.
- Workspace generation now derives modules, KPIs, workflows, and agents from the returned backend blueprint instead of fixed frontend lists.
- The older workspace-generation card no longer advances onboarding after API failure.
- The older business setup card now waits for backend persistence success before advancing.
- The older organization step now verifies authenticated organization/workspace context instead of pretending to create it locally.
- Projects V1 now renders an API-backed Projects workspace using `/api/v1/projects`.
- Analytics V1 now renders an API-backed summary using `/api/v1/analytics/summary`.
- AI V1 now renders backend provider status and calls the existing backend AI copilot path without fabricated answers.
- Settings V1 now uses the authenticated backend profile from `/api/v1/auth/me`.
- Finance and People/HR no longer regenerate local static metrics after backend mutations.
- Unsupported V1 UI actions are disabled with honest availability messaging instead of dead/fake controls.

## 4. Features Still Partial

- Finance V1 frontend is API-backed, but live authenticated runtime could not be completed because signup is blocked by the API database schema.
- People/HR V1 frontend is API-backed, but live authenticated runtime could not be completed.
- Projects V1 supports backend-backed list/create/update/status workflows in source, but live authenticated runtime could not be completed.
- Analytics V1 shows authorized backend summary data when authenticated, but live authenticated runtime could not be completed.
- Settings V1 is read-oriented for V1; profile/workspace editing APIs are not exposed as verified V1 controls.
- General AI V1 depends on backend provider configuration. The UI now shows provider unavailable/error states instead of fake answers.

## 5. Broken Features

- New-user signup through `http://localhost:3000/api/v1/auth/signup` fails with HTTP 500 in the running Docker stack.
- API evidence: Prisma reports `The table public.Tenant does not exist in the current database` from `AuthService.bootstrapFirstTenant`.
- Docker PostgreSQL evidence: `information_schema.tables` returned zero rows for `Tenant`, `User`, `Organization`, `Workspace`, `Session`, `Membership`, `Role`, `Permission`, `RolePermission`, and `RoleAssignment`.
- Migration ledger evidence: Docker database has Phase 43 through Phase 50 applied, but does not show the Phase 42 schema baseline as applied.

## 6. API Integration Status

- Single-origin browser gateway: PASS.
- `/api/v1/health/live` through `http://localhost:3000`: PASS, HTTP 200.
- Signup/login/onboarding live API: BLOCKED by Docker database baseline state.
- CRM API: previously verified; not regressed by this frontend pass.
- Finance API client: aligned to implemented backend endpoints only.
- People/HR API client: aligned to `/api/v1/hr/workspace`.
- Projects API client: aligned to `/api/v1/projects` and task endpoints.
- Analytics API client: aligned to `/api/v1/analytics/summary`.
- AI API client: aligned to `/api/v1/ai/providers`, `/api/v1/ai/chat`, and `/api/v1/ai/insights`.
- Settings API client: aligned to `/api/v1/auth/me`.

## 7. Authentication Status

- Frontend auth forms compile and render.
- Auth store persistence and API bearer-token injection remain in place.
- Query cache clears on login/signup/logout to avoid stale cross-session data.
- Real signup runtime is BLOCKED by the Docker database missing `Tenant`.
- Because signup is blocked, login/session persistence/logout/login-again could not be completed in this pass.

## 8. CRUD Status

- CRM: PASS with prior runtime evidence.
- Finance: partial; backend-backed reads and supported invoice/expense actions are wired, but live authenticated runtime blocked.
- People/HR: partial; backend-backed workspace reads/actions are wired, but live authenticated runtime blocked.
- Projects: partial; backend-backed project/task creation and updates are wired, but live authenticated runtime blocked.
- Analytics: read-only V1 summary.
- Settings: read-oriented V1 account/workspace context.

## 9. AI Status

- AI V1 no longer fabricates local answers when backend AI fails.
- Provider status is read from the backend.
- Copilot requests map the frontend prompt to the backend `message` contract.
- Live authenticated AI validation is blocked by signup/database failure.

## 10. UI/UX Issues Fixed

- Removed misleading fake onboarding success states.
- Replaced unsupported Finance actions with disabled controls and clear V1 availability text.
- Added auth-aware loading/sign-in states to Finance and People/HR workspaces.
- Added V1-specific Projects, Analytics, AI, and Settings workspaces that match the real backend boundary.
- Preserved the existing premium dark enterprise visual system and responsive shell.

## 11. Security Issues Discovered

- No new frontend secret exposure was found in the changed files.
- Frontend tenant/workspace headers remain convenience context only; backend JWT/RBAC remains authoritative.
- Live auth security checks could not complete because signup fails before issuing a session.

## 12. Runtime / Browser Errors

- Live route fetches for the V1 page set returned HTTP 200 through `http://localhost:3000`.
- Live API health returned HTTP 200 through `http://localhost:3000/api/v1/health/live`.
- A fresh in-app browser tab loaded the landing page with no captured console warnings or errors.
- Live signup returned HTTP 500 due to the API database missing `public."Tenant"`.
- Authenticated browser console/hydration checks were not completed because the customer journey is blocked before login.

## 13. Tests Executed And Exact Results

- `npm.cmd run typecheck`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run web:lint`: PASS.
- `npm.cmd run test`: PASS.
- `npm.cmd run build`: PASS.
- `npm.cmd run web:v1:smoke`: PASS.
- Live route check through `http://localhost:3000`: PASS for all listed V1 routes and `/api/v1/health/live`.
- Live signup/login/onboarding journey through `http://localhost:3000/api/v1`: FAIL at signup with database table missing.

## 14. Files Modified

- `apps/web/services/onboarding-api.ts`
- `apps/web/services/workspace-intelligence-api.ts`
- `apps/web/features/onboarding/workspace-auto-generation.tsx`
- `apps/web/features/onboarding/business-setup-wizard.tsx`
- `apps/web/features/onboarding/organization-creation.tsx`
- `scripts/frontend-v1-smoke-audit.mjs`
- `NEXORA_FRONTEND_V1_RELEASE_REPORT.md`

## 15. Remaining Blockers

- RED: Docker API database is missing foundational V1 tables. Signup cannot work until the Phase 42 baseline strategy is safely reconciled/applied to the database that the API container actually uses.
- RED: Authenticated V1 customer journey cannot be verified until signup/login works.
- YELLOW: Finance, People/HR, Projects, Analytics, AI, and Settings are now API-backed in source but still need live authenticated runtime verification after the database blocker is resolved.

## 16. Exact Commands Needed To Run The Application

From `C:\Dev\NEXORA_AI`:

```powershell
npm.cmd run dev
```

For the current Docker-backed local stack, the database baseline blocker must be resolved before the signup flow can pass. Do not run destructive database commands. The safe next action is to perform the approved Phase 42 baseline reconciliation procedure against the Docker database with backup/schema-diff evidence.

## 17. Final Release Recommendation

RED = V1 has a release-blocking backend database problem.

The frontend source is much closer to V1 release quality after this pass: it builds, passes lint/typecheck/tests, routes through one public origin, and no longer hides onboarding/API failures behind fake success states. However, NEXORA V1 cannot be released until the running API database contains the foundational schema and the full authenticated flow is re-tested end-to-end.
