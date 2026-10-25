# NEXORA retail rebuild audit — 13 October 2026

## Decision

Retain Next.js, NestJS, Prisma and PostgreSQL. Rebuild incrementally around retail workflows, preserving existing modules until their replacements have verified behavior. No database migration, deletion of original modules, or deployment has been performed. The original ZIP is the recovery source. The containing portfolio repository has no commits and all its existing files are untracked; do not commit or overwrite that project as part of this rebuild.

## Verified source findings

The archive contains 818 Prisma models, 62 API module directories and 236 frontend page routes. These are counts of source structures, not evidence of completed features. There are nine migration directories. API entry point: `apps/api/src/main.ts`; web entry points: `apps/web/app`. Root scripts expose `dev`, `api:dev`, `web:dev`, `typecheck`, `build` and Prisma generation/deployment. PostgreSQL is the database; Redis/BullMQ supports queues; separate worker entry points exist.

| Priority | Finding and evidence | Required correction |
| --- | --- | --- |
| Critical | `inventory-core.service.ts:createMovement` creates history and publishes an event but never updates a stock balance. `createStock` accepts independent quantities directly. | One transactional stock command, conditional balance updates, movement ledger and retry key; link sale completion and returns to it. |
| Critical | Inventory writes use `dto.workspaceId` ahead of authenticated context, without validating membership or related item/warehouse ownership in this service. | Resolve workspace from verified identity; validate every referenced record against tenant/workspace before writing. |
| High | Inventory controller applies JWT authentication but no RBAC guard or permission decorators. | Explicit read/write permissions, backed by role provisioning and forbidden-access tests. |
| High | `finance.service.ts:revenueSummary` converts database decimal values to JavaScript numbers, sums all revenue/expense rows without recognition/status or period filtering, and formats all results as USD. | Decimal arithmetic, accounting status rules, currency separation and reporting periods; do not call this net profit without COGS. |
| High | `markInvoicePaid` only updates status/date; it does not create or reconcile a payment or adjust amount due. | Payment ledger and atomic reconciliation, with duplicate protection and allowed transitions. |
| High | `finance-workspace.ts` contains example companies, fixed cash balances, growth, profitability and forecast confidence. Current main finance view fetches backend data, so these examples are not proof that its live route is fabricated. | Trace all fixture consumers, isolate explicit demo data and keep unmeasured metrics out of real reports. |
| High | Several phase tests inspect strings/files instead of executing domain behavior. Phase 42 unit test uses a hardcoded former Desktop path and fails after relocation. | Portable test roots and behavioral tests for sale retries, rollback, stock concurrency, authorization and financial reconciliation. |
| Medium | API manifest uses `latest` for many dependencies; root names pnpm while setup/workspaces use npm and package-lock. | Select npm with the existing lockfile, validate lock consistency, and pin versions after compatibility checks. |
| Medium | Auth store persists access/session data in localStorage. | Review token lifetimes, refresh storage and XSS defenses; evaluate HttpOnly refresh cookies without breaking current auth contracts. |

Useful foundations: JWT guard checks active sessions and workspace/organization membership and replaces request context with verified claims. Main API config installs server validation, Helmet and exception handling. Finance API queries are tenant/workspace scoped. These are source observations; runtime security is not yet certified.

## Unnecessary packaging and deferred features

Exclude dependency folders, compiled output, Next caches, Redis persistence, logs, database dumps, environment credentials and refinement backups from source releases. The extracted copy excludes these runtime artifacts; the original ZIP remains untouched. A database dump accidentally selected during initial extraction was removed without reading or importing it.

Defer manufacturing, digital twins, knowledge graphs, enterprise AGI, marketplace, global connectivity, contact center, advanced workforce and Kubernetes operations from the first retail release. They are candidates for later scoping, not modules proven safe to delete. Repeated release reports should become historical evidence rather than assertions of current readiness.

## Target architecture and implementation order

1. Make development reproducible, create a source checkpoint, repair portable tests and establish baseline compile/build evidence.
2. Prove organization/workspace isolation, role permissions and server validation using an isolated test database.
3. Deliver customers, leads and follow-ups with persisted CRUD, search, pagination and useful error/empty states.
4. Deliver products, receipts and stock adjustments through a single atomic ledger. Require reason, actor and retry key; prevent negative available stock under concurrent writes.
5. Implement sale lifecycle, line prices, payment allocation, cancellation and returns. Sale completion reduces stock exactly once in the same transaction as the sale state change.
6. Calculate recognized revenue, weighted-average COGS, expenses, gross/net profit and cash separately using decimal-safe arithmetic and configured currency/date periods.
7. Refine the retail dashboard around real metrics, inventory, sales, customers and due follow-ups. Expose only verified workflows in primary navigation.
8. Add read-only AI summaries from authorized query results with provenance. No stock changes, refunds or customer messages without explicit approval.
9. Run critical API/database/browser journeys and production build; document restore drills and deployment prerequisites. Do not deploy automatically.

## Migration and recovery controls

Before any schema changes, obtain a verified database backup and test restore in an isolated database. Reconcile record counts, stock balances, invoices and payments; map existing model usage before consolidation. Use additive migrations initially; never reset the existing database. Migration rollback must include a tested restore strategy, not just a reverse SQL file. No production data is needed for tests.

## Baseline verification

- Phase 57 finance source checks: 5 passed; these do not verify accounting behavior.
- Phase 42 supply-chain source check: failed with ENOENT because of its absolute Desktop path.
- Existing `web:lint`: passed its custom source checks; this is not a full ESLint verification.
- Dependency installation: initial sandbox `npm ci` failed with npm's “Exit handler never called”; host-access retry pending.
- Docker executable exists, but sandbox access to its engine pipe was denied. Database, Redis, runtime API and browser workflows are unverified.

## Initial recovery changes and results

Created an independent Git repository in the extracted directory, with baseline checkpoint `24aaee9` and working branch `codex/retail-rebuild`. The portfolio files remain untouched. Repaired 32 test roots to resolve relative to each test file. Corrected the finance badge to show connected data only after a successful query.

After the path repairs, the complete existing Node suite reports **219 tests: 186 passed, 33 failed**. A targeted rerun of supply-chain and finance source checks reports **9 passed**. Failures include historical version assertions and source-shape assertions, so they require triage rather than removal or treating every failure as a runtime bug. Full output is in `rebuild-test-results.txt`. Frontend TypeScript checking passed. Dependency installation succeeded using host access; lifecycle scripts were intentionally skipped. Prisma generation and production builds are being verified separately.

Both frontend and backend TypeScript checks passed, as did Prisma client generation. **API build and frontend production build both passed.** The frontend build generated 239 static pages; its lint step reported an existing missing `aria-selected` attribute in global search and an unused parameter in command-center code. A successful build is not runtime verification: no database-backed transaction, Redis worker, provider integration or browser journey has been validated in this audit.

The rebuild is not complete and production readiness has not been established.

## Retail transaction implementation — 14 October 2026

The next increment implements atomic inventory/sale/payment ledgers and decimal/currency reporting. A fresh disposable PostgreSQL cluster applied the baseline plus the additive migration, then passed 31 behavioral/money/HTTP tests. The unchanged legacy suite still reports 186 passed and 33 failed. See [failure triage](RETAIL-FAILURE-TRIAGE.md), [transaction contracts](RETAIL-TRANSACTIONS.md) and [verification report](RETAIL-VERIFICATION.md) for exact evidence, remaining security limits and the next retail UI step. No production database or deployment was used.
