# Retail rebuild verification — 14 October 2026

## Result and scope

Implemented a retail transaction layer within the existing Next.js/NestJS/Prisma/PostgreSQL repository. No original module was deleted, no advanced enterprise feature was added, and no production database was accessed, migrated, reset or deployed. Initial Git status was clean on `codex/retail-rebuild`; the previous source checkpoints remain available.

The new services execute receipts/adjustments, draft/completed sales, returns/cancellations, manual payments/refunds/reversals and currency-specific P&L calculations. Existing stock movement and invoice payment paths now use the shared ledgers. Invoice and expense displays use record currency; full-payment actions show outstanding balance and submit a retry key. A complete retail frontend is still the next step.

## Exact verification results

| Executed check | Result |
| --- | --- |
| `node --test tests/phase*.test.mjs` | 219 legacy tests: **186 passed, 33 failed, 0 skipped**. Same failure set as the audited checkpoint; expectations unchanged. |
| `npm run retail:test` | **31 passed, 0 failed, 0 skipped**: 6 deterministic money tests and 25 PostgreSQL/service/HTTP tests. Fresh generated cluster, checkpoint schema plus additive SQL migration; cluster stopped and removed afterward. |
| `npm run api:build` | Passed after final fractional-return fix. |
| `npm run web:build` | Passed; 239 static pages generated. Two existing lint warnings remain: missing `aria-selected` in global search and unused `plan` parameter in command-center code. |
| `npm run typecheck` | Passed for both backend and frontend after the final implementation changes. |
| `npm run web:lint` | Passed the repository's custom 27-file foundation checks. This is not a full independent ESLint audit. |
| Node syntax checks on runner and integration test | Passed. |
| `git diff --check` | Passed. |

Test output is retained in [verification/retail-tests.txt](verification/retail-tests.txt). The [failure triage](RETAIL-FAILURE-TRIAGE.md) documents each of the 33 remaining legacy failures: 14 incompatible historical version checks, 11 tests reading the old navigation facade, and 8 outdated endpoint/component/identity contracts. Those tests do not execute a database. No failure was removed or converted to a skipped test.

Earlier setup attempts were not counted as successful verification: the sandbox-owned PostgreSQL cluster could not accept connections, the initial Nest test module was missing dependencies, and a first fresh runner attempt aborted during schema initialization. The host-owned runner and complete test dependency registration corrected those setup issues. The final count above comes from a completed migration and test run, not compilation or mocked transactions.

## Database workflows actually executed

- Opening stock and receipt posting persist balanced quantity/value, history, audit and pending event records; duplicate concurrent receipt requests have one effect and changed-payload retries fail.
- Negative/positive stock command validation includes reason/cost/currency rules and rejection of insufficient stock.
- Draft sales do not change stock. Concurrent duplicate completion reduces stock once. Competing sales cannot oversell. A failure on a later line rolls back earlier stock/history and leaves sale/invoice draft.
- Partial receipts reconcile outstanding balance/status. Same-key payment retries persist one payment. Competing distinct receipts cannot exceed outstanding debt. “Mark paid” creates a payment rather than merely changing status.
- Refunds and reversals append corrections, reject excess refunds and reconcile invoice state. Paid returns restore stock/cost, credit invoice and refund only cash exceeding its reduced total. Draft/completed cancellation and duplicate cancellation are exercised.
- A known weighted-average scenario reconciles revenue 90.00, COGS 45.00, approved expenses 10.10, gross profit 45.00 and net profit 34.90 in INR; customer cash remains separate at 50.00. Pending expenses and other currencies are excluded; date filters are tested.
- Repeated fractional returns restore original quantity/cost without over-crediting rounded line totals. Money arithmetic tests cover 0/2/3 decimal currencies, precision/range rejection, rounding and exact invoice balances.
- Cross-tenant and same-tenant/cross-organization stock, sale and payment references fail. Current resource roles, revoked membership, forged owner token claims, invalid historical foreign-role relationships and nested inventory read isolation are exercised.
- Database-trigger failure injection after payment insertion and after stock mutation proves rollback of financial/balance/history writes when the audit write fails.
- A real local HTTP API uses the production JWT guard, signed tokens, persisted active sessions and production DTO validation. Missing tokens, invalid payloads, caller-supplied tenant fields and revoked sessions fail; an authorized stock post succeeds.

These tests use real PostgreSQL queries and service transactions. The HTTP harness mounts the relevant controllers with their real services and guard; it does not boot all 62 backend modules. Password login/signup email delivery, Redis workers, provider webhooks and browser UI journeys are not covered by that harness.

## Migration and security limits still open

The additive migration was executed against the schema at checkpoint `3609b6e`, not an unknown live database or the entire historical deployment chain. Existing database drift, historical owner memberships, unvalued stock and unreconciled settled payments require a reviewed preflight and backup/restore drill. Historic consistency constraints remain `NOT VALID`; new writes are enforced but old data is preserved for reconciliation.

Other legacy JWT-only modules, warehouse/fulfillment document workflows and multi-country tax calculations need an authorization/ownership and accounting review before public exposure. The corrected retail posting and payment paths are protected, but the full application is not security-certified. Old access tokens and incorrectly granted historical owner memberships require operational review. Refresh data still uses localStorage. No real payment-provider settlement or refund is performed; the records are manual bookkeeping entries. Pending inventory events have no verified outbox dispatcher. Batch/serial/bin stock posting, inventory-adjustment P&L automation, FX/tax/statutory accounting and browser behavior remain outside this verified release scope.

## Next smallest implementation step

Expose the verified receipt, sale completion, partial-payment and return APIs through focused retail screens, using explicit decimal/currency inputs and visible errors. Run one browser journey from opening stock through sale, partial payment, return and P&L reconciliation. Keep legacy advanced routes out of the retail release until their authorization audit is complete. Production readiness has not been established.

## Files changed

The implementation inventory below includes the existing files edited and the additive files created. No legacy test file was changed in this phase.

- `.gitignore`
- `apps/api/src/infrastructure/database/prisma.service.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/finance/finance.controller.ts`
- `apps/api/src/modules/finance/finance.module.ts`
- `apps/api/src/modules/finance/finance.service.ts`
- `apps/api/src/modules/global-finance/dto/global-finance.dto.ts`
- `apps/api/src/modules/global-finance/global-finance.module.ts`
- `apps/api/src/modules/global-finance/invoices/invoice-intelligence.service.ts`
- `apps/api/src/modules/global-finance/payments/global-billing.service.ts`
- `apps/api/src/modules/rbac/rbac.module.ts`
- `apps/api/src/modules/rbac/rbac.service.ts`
- `apps/api/src/modules/retail/inventory-ledger.service.ts`
- `apps/api/src/modules/retail/money.ts`
- `apps/api/src/modules/retail/payments.service.ts`
- `apps/api/src/modules/retail/retail-access.service.ts`
- `apps/api/src/modules/retail/retail-report.service.ts`
- `apps/api/src/modules/retail/retail-sales.service.ts`
- `apps/api/src/modules/retail/retail-transaction.ts`
- `apps/api/src/modules/retail/retail.controller.ts`
- `apps/api/src/modules/retail/retail.dto.ts`
- `apps/api/src/modules/retail/retail.module.ts`
- `apps/api/src/modules/supply-chain/dto/supply-chain.dto.ts`
- `apps/api/src/modules/supply-chain/inventory-core.service.ts`
- `apps/api/src/modules/supply-chain/supply-chain.module.ts`
- `apps/web/features/finance/expense-management.tsx`
- `apps/web/features/finance/invoices-workspace.tsx`
- `apps/web/lib/finance-workspace.ts`
- `apps/web/services/finance-workspace-api.ts`
- `apps/web/types/finance-workspace.ts`
- `docs/REBUILD-AUDIT.md`
- `docs/RETAIL-FAILURE-TRIAGE.md`
- `docs/RETAIL-TRANSACTIONS.md`
- `docs/RETAIL-VERIFICATION.md`
- `docs/verification/retail-tests.txt`
- `package.json`
- `prisma/migrations/20261014000100_retail_transaction_integrity/migration.sql`
- `prisma/schema.prisma`
- `scripts/run-retail-tests.mjs`
- `tests/retail-money.test.mjs`
- `tests/retail.integration.mjs`
