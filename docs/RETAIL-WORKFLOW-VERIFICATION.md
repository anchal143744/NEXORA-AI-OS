# NEXORA retail workflow verification — 16 October 2026

## Current scope

One local entry point: `http://localhost:3001`. Next.js forwards `/api` to the internal NestJS API on port 4001. The project-owned PostgreSQL development cluster uses port 5433. No public deployment is included. Existing architecture, modules and local records are preserved; no production database was reset or migrated.

Retail navigation joins customers/leads, follow-ups, products, stock movements, sales, invoice payments/corrections, expenses and profit/loss. Business records and chart totals are persisted data. Supported currencies, labels and navigation are reference configuration, not fabricated business data. Start with signup → choose currency → product opening stock/receipt → customer/follow-up → draft/complete sale → record payment → return/refund if needed → expenses → report.

## Changes in this increment

- Account, credential, organization, business, workspace and membership provisioning now share one transaction. A PostgreSQL trigger deliberately fails membership insertion and proves all provisioning records roll back. Password hashing and external email delivery remain outside the transaction. Email delivery is still a placeholder and is not claimed as functional.
- New retail login/signup sessions put refresh credentials in an HttpOnly, SameSite=Lax cookie, with Secure enabled in production. Legacy JSON token clients remain compatible. Cookie refresh rejects foreign origins; refresh rotation conditionally replaces the previous token hash, so duplicate concurrent rotations cannot both succeed. Logout revokes the session and clears the cookie.
- The client refreshes expired access once, shares an in-flight refresh, preserves request bodies/idempotency keys and verifies user/session/tenant/organization/workspace identity before accepting the result. Logout during refresh cannot restore the account. Revoked sessions do not loop.
- Authenticated requests reject mismatched tenant, organization and workspace headers. Ownership and current persisted membership checks remain in the retail services.
- Low stock comparisons use scaled integers, preserving four decimal places even at large schema values. CSV exports preserve negative numeric amounts and neutralize spreadsheet formulas in editable labels. Loading/error colors and browser theme color now match the retail palette; raw error messages are not exposed in the route error screen.
- The sales ledger now uses server-side search and pagination instead of stopping at the most recent 100 rows. A real PostgreSQL/HTTP test persists 102 sales and verifies complete page coverage, old reference lookup, case-insensitive customer lookup, status filtering, tenant isolation and rejected oversized pagination values. Legacy list callers retain their existing response shape.
- Historical source checks were repaired according to their supported contracts, without skipped tests, fake version changes or disabled assertions. See the [33-failure investigation](RETAIL-FAILURE-TRIAGE.md).

## Executed checks

| Check | Result |
| --- | --- |
| Complete source/unit suite: `node --test --test-concurrency=1 tests/*.test.mjs` | **245 passed, 0 failed, 0 skipped** |
| Disposable PostgreSQL suite: `npm run retail:test` | **44 passed, 0 failed, 0 skipped** |
| Backend: `npm run api:build` | Passed |
| API and frontend: `npm run typecheck` | Passed |
| Frontend: `npm run web:build` | Passed; 240 routes generated. One retained legacy lint warning: unused command-center argument |
| Development database: `npm run db:check` | Authenticated read-only query and schema check passed; URL value withheld |
| Diff whitespace check | Passed |
| `npm run jwt:security` | Passed; zero reported failures |
| Final `npm run dev` startup | Passed: zero watch compilation errors, authenticated PostgreSQL connection, frontend HTTP 200 and API health HTTP 200 through the same localhost:3001 proxy; launcher reported Application Ready |

The PostgreSQL runner creates a fresh loopback-only cluster on a randomly available port, verifies its actual data directory, deploys the complete checked-in migration chain into a unique empty test database, executes tests, stops it and removes only that generated cluster. It never falls back to the development or production connection. The local development database initially was stopped; its existing owned cluster was started without migration/reset and then connectivity passed.

The 44 database-runner tests include six money unit tests also present in the 245 source/unit tests. Do not add the totals as independent coverage. Evidence: [source/unit results](verification/workflow-source-tests-2026-10-16.txt), [database test results](verification/workflow-retail-tests-2026-10-16.txt).

## Database workflows actually exercised

Receipts, positive/negative adjustments with reasons, opening valuation, movement history, draft/completed/cancelled/returned sales, partial payments, duplicate payments, refunds/reversals, invoice reconciliation, tenant/organization ownership, denied permissions, membership revocation, concurrent overselling prevention and rollback after injected persistence failures all run against PostgreSQL. The new complete-application test boots the real AppModule with its middleware, controllers, services, response interceptor, validation and exception filter; it does not replace business services with mocks.

Known full-application HTTP scenario: opening 10 units at cost 10.00, complete 3 at price 30.00, receive 50.00, return 1, approve expense 10.10. Actual values are sales **90.00**, returns **30.00**, recognized revenue **60.00**, COGS **20.00**, gross profit **40.00**, operating expenses **10.10**, net profit **29.90**, net customer cash **50.00**, outstanding **10.00**, inventory value **80.00**. Duplicate payment produces one persisted entry. A second business cannot read stock history or write against the first invoice.

Financial assumptions remain those in [retail transaction documentation](RETAIL-TRANSACTIONS.md): currency precision, decimal arithmetic, weighted-average stock valuation, revenue on sale completion, returns reversing recognized revenue/COGS, and cash tracked separately. Tax, FX, statutory reporting and provider settlement are outside this retail increment. Historical records may need reconciliation before import or operational use.

## Files changed

Current increment: `auth.controller.ts`, `auth.service.ts`, auth login/signup/refresh DTOs, `jwt-auth.guard.ts`, `sessions.service.ts`, `retail-sales.service.ts`, `shop.controller.ts`, `shop.dto.ts`; frontend `lib/api-client.ts`, `features/shop/shop-auth.tsx`, `shop-workspace.tsx`, new `shop-values.ts`, root `layout.tsx`, `loading.tsx`, `error.tsx`, search option accessibility attribute and legacy command-center argument name; `scripts/release-marker-scan.mjs`, `web-gold-master-audit.mjs`, `run-retail-tests.mjs`; `tests/retail.integration.mjs`, new `shop-application.integration.mjs`, `retail-client.test.mjs`, `helpers/web-contracts.mjs`, phase 2/3/5/6/8/50/52–55/60–71 contract tests as applicable; README and verification reports/evidence. Previous retail UI/API/environment changes remain in the working tree. No source module was deleted.

## Remaining verification and risks

- Browser visual, responsive layout and click-through tests remain **blocked**. Automatic browser security review denied localhost:3001 and denied the subsequent user-approved retry. No alternative browser, raw browser protocol or indirect screenshot workaround was used. CSS source/build checks cannot certify visual stability.
- The short-lived access token is still in localStorage; legacy JSON clients can still store refresh tokens. Cross-tab refresh coordination is not covered. A broader XSS/session review is needed before public launch.
- Preserved enterprise routes have not received a comprehensive authorization or functional review. Retail checks do not certify those modules. Existing generic role claims also need a wider legacy authorization review; retail writes use persisted role/membership checks.
- Real email verification/recovery delivery, public hosting/TLS, operational monitoring, real bank/payment integration and pending inventory event dispatch are not verified. Provisioning is atomic, but session/audit creation after its commit is not a single transaction with account provisioning.

No failures remain in the two executed suites. This is a verified local retail scope, not a claim of universal production readiness. The next smallest step is a desktop/mobile browser acceptance pass through the listed workflow when browser access is permitted, followed by fixing any observed layout or interaction defects before public deployment.
