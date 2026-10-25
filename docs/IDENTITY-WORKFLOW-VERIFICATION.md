# Signup, business setup and multi-tenant workflow

Verified 16 October 2026. This increment completes the connected retail entry flow and adds authorized business/workspace switching. It does not claim the entire enterprise menu, AI execution or production deployment is complete.

Subsequent desktop delivery adds independent dashboard resource permissions, 261 source tests, 64 workflow tests and encrypted backup restore verification. See [the later desktop report](DESKTOP-VERIFICATION.md); counts and remaining widget limitations below describe this earlier checkpoint.

## User workflow

1. Open `/login` or `/signup`. Signup requires the user's own name, email, password and matching confirmation. Passwords are hashed with Argon2id. No business balances or customer records are seeded.
2. Signup provisions a tenant, organization, business, user, credential and both memberships in a transaction. A stable signup request key prevents duplicate account provisioning on an unchanged retry. Credentials still have to match before a retry can access that account.
3. New or not-yet-configured workspaces go to `/business-setup`. The owner saves business/workspace names, shop category, country, currency, timezone preference and module choices. Profile changes, setup completion, preferences and audit commit together. Existing business records are preserved. Reporting currency cannot change after financial/stock records exist.
4. Completed setup opens `/dashboard`; lists, financial totals, activity and alerts use saved records for the signed-in scope. Module visibility follows the saved workspace choices. The scope remains retail/shop; a category label does not create an unimplemented industry workflow.
5. The header lists only organizations/workspaces where the current user has active persisted membership. Owners can add a business within their account or a workspace within their current organization. Each new workspace begins empty and requires its own setup.
6. Switching validates the target on the server, issues a replacement session and revokes the old session in one transaction. Audit failure rolls back both operations. Concurrent switches permit exactly one replacement. Refresh tokens retain the selected organization/workspace and validate membership again.
7. During a switch, the old dashboard is unmounted, in-flight queries are cancelled and caches are cleared before the new dashboard appears. Failed switches show a persistent error. Query and navigation preferences are scoped to user/workspace.
8. Logout revokes the session and clears the refresh cookie. Password change requires the authenticated user's current password, rejects another user's IDs, updates the hash and revokes all sessions atomically. Failed audit does not partially change credentials or sessions.

## Tenancy and security boundaries

Every new signup creates an independent tenant. Tenant-owned user identities are retained; matching email addresses do not link accounts or grant access. A user can switch between authorized organizations/workspaces **within their tenant**. Separate tenant accounts require separate sign-in; a business ID is requested when the same email has multiple separate accounts. New-context endpoints cannot accept an arbitrary tenant ID, and signup cannot join an existing tenant without an authorized invitation.

Access tokens stay in memory. Neither access nor refresh credentials are written to local storage. Stored display metadata is not authentication evidence. On reload, a shared in-flight request validates the HttpOnly refresh cookie on the server; React development double-effect execution does not rotate the cookie twice. Refresh cookies use SameSite=Lax and Secure in production. Cookie signup/login/refresh reject foreign origins; authenticated API scope headers must match the signed token.

Account suspension and tenant deactivation prevent session use/refresh; soft-deleted organization/workspace membership blocks business access. Identity-only operations (allowed-context listing, target-validated switching, own password change and logout) still check active account/session status but let a user recover from a revoked current organization membership. These operations do not return business records or grant access to a denied target.

Signup and login have a 10/minute route throttle in the actual AppModule; the existing general throttle remains. Permission checks use current database membership/assignments, not browser role labels. The combined operational dashboard still requires CRM/sales/inventory/finance read permissions. Limited roles see no-permission states and can open authorized individual modules. Independent dashboard widget permissions and fine-grained action hiding remain an improvement.

## Email accuracy

The preserved SMTP/Resend/SendGrid provider adapters had returned success without sending any email. They now return unaccepted delivery, and the email service returns an explicit 503 configuration error. Signup remains available and does not mark the email verified or claim an email was sent. No provider credentials were invented and no external email was sent during this work.

Verification validates a valid purpose token and persists the user's verified state. Password reset tokens include a unique ID, are stored only as a hash after an accepted delivery call, are single-use, and revoke all sessions when consumed. Replay/concurrent consumption is tested with an explicit test delivery sink; **actual mail delivery is not verified or configured**. Production recovery needs a real transport implementation, credentials and delivery tests. The placeholder account-recovery endpoint no longer returns a fake recovery credential.

## Results and failures investigated

- Source/unit suite: **260 passed, 0 failed, 0 skipped**. [Evidence](verification/identity-source-tests-2026-10-16.txt).
- Money/disposable PostgreSQL/HTTP suite: **63 passed, 0 failed, 0 skipped**. [Evidence](verification/identity-retail-tests-2026-10-16.txt). The suites overlap on money unit coverage; these are separate run counts.
- First database run: 55 passed, 1 failed. The stricter organization check returned 401 for an authenticated session whose organization membership had been removed, where the retained API contract required 403. The guard was corrected to return Forbidden without weakening the membership check; the test expectation was preserved. [First-run evidence](verification/identity-retail-first-run-2026-10-16.txt).
- Newly executed scenarios: duplicate signup retry; saved setup choices and tenant isolation; invalid timezone; stale setup version; context creation retry; denied target/user; old-session revocation; selected context surviving refresh; concurrent switching; audit rollback for setup, switching and password change; suspended accounts; cross-site cookie signup; own-password enforcement; reset replay; persisted email verification; unavailable email adapters.
- The real AppModule HTTP journey now uses business setup, reconciles the known sale/payment/return/expense scenario, rejects a foreign tenant and switches to an empty second authorized business.
- Database migrations were applied only to a newly generated disposable test cluster. The runner verifies its actual PostgreSQL data directory, then stops/removes that exact cluster. No production database or the persistent development cluster was reset or migrated.
- API production build passed. [API evidence](verification/identity-api-build-2026-10-16.txt).
- Frontend production build passed: 243 routes generated, including `/login`, `/signup`, `/business-setup` and `/dashboard`. One retained legacy unused `_plan` warning remains in `apps/web/lib/command-center.ts:36`. [Frontend evidence](verification/identity-web-build-2026-10-16.txt).
- Final `npm run typecheck` passed, exit 0, for both API and web. [Type-check evidence](verification/identity-typecheck-2026-10-16.txt).
- Final startup passed: DATABASE_URL loaded without printing its value; authenticated read-only PostgreSQL/schema checks passed; internal API and same-origin proxy health returned 200; launcher reported Application Ready and GET / returned 200. Server remains running on http://localhost:3001; use `/login` to enter the flow. [Startup evidence](verification/identity-startup-2026-10-16.txt). No browser visual/interaction verification is implied by health checks.

## Files changed in this increment

API auth controller/service and DTOs (new `context.dto.ts`, extended signup/password-reset DTOs), JWT guard, token payload/service, sessions service, email service and three existing provider adapters; retail shop controller/DTO/service for setup/profile state.

Web: new `/login`, `/signup`, `/business-setup` routes; new business setup, context switcher and personal security components; shop auth/workspace/types/theme/help text; auth store/provider/API client, shared auth API/types and minimal route providers.

Tests: new `tests/shop-identity.test.mjs`, expanded `tests/retail.integration.mjs`, and the real AppModule `tests/shop-application.integration.mjs`. Documentation and verification evidence updated. Existing unrelated changes and modules were preserved. No schema migration was necessary.

## Remaining release gates

Browser screenshot/mobile/keyboard interaction verification remains blocked by automatic browser review, including after the earlier explicit approval. HTTP health and server/component tests do not prove the visual layout.

Email delivery/recovery configuration, independent per-widget permissions, invitation/team management UI, AI providers and safe execution, suppliers/payables/purchasing, full bank cash flow, and the other planned modules are not completed by this increment. Saved timezone preferences apply to follow-up date labels; financial date grouping and financial labels remain explicitly UTC. A month-end timezone regression test verifies these boundaries. Production TLS, backups/restore drills, monitoring, deployment and audit of preserved legacy modules remain outstanding. This is a verified local retail workflow, not a 100% production-readiness claim.

Next smallest implementation step: split the overview into resource-authorized widgets so a stock operator can use their dashboard without CRM or financial access. A production release also requires a real, verified mail transport for account recovery.
