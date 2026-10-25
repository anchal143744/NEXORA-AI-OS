# NEXORA Frontend Release Report

Audit date: 2026-09-05

## 1. Summary

The frontend V1 scope is frozen around the production customer path: landing, authentication, onboarding, dashboard, CRM, Finance, People/HR, Projects, Analytics, AI, and Settings. Future phase routes remain in source for development, but normal V1 workspace navigation is bounded by the module registry.

## 2. Route Inventory

- Total Next.js page routes found: 236
- V1 primary routes: 13
- V1 CRM sub-routes reviewed: 2
- Future/scaffold route families: present, hidden from normal V1 navigation unless `NEXT_PUBLIC_NEXORA_SHOW_V2_MODULES=true`

## 3. Frontend Fixes Applied

- Onboarding now redirects to `/dashboard` after successful workspace generation.
- Generated business setup profile is persisted to a durable workspace profile key before the onboarding autosave is cleared.
- Workspace provider hydrates generated workspace configuration after client mount, preserving deterministic SSR while allowing client personalization.
- V1 module registry now routes Projects to `/projects` and AI to `/ai`.
- Project workspace actions now link back to `/dashboard` and `/ai` instead of future/internal routes.
- Finance and People stores now start empty instead of preloading local demo records.
- Finance and People hooks no longer convert API failures into local fake success data.
- Finance and People workspace shells now show loading, error, retry, and empty states around real backend queries.
- Auth login/signup/logout clear React Query cache so stale data from a previous user/workspace does not remain visible.
- General AI copilot no longer falls back to local generated answers when backend AI fails.
- AI chat request now maps the frontend `prompt` to the backend `message` contract.
- Unsupported V1 create buttons for invoices and employees are disabled instead of acting as dead controls.
- Added `npm run web:v1:smoke` and included it in `npm run test`.

## 4. Authentication Status

Frontend authentication uses the existing backend `/api/v1/auth/*` endpoints through the single-origin `/api/*` Next.js rewrite. Session persistence remains stored in `localStorage` under `nexora.auth.session`, and API requests automatically attach the bearer token and available tenant, organization, and workspace context.

There is no Next.js middleware route guard in `apps/web`. Protected-route enforcement remains backend-authoritative; frontend protection is UI/provider-level only.

## 5. API Integration Status

- CRM: API-backed and previously runtime verified with RBAC, tenant isolation, AI context isolation, and persistence.
- Finance: API-backed through `/api/v1/finance/workspace`; fake frontend fallback removed.
- People/HR: API-backed through `/api/v1/hr/workspace`; fake frontend fallback removed.
- Onboarding: API-backed through `/api/v1/workspaces/generate`.
- AI copilot: API-backed through `/api/v1/ai/chat` and `/api/v1/ai/insights`; fake frontend fallback removed.
- Analytics: still partially local/static in the frontend and must not be treated as fully V1 verified.
- Projects: currently an integrated workspace shell, not a verified CRUD project-management frontend.
- Settings: partially local/settings shell, not fully API-verified.

## 6. Loading, Empty, And Error States

- Global `app/loading.tsx`, `app/error.tsx`, and `app/not-found.tsx` exist.
- Finance and People now show explicit loading, retryable error, and empty states.
- CRM already has API-driven state handling in its workspace hooks.
- Analytics, Projects, AI Agents workspace, and Settings still need deeper runtime state verification before they can be called complete.

## 7. Security Notes

- Browser API calls use `/api/*`; the frontend API client does not hardcode `localhost:4000`.
- Frontend tenant/workspace headers are convenience context only; backend JWT/RBAC/tenant isolation remains authoritative.
- Query cache is cleared on login, signup, and logout to reduce cross-session stale data risk.
- Client-side permission visibility is not considered a security boundary.

## 8. Validation Status

Validation commands for this stabilization pass:

- `npm.cmd run typecheck`: PASS
- `npm.cmd run lint`: PASS
- `npm.cmd run web:lint`: PASS
- `npm.cmd run test`: PASS
- `npm.cmd run build`: PASS
- `npm.cmd run web:v1:smoke`: PASS through `npm.cmd run test`

Host-side frontend runtime smoke:

- `npm.cmd run web:dev`: PASS, Next.js ready on `http://localhost:3000`
- V1 route fetches against `http://localhost:3000`: PASS for `/`, `/auth/login`, `/auth/signup`, `/onboarding`, `/dashboard`, `/crm`, `/finance`, `/people`, `/hr`, `/projects`, `/analytics`, `/ai`, and `/settings`
- `/api/v1/health/live` through the Next.js gateway: BLOCKED, returned HTTP 500 because the backend target `http://localhost:4000` refused the connection

Environment blocker:

- `docker info`: FAIL, Docker client is installed but the Docker daemon is unavailable at `npipe:////./pipe/dockerDesktopLinuxEngine`

## 9. Remaining Blockers

- Docker Desktop engine is unavailable in the current environment, so single-command `npm run dev`, backend startup through the Docker source of truth, and full live browser/backend validation remain blocked until Docker starts.
- Analytics V1 still contains local/static frontend workspace data and is not fully backend-verified.
- Projects V1 is a configuration-driven integrated workspace shell, not a verified projects CRUD frontend.
- Settings V1 is not fully API-verified.
- General AI provider runtime depends on backend AI provider configuration; frontend now fails visibly instead of pretending local AI success.

## 10. Release Position

Frontend V1 is substantially more honest and stable after this pass. It should be marked YELLOW, not GREEN, until Docker-backed live runtime validation and the remaining partial V1 modules are verified end-to-end against the running backend.
