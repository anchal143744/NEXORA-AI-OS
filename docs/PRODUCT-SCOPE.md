# NEXORA product scope and release gates

Updated 16 October 2026 from the user's revised hierarchy and five priorities. This document distinguishes implemented retail behavior from planned capabilities; a navigation entry is not implementation evidence.

> The newer detailed Page 01 request and screenshot reference supersede the older menu labels and light palette below. See [Page 01 implementation and acceptance gaps](PAGE-01-VERIFICATION.md) for current behavior; historical verification counts below describe the prior increment.

## Navigation contract

```text
NEXORA AI
├── Workspace
│   ├── Overview
│   ├── AI Command Center
│   ├── My Tasks
│   └── Notifications
├── CRM
│   ├── Leads
│   ├── Contacts
│   ├── Companies
│   ├── Deals
│   └── Follow-ups
├── Sales
│   ├── Quotes
│   ├── Orders
│   ├── Invoices
│   └── Payments
├── Inventory
│   ├── Products
│   ├── Stock Levels
│   ├── Stock Movements
│   ├── Warehouses
│   ├── Purchasing
│   └── Suppliers
├── Finance
│   ├── Overview
│   ├── Income & Expenses
│   ├── Profit & Loss
│   ├── Cash Flow
│   ├── Receivables
│   └── Payables
├── Operations
│   ├── Workflows
│   ├── Approvals
│   └── Automations
├── Intelligence
│   ├── Analytics
│   ├── AI Insights
│   └── Forecasts
└── Administration
    ├── Team
    ├── Roles & Permissions
    ├── Organization Settings
    ├── Workspace Settings
    └── Billing
```

Help, Settings and Profile remain accessible utilities. Workspace Overview and Finance Overview have distinct navigation keys. Removing old menu labels does not delete their underlying modules or remove return/cancellation actions from the sales ledger.

## Five priorities

| Priority | Current implemented scope | Remaining gate |
| --- | --- | --- |
| Reliable business transactions | Retail draft/completed orders, stock ledger, linked invoices, manual payments, refunds/returns, decimal-safe reporting, transaction rollback and retry protection | Quotes, purchasing and supplier/payable lifecycles must integrate with the same ledgers; historical data reconciliation and external settlement remain separate work |
| True multi-tenancy | Retail server checks persisted membership, permissions, tenant, organization and workspace; mismatched context is rejected | Every new endpoint needs cross-tenant and cross-organization tests. Preserved legacy routes still require comprehensive review; retail tests do not certify the entire repository |
| Adaptive workspace | Persisted workspace-level navigation and dashboard widget preferences, management authorization, validated option lists, version conflicts and atomic audit persistence | Custom business workflows, per-role layouts and configurable business rules are not delivered by visibility settings |
| Actionable AI | No new autonomous execution is enabled; unimplemented AI entries remain disabled | Build proposal/preview, server-side permission checks, tenant-bound approval, idempotent execution, audit trail and safe failure/recovery. Do not let model output directly alter financial or inventory records |
| Production reliability | Local environment checks, API/frontend builds, source/component tests and disposable PostgreSQL transaction tests | Desktop/mobile acceptance, backup-and-restore rehearsal, monitoring/alerts, security review, deployment/TLS and recovery verification are still required before a production claim |

## Adaptive workspace contract

Workspace Settings → **Shape your workspace** lets an authorized manager choose six optional navigation sections and six detail widgets. Workspace and Administration remain reachable. Financial headline cards remain visible; all detail widgets may be hidden. Unavailable features stay unavailable even when their section is shown. Visibility is presentation, not access control: hiding a module does not revoke permissions, delete records or disable ledger integrity.

`PATCH /api/v1/retail/shop/preferences` accepts only `expectedVersion`, allowed module keys and allowed widget keys. The server derives the target workspace from authenticated context. It checks persisted `settings/manage` authority, locks the same workspace configuration resource as currency/name changes, checks the expected version and commits metadata plus its audit event together. A stale save returns 409. Unknown/duplicate keys and scope injection are rejected. A failed audit rolls back the settings change. No schema migration is needed: preferences use a dedicated `retailPreferences` object within existing workspace metadata.

The revision preserves the existing warm palette, exact-value charts and retail workflows. Existing unimplemented destinations remain visibly disabled; this scope is not a claim that every item in the tree is functional.

## Next smallest implementation steps

1. Accept the current navigation/customization in desktop/mobile browser testing when access is permitted.
2. Complete the quote-to-order-to-invoice lifecycle with ownership, retry and rollback tests before adding unrelated modules.
3. Introduce configurable workflows and an approval record with a narrow action allowlist; then attach AI proposals to that verified execution path.
4. Rehearse backup restoration on disposable data and verify monitoring/recovery before any public production release. Never reset or migrate production data as part of local verification.

Automatic browser security review previously denied localhost:3001, including the user-approved retry. That visual/click-through limitation remains; no alternative browser or screenshot workaround was attempted.

## Executed verification

| Check | Result |
| --- | --- |
| Complete source/unit suite | **251 passed, 0 failed, 0 skipped** |
| Disposable PostgreSQL suite | **46 passed, 0 failed, 0 skipped** |
| API production build | Passed |
| Frontend production build | Passed; 240 routes generated; one preserved unused command-center argument warning |
| API/frontend type checks | Passed |
| Diff whitespace check | Passed |
| Final local startup | Application Ready at localhost:3001; PostgreSQL/schema checks, frontend HTTP 200 and proxied API health HTTP 200 passed |
| Browser visual/click-through | Blocked by the previously denied browser origin |

The database tests verify saved preferences across reloads, separation from another organization, preservation through currency/name settings updates, invalid/duplicate input rejection, denied management permissions, stale-save conflicts, concurrent-save protection and rollback after an injected audit failure. Existing stock, payments, returns, financial and full-application scenarios still pass. The runner created and removed its own disposable PostgreSQL cluster; no production database was used or reset. Six money tests appear in both suites, so the counts overlap.

Evidence: [source/unit results](verification/priorities-source-tests-2026-10-16.txt), [database results](verification/priorities-retail-tests-2026-10-16.txt). The previous [design report](RETAIL-DESIGN.md) is an earlier snapshot; this revised hierarchy supersedes its menu labels.

## Files in this increment

Frontend: `shop-navigation.tsx`, `shop-workspace.tsx`, `shop-overview.tsx`, `shop-types.ts`, `shop-theme.css`, new `shop-preferences.ts` and `shop-customization.tsx`. API: `shop.dto.ts`, `shop.controller.ts`, `shop.service.ts`, new `shop-preferences.ts`. Tests: revised hierarchy and widget/navigation assertions in `shop-design.test.mjs`; new persisted preference, authorization, concurrency and rollback scenarios in `retail.integration.mjs`. Existing modules and previous changes are preserved.
