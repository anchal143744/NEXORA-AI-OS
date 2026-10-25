# NEXORA workspace design — 16 October 2026

> The later [revised product scope](PRODUCT-SCOPE.md) supersedes the navigation labels below and adds persisted workspace customization. This report retains the earlier design verification snapshot.

## Implemented design

The reference palette is used throughout the retail login, workspace, forms, dialogs, tables, reports and loading/error states:

| Token | Color | Use |
| --- | --- | --- |
| Smoky Black | `#11120D` | Sidebar, primary actions, principal text and featured revenue card |
| Olive Drab | `#565449` | Chart bars, navigation accents, secondary text |
| Bone | `#D8CFBC` | Donut segment, borders, identity surfaces and warm panels |
| Floral White | `#FFFBF4` | Application canvas and form surfaces |

Subtle derived neutrals and restrained semantic error/success colors preserve readability. Display headings use locally available Georgia with a serif fallback; controls and data use Segoe UI/Arial. No remote font download is required. Financial values retain exact decimal-string labels and tabular numerals.

The requested navigation hierarchy is represented: Workspace; Business with CRM, Sales, Inventory and Finance; Operations; Intelligence; Administration; Help & Support, Settings and Profile. Branches expand/collapse independently. Active child navigation opens its branch. The sidebar scrolls independently; the mobile drawer hides closed navigation from keyboard focus, handles Escape, traps focus while open and restores prior focus/scroll state on close. These behaviors are implemented; browser interaction verification remains outstanding.

## Live dashboard

- Four headline cards separate recognized revenue, net profit/loss, gross customer receipts and all-time outstanding balances.
- Revenue bars use the selected reporting month and actual net recognized revenue grouped by UTC date. Missing dates within the period are zero activity; negative values remain negative and receive a distinct color. Tooltips and an expandable table retain exact amounts.
- A customer donut splits the persisted relationship total into leads and established customers. It explicitly describes a count breakdown, not a conversion rate. An empty organization shows a neutral ring and zero records.
- Financial comparison bars show revenue, COGS, operating expenses and net profit/loss from the reconciled report. Numbers converted to JavaScript numeric values are only drawing coordinates; accounting and exact labels remain decimal-safe.
- Follow-ups, low-stock counts and recent sales retain the existing authorized queries and actions. No sample customers, seed revenue, invented growth percentages or fabricated forecasts are introduced.

Leads now use a validated, server-side lifecycle filter before pagination/counting. Changing a lead into a customer removes it from the lead result set. Search, tenant scope and current membership checks remain enforced.

## Navigation availability

Implemented entries link to the existing retail capabilities. Shared destinations are intentional: Sales Orders, Invoices and Payments open the reconciled sale/invoice ledger with its payment actions; Returns opens its returned-sale search; Products, Stock Levels and Stock Movements open the product ledger with per-product movement history. Income & Expenses opens recorded expenses; Financial Reports/Analytics open the profit/loss and customer-cash report. These are not claims of separate new accounting modules. Help provides the actual workflow and boundaries; Profile displays the signed-in identity.

Unavailable entries are disabled and marked **Soon**, with an explanatory title. AI Command Center, general tasks/notifications, Companies, Deals, Activities, Quotes, Categories, separate warehouse administration, Transfers, Purchase Orders, Suppliers, full Cash Flow, Receivables/Payables screens, Workflows, Approvals, Automations, Integrations, AI Insights, Forecasts, Team, Roles and Billing are not implemented by this design change. Existing legacy modules remain preserved and are not presented as verified retail integrations.

## Verification and limits

The source/unit suite passes **249/249**, zero skipped, including four new chart/navigation component/model tests. These exercise UTC date coverage and leap years, negative returns, exact labels, empty donut state, customer count composition, required navigation structure and disabled unavailable entries. Server-rendered component checks are not browser visual tests.

The isolated PostgreSQL suite passes **44/44**, zero skipped. Its customer HTTP assertions additionally verify lifecycle filtering, rejection of invalid stages and removal from lead results after conversion to customer. All existing stock, authorization, payment, rollback and complete-application scenarios still pass. API production build and API/frontend type checks pass. Evidence: [source/unit results](verification/design-source-tests-2026-10-16.txt) and [PostgreSQL results](verification/design-retail-tests-2026-10-16.txt). Six money tests occur in both suites; the totals are not independent coverage.

Frontend production build passes with **240 routes generated**. One preserved legacy lint warning remains for the unused command-center `_plan` argument. The build checks include frontend TypeScript validation; they do not certify rendered desktop/mobile layout.

The final local launcher reported **Application Ready** at `http://localhost:3001`: authenticated PostgreSQL/schema checks passed, frontend returned HTTP 200 and the API health check returned HTTP 200 through the same frontend proxy. The development server remains running.

The initial source run hit a temporary missing compiled money module while the API build was replacing its output, and an old test that expected navigation labels inline in the extracted workspace component. The build completed; the entry-point test now checks the actual navigation registry and continued reachability of every existing retail view. The complete subsequent suite passes without skips.

Browser visual/click-through verification remains blocked by the earlier automatic security review of localhost:3001, including its user-approved retry. No alternate browser, browser protocol or indirect screenshot workaround was used. Desktop/mobile spacing, rendered charts, keyboard interactions and screenshots cannot be certified from source/component tests alone. The next smallest verification is an authorized desktop/mobile acceptance pass through signup, the new sidebar, record creation, sale/payment/return and report charts.

## Files

New frontend files: `features/shop/shop-navigation.tsx`, `shop-overview.tsx`, `shop-charts.tsx`, `shop-chart-data.ts`, `shop-account-panels.tsx`, `shop-theme.css`. Updated: `shop-workspace.tsx`, `shop.css`, root metadata/loading/error colors. API: `shop.dto.ts`, `shop.controller.ts`, `shop.service.ts`. Tests: `shop-design.test.mjs`, customer lifecycle integration assertions, and the entry-point navigation contract. No dependency, database schema, production data or legacy module was removed or replaced.
