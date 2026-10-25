# NEXORA retail demo verification - 15 October 2026

> Historical snapshot. See [16 October workflow verification](RETAIL-WORKFLOW-VERIFICATION.md) for the subsequent fixes, passing suites and current limitations.

## Delivered scope

The existing Next.js, NestJS, Prisma and PostgreSQL architecture is retained. No production database was migrated/reset, no existing module was deleted, and no external deployment was performed.

The primary application at `/` and `/shop` now has one retail navigation and a scoped light design system: overview, customers/leads, follow-ups, inventory, sales/payments, expenses, profit/loss and settings. It includes native modal focus handling, loading/error/empty states, responsive navigation, explicit form labels and exact decimal-string amount presentation. These are implemented controls; browser visual/accessibility behavior remains unverified because browser access was denied.

The retail route uses the existing auth/query/theme providers without activating the preserved enterprise dashboard or AI recommendation providers. Legacy modules and routes remain in the repository, outside retail navigation. They have not received a full security review.

Customer and product records support create, search, pagination and edit. Follow-ups use persisted tasks linked to an authorized customer, with due dates, priority, completion and reopening. The catalog records opening value through the existing atomic inventory ledger. Product edits preserve historical sale prices and stock value. Receipts/adjustments show their movement history.

Sales retain draft/complete/return/cancel transitions. A sale can link a verified customer; its invoice preserves the customer's name at creation. Payment forms record partial/manual receipts and ledger corrections rather than initiating transfers. Expenses are explicitly approved when saved. Reporting separates completed sales, returns, recognized revenue, COGS, expenses, gross/net profit and customer cash. Its chart is derived from recorded transactions grouped by UTC date. CSV export uses exact report values and escapes formula-like user labels.

Settings require a chosen business currency; none is invented for a new shop. Currency changes are rejected after products or financial records exist. Supported reference currencies are INR, USD, EUR, GBP, CAD, AUD, JPY and KWD. These are ISO reference options, not business fixtures.

## Verification executed

| Check | Result |
| --- | --- |
| `npm run api:build` | Passed. |
| `npm run web:build` | Passed; 240 static routes generated. Two existing lint warnings remain in legacy global search/command-center code. |
| Built API rewrite inspection | Confirmed the production build proxy targets the configured local backend on port 4001. |
| `npm run typecheck` | Passed for API and frontend. |
| `npm run retail:test` | **40 passed, 0 failed, 0 skipped**. |
| `node --test tests/local-development-env.test.mjs` | **12 passed, 0 failed, 0 skipped**. |
| `node --test --test-concurrency=1 tests/*.test.mjs` | **237 tests: 202 passed, 35 failed, 0 skipped**. Includes the 12 environment and 6 money tests; do not add these counts twice. |
| `git diff --check` | Passed. |
| Portfolio TypeScript and targeted ESLint | Passed after excluding the two independent application checkouts and temporary files from the portfolio compiler. |
| Updated resume PDF | Generated, extracted and rendered; one page inspected without clipping/overlap. NEXORA is project 02. |
| Full application development startup | Launcher authenticated to its owned local PostgreSQL cluster, booted the full API and frontend, and reported successful backend/frontend/proxy health. |
| Browser visual/click-through checks | **Blocked.** Browser policy denied localhost:3001; a user-approved retry was also denied. No alternate browser or indirect screenshot method was used. |

The first expanded integration run found a signup normalization-order regression (39/40 passed). The authorization check was moved before email normalization, then the backend rebuilt and the complete fresh-database suite passed 40/40. No expectations were weakened or tests skipped.

## Database actually exercised

The runner creates a new loopback-only PostgreSQL cluster under `tests/.runtime/cluster-*`, verifies the PostgreSQL data directory, creates a uniquely named disposable database, and applies the **entire checked-in migration chain**. It has no fallback to the application's DATABASE_URL. It stops that cluster and removes only its verified generated directory after tests. No production database or existing development database is reset.

The 40 tests execute decimal/currency behavior, stock receipts and adjustments, concurrent overselling prevention, retry protection, rollback after injected database errors, sale returns/cancellations, partial payments, refunds/reversals, persisted permissions and membership revocation. New scenarios additionally exercise customer search/edit/pagination, follow-up persistence/completion, atomic catalog creation, product editing without historical price changes, expense retry protection, real Argon2 signup/login/logout, ambiguous-email tenant selection, and two separate businesses through HTTP controllers with the production JWT guard and DTO validation. Outbound email is deliberately disabled in this isolated test harness.

Known shop scenario: opening stock 10 at cost 10.00; completed sale 3 at 30.00; customer payment 50.00; return 1; approved expense 10.10. Verified results: gross sales **90.00**, returns **30.00**, recognized revenue **60.00**, COGS **20.00**, gross profit **40.00**, net profit **29.90**, net customer cash **50.00**, outstanding **10.00**, inventory value **80.00**. All figures use INR decimal precision. The daily report also reconciles to 60.00.

## Remaining failures and limits

The original **33 historical failures** remain: incompatible historical package versions, navigation-facade/source-shape assumptions, and outdated endpoint/component/identity contracts. Each is investigated in [RETAIL-FAILURE-TRIAGE.md](RETAIL-FAILURE-TRIAGE.md).

Two additional source assertions now fail:

1. `phase2-landing-auth.test.mjs` requires the root route to render the old enterprise `LandingPage`. The requested retail app now renders `ShopWorkspace`; the original marketing component is preserved. The assertion was not changed to manufacture a green result.
2. `phase8-gold-master.test.mjs` flags every `TODO` token as unfinished code, including the existing database task status used in the new follow-up types/UI. It reports the two retail files containing that legitimate enum value. This needs a comment-aware marker scanner rather than renaming business states to evade the check.

No runtime stock/payment defect was demonstrated by those two source assertions. Browser verification is nevertheless required before calling the new interface validated.

Other open boundaries: localStorage auth/refresh storage, legacy-route authorization, public deployment/operational monitoring, email delivery, real payment-provider settlement, tax/FX/statutory accounting and Redis/background workers. The existing mail providers contain placeholder implementations; email delivery is **not** claimed. The retail UI does not offer those integrations or AI-generated business claims. Inventory events are persisted pending dispatch; an outbox worker is not part of this increment. Old financial data may require reconciliation. New-account provisioning is not a single atomic transaction across credentials, workspace and email and needs hardening before a public signup launch.

## Portfolio and resume

The containing portfolio now lists NEXORA as project **02**, with the actual retail stack, transaction/tenancy decisions and verified scope. Its NEXORA case study, homepage project data, web resume and generated PDF were updated. EVA's existing entry remains and is labeled 01. Original edited portfolio content and PDF were preserved in `../tmp/nexora-retail-before-update/`. No public demo/repository/contact URL was invented; the resume uses contact details available on request.

Portfolio files changed: `components/portfolio-pages.tsx`, `lib/portfolio-config.ts`, `app/projects/nexora-ai/page.tsx`, `tsconfig.json`, `scripts/generate_resume.py`, and `public/Anchal-Sharma-Resume.pdf` in the containing portfolio root. The portfolio compiler excludes its independent nested apps and temporary files; it does not use NEXORA's aliases or backend decorator configuration.

## Implementation files

- API: `shop.controller.ts`, `shop.dto.ts`, `shop.service.ts`, retail controller/module DTO integration, customer-linked sale list/create, daily report data, and normalized/tenant-explicit login in `auth.service.ts`.
- Frontend: `features/shop/shop-workspace.tsx`, `shop-auth.tsx`, `shop-forms.tsx`, `shop-types.ts`, `shop.css`, `app/shop/page.tsx`, root route/metadata and retail provider composition.
- Development/build: retained the previous safe local environment work; added `scripts/build-web.mjs`, updated frontend build script and bounded build cleanup to exact generated Next artifacts. Source backup files are preserved.
- Verification: `tests/retail.integration.mjs` and `scripts/run-retail-tests.mjs`; evidence in `docs/verification/shop-retail-tests.txt` and `shop-source-tests.txt`.

## Next smallest step

Manually verify the UI at localhost:3001, or restore approved browser access in a later session. Walk through signup, currency setup, product receipt, customer follow-up, sale completion, partial receipt, return and exact report reconciliation on desktop and mobile. Then repair the historical source-test contracts on their own reviewed merits and complete public-exposure security checks before deployment.
