# Page 01 — Business Overview verification

16 October 2026. The user's detailed product request defines behavior. The supplied dark dashboard image is a visual reference; its customer names, company, totals, growth percentages and alerts are not seed data or expected results.

> The later [signup/setup and context-switching increment](IDENTITY-WORKFLOW-VERIFICATION.md) implements the core entry flow and supersedes this dated document’s context-switching and auth-storage gaps. Other Page 01 acceptance gaps remain explicitly tracked.

## Implemented in this increment

- `/dashboard` renders the connected retail workspace. `/` and `/shop` remain aliases. The preserved enterprise command center remains at `/command-center`.
- Dark navy panels, violet primary actions, colored metric icons, a main business overview and a right-side signals/attention/actions column. Forms, dialogs, loading and error screens use the same palette. System fonts avoid external font loading failures. CSS includes desktop/tablet/mobile breakpoints, visible keyboard focus and reduced-motion support.
- Authorized identity and current organization/workspace context in the header, Ctrl/Cmd K search and quick actions, profile access, refresh and due-follow-up badge. Context pills identify the current session; they are not working organization/workspace switchers.
- Search calls the existing server-authorized customer, product and sales/invoice sources. Partial failures are disclosed; complete failure is an error. Results and actions navigate to connected retail modules. Suppliers and standalone transaction search are not connected.
- Requested navigation hierarchy is retained in metadata; unavailable modules are hidden. Persisted server-derived read capabilities and workspace module preferences filter navigation. Expanded sections and pinned pages are scoped to the current user/workspace in local storage.
- Today, 7 days, 30 days, quarter-to-date, year-to-date and custom date filters. Through dates are inclusive in the UI and become exclusive next-day UTC boundaries. Previous comparisons use the same number of calendar days. Preset choice is saved per user/workspace in local storage; custom dates are session-only.
- Recognized revenue, gross profit, net profit/loss and recorded customer receipts, with source links and decimal-safe percentage comparisons. Zero prior activity is disclosed instead of inventing growth. Customer receipts are explicitly distinct from bank cash position.
- Revenue/gross/net area chart and exact daily values; real customer composition donut and financial bars; financial CSV export uses the authorized report already loaded.
- Current customer/lead counts, recent saved leads, due follow-ups, distinct active products, low/out-of-stock positions, stock value, priority stock records, all-time receivables, overdue invoice count/amount, recent sales and a sanitized business activity feed.
- Activity selects only actor name, event type, record ID and time, scoped by tenant plus organization/workspace metadata. Raw audit payloads, IP addresses and before/after values are not returned.
- Right-side business signals are explicitly deterministic rules with their data sources. No AI predictions, provider connection or autonomous execution is implied.
- Existing module/widget preferences remain server-persisted with version conflicts and atomic audit records. Presentation preferences do not grant authorization.

## Financial and date assumptions

Retail revenue is recognized at completion. Returns reduce revenue and COGS on the return date. Moving weighted-average recorded cost determines COGS. Approved/reimbursed expenses affect their incurred date. Payment receipts, refunds and reversals remain separate from recognized revenue. Manual payment entries do not confirm bank transfers. No currency conversion, tax accounting, supplier cash ledger or complete bank cash position is assumed.

Financial flows and prior-period comparisons follow the selected UTC range. Relationships, stock, receivables, overdue invoices and due follow-ups are explicitly labeled current snapshots. Recent leads, sales and activity are latest saved records across dates, not period acquisition metrics. A configurable organization timezone, weekly/monthly/quarterly chart grouping, target comparisons and date filtering of operational lists remain outstanding. Daily chart amounts are rounded for currency display; accounting continues in Decimal and currency-level totals are calculated independently from the ledger.

## Acceptance status and remaining work

| Requirement | Status |
| --- | --- |
| Source-backed financial and retail metrics | Implemented; automated evidence below |
| Tenant/org/workspace ownership and backend authorization | Existing retail checks retained; new dashboard tests added |
| Authorized workspace switching | Pending; current context display only |
| Per-widget permissions | Partial; each underlying endpoint checks permission; the combined operational overview currently requires CRM, sales, inventory and finance read access and otherwise shows a no-permission state |
| Permission-aware quick actions | Backend enforced; action-level UI capabilities remain incomplete |
| Customization persistence | Module/widget visibility on server; pins/expanded sections/date preset in scoped local storage; reorder/resize/business templates pending |
| Loading/empty/error states | Implemented; pure component and source checks; browser interactions unverified |
| Desktop/tablet/mobile usability | Responsive CSS implemented; visual and click-through verification blocked by browser policy |
| No fabricated business figures | Screenshot values are not used; unavailable metrics are disclosed |
| Business intelligence | Grounded rules only; safe AI execution/approvals, forecasts and provider connection pending |
| Full requested suite | Companies/deals/quotes/purchasing/supplier payables/billing/team administration/workflows/integrations are not completed by this increment |
| Production reliability | Backup restore drills, monitoring/recovery, deployment configuration and broader legacy-module security audit remain release gates |

Next smallest step: implement a server-authorized context list and session scope switch, clear scoped caches on change, and test denied cross-organization/workspace transitions. Then split overview aggregates by resource permission so authorized widgets remain useful for limited roles.

## Changed files for this increment

API: `retail-access.service.ts`, `retail-report.service.ts`, `shop.service.ts` under `apps/api/src/modules/retail`.

Web: dashboard route/provider selection; root loading/error/theme color; `shop-workspace.tsx`, `shop-navigation.tsx`, `shop-overview.tsx`, `shop-types.ts`, `shop-forms.tsx`, `shop-chart-data.ts`, plus new `dashboard-range.ts`, `dashboard-filters.tsx`, `dashboard-performance.tsx`, `shop-command-palette.tsx`, `shop-executive.css` under `apps/web/features/shop`.

Tests: `tests/dashboard-overview.test.mjs`, `tests/shop-design.test.mjs`, `tests/retail.integration.mjs`. README and scope references updated. Existing unrelated changes were preserved. No existing module was deleted and no production database was reset or migrated.

## Executed checks

- Source/unit suite: **257 passed, 0 failed, 0 skipped**. [Source evidence](verification/page-01-source-tests-2026-10-16.txt).
- Money/disposable PostgreSQL/HTTP suite: **49 passed, 0 failed, 0 skipped**, complete checked-in migrations applied only to its new empty cluster; cluster stopped and removed by the test runner. [Database evidence](verification/page-01-retail-tests-2026-10-16.txt). These suites overlap on money unit coverage; the counts are separate run results, not a unique-test total.
- Newly verified: daily source profit metrics (including expense-only days and returns in a later period), overdue invoice counts/amounts, current stock priorities, recent leads, scoped sanitized activity, persisted capability derivation, denied viewer reports and invalid workspace context. Existing transaction, rollback, overselling, idempotency, payment/refund and real AppModule tests also passed.
- API production build passed. An initial sandboxed compiler attempt crashed in native Node hashing (exit 134); the isolated retry completed, then an elevated confirmation build passed. No expectations were relaxed for that environment failure.
- Frontend production build passed: 240 routes generated, including `/dashboard` and `/shop`; lint/type validation completed. One retained legacy warning remains: unused `_plan` argument in `apps/web/lib/command-center.ts:36`. [Build evidence](verification/page-01-web-build-2026-10-16.txt).
- Final `npm run typecheck` passed (API and frontend, exit 0). [Type-check evidence](verification/page-01-typecheck-2026-10-16.txt). [API build evidence](verification/page-01-api-build-2026-10-16.txt).
- Browser rendering, mobile interaction, keyboard dialog behavior and pixel matching remain unverified: automatic browser security review denied localhost access, including after prior explicit user approval. No alternate browser bypass was attempted.
- No remaining failures in the two completed automated suites. No production readiness claim is made.

The original 33 legacy test failures remain documented individually in [failure triage](RETAIL-FAILURE-TRIAGE.md): 14 contradictory historical version expectations, 11 obsolete test boundaries and 8 outdated source/behavior assertions. They were not database connection failures. The current source suite passes without skips; retail product defects are verified by the separate real database tests.

Local startup passed: DATABASE_URL loaded without revealing its value; authenticated read-only PostgreSQL/schema checks passed; backend health and same-origin API gateway returned 200; launcher reported Application Ready and GET / returned 200. The development server remains running on http://localhost:3001 (dashboard route: /dashboard). [Startup evidence](verification/page-01-startup-2026-10-16.txt). No browser rendering is implied by these health checks. Background queues are disabled in the configured development mode; automation execution is not verified.
