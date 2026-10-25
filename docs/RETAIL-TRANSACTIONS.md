# Retail transaction contracts and accounting assumptions

## Inventory and sale lifecycle

The existing catalog, warehouse, stock-balance, movement-history and invoice tables are retained. Three additive tables hold retail sales, sale-line snapshots and returns. Opening balances require a retry key and, when nonzero, a recorded currency, unit cost and reason. Existing unvalued stock is rejected for posting until its opening valuation is reviewed; it is never assigned an invented cost.

`POST /api/v1/retail/stock-movements` accepts decimal-string quantity, stock ID, stable movement key, reason, currency and type `RECEIPT` or `ADJUSTMENT`. Receipts require unit cost. Negative adjustments use recorded average cost; positive adjustments use supplied or recorded cost. The original inventory-core movement route delegates to this ledger rather than creating standalone “posted” history. Batch/serial/bin stock posting is explicitly unsupported in this retail release; it fails validation instead of changing incompatible balances.

`POST /api/v1/retail/sales` creates a draft and linked draft invoice with 1–100 distinct stock lines. Drafts do not affect stock or recognized revenue. Completing a sale commits its stock reductions, cost snapshots, sale status, invoice issue and audit history together. Cancelling a draft has no stock effect. Returns accept only unreturned quantities of a completed sale; cancellations of completed sales return remaining goods and credit/refund according to the same rules. A retried completion, return, cancellation, receipt or payment cannot repeat its effect. Reusing a key for a different payload is rejected.

Moving weighted-average costing uses the recorded inventory value and on-hand quantity. Receipts add quantity × unit cost. Sales/negative adjustments remove a proportional value rounded HALF_UP to four decimal places; consuming the final quantity removes the entire remaining valuation. Returns restore the sale's original cost snapshot, not today's average. The final return of a line uses the remaining exact cost/revenue balance to absorb previous rounding. Adjustments change stock valuation but are not automatically booked as a P&L loss/gain; an expense or reviewed accounting entry is required separately.

Transactions use PostgreSQL serializable isolation, transaction-level advisory locks, conditional stock updates, database uniqueness and bounded retries for serialization/deadlock conflicts. Locks and retry decisions use server-derived tenant/resource IDs. Balance, movement, payment, sale/return and audit records share the transaction. No external email, payment-provider or Redis side effect runs inside it. Inventory events are persisted as `PENDING`; delivery by an outbox dispatcher is not implemented or claimed.

## Invoice payments and refunds

`POST /api/v1/finance/invoices/:id/payments` records a manual payment with decimal-string amount, invoice currency, method, optional reference and idempotency key. Every successful receipt has a persisted ledger row. Outstanding balance is invoice total minus net reconciled payments. Partial receipts produce `PARTIALLY_PAID`; full payment produces `PAID`. Overpayments, draft/finalized invoices, cross-scope references and currency mismatches are rejected.

`POST /api/v1/finance/invoices/:id/refunds` appends a `REFUND` or full remaining `REVERSAL` linked to the original payment. It does not overwrite the original amount. Corrections cannot exceed the original payment less its previous corrections. A cash refund without returning goods reopens outstanding debt and does not reverse recognized sales revenue or stock. Returned goods credit the invoice first; only cash exceeding the reduced invoice total is refunded. Unpaid returns reduce outstanding debt without inventing a cash refund.

The old “mark paid” endpoint now requires an idempotency key and records the actual remaining payment before reconciliation. The frontend sends the new payload, shows currency/outstanding balance, and offers it only for payable statuses. It still records a **manual bookkeeping receipt**: it does not debit a bank account or send a real provider refund. Legacy global payment writes delegate to the same ledger; unverified provider settlement cannot be asserted by a caller. Existing unreconciled settled payments block new posting until reviewed, preventing accidental double collection.

## Financial reporting

`GET /api/v1/retail/reports/profit-loss?currency=INR&from=...&to=...` uses an explicit currency and UTC instants with interval **[from, to)**. Money is calculated with 40-digit decimal intermediates, stored in Decimal(18,4), and rounded HALF_UP to the configured currency precision (0–4). Report amounts are strings. No currency conversion or cross-currency aggregation is performed. Legacy expenses/revenue precision is widened from Decimal(14,2) without changing historical amounts. Presentation-only numeric fields remain for compatibility; the command and reporting calculations do not use those numbers.

- Sales are completed retail sale totals at completion date; drafts are excluded.
- Recognized revenue is completed sales less returns recorded during the period, plus explicitly recorded `FinanceRevenue` rows at their recognition date.
- `FinanceRevenue` rows must not duplicate retail sales. Other revenue's COGS is unavailable; reported gross/net profit is only as complete as the recorded costs. These reports are operational bookkeeping, not statutory accounts.
- COGS is the sale cost snapshot less returned cost recorded during the period.
- Approved/reimbursed expenses are recognized at incurred date. Pending/rejected expenses are excluded.
- Gross profit is recognized revenue minus COGS. Net profit is gross profit minus recorded operating expenses.
- Customer cash received and refunded/reversed are separate reconciled payment totals at their ledger date. Net customer cash is not a bank balance. Supplier payments, opening cash, fees and other cash movements are not included.

No tax calculation, tax filing, foreign exchange, overhead allocation, inventory shrinkage P&L automation or prediction is implied by these figures. Old multi-country tax/provider workflows remain outside the verified retail scope.

## Authorization and migration

Every retail command reads current active workspace and organization membership, tenant ownership and scoped database role assignments. Caller-supplied workspace overrides and referenced items/warehouses/invoices from another scope are rejected. Owner authorization uses persisted organization membership, never caller JWT role labels. Non-owner roles are checked by resource/action; unsupported conditional grants fail closed. Existing-organization public signup now requires an invitation rather than granting owner access. The invitation workflow itself remains to be implemented.

Before adopting this migration on any existing database: back up and test restore, compare the live schema with the checkpoint, audit historic owner memberships, reconcile stock quantities/valuation and existing payments, and check duplicate retry keys. Some historical consistency constraints are `NOT VALID` so rows are preserved for review while new writes are enforced. They must be validated after repair. The migration is transactional and additive; it has only been executed on generated disposable test databases. No production migration, reset or deployment was performed.

To reproduce database verification, install PostgreSQL 16 (or set `NEXORA_TEST_POSTGRES_BIN`), generate the Prisma client, build the API, then run `npm run retail:test`. On restricted Windows environments this needs local process/network access. The runner creates its own cluster/database with synthetic data, verifies the cluster path, applies the checkpoint schema and retail migration, runs tests, stops the cluster and removes only its generated directory. It has no fallback to a configured production `DATABASE_URL`.
