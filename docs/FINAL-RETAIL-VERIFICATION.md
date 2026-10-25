# Final retail increment — 16 October 2026

The installed NEXORA desktop shortcut now launches the updated retail application at `http://localhost:3001`. The connected workflow is signup/login → saved business setup → authorized dashboard, CRM/follow-ups, inventory, sales/invoices, manual payments/returns, expenses and exact financial reports. This report describes executed checks, not a claim that every preserved enterprise module is complete.

## Completed in this increment

- Implemented actual SMTP transport with Nodemailer, Resend HTTP transport and SendGrid HTTP transport. Sending requires explicit enablement and configured credentials/sender. Remote SMTP requires validated TLS; plain unauthenticated SMTP is allowed only for explicitly enabled nonproduction loopback fixtures. Provider errors fail closed without exposing bodies, secrets or tokens. Provider acceptance means queued/accepted mail, not proof of inbox delivery.
- Added `/recover`, linked from login, for reset requests, token-based password reset and email verification. Mail includes the user's business ID. Profile displays that ID. Successful reset clears client credentials/query caches; the server consumes the reset hash and revokes sessions. Recovery uses the retail provider shell and existing dark design. Fonts use local system fallbacks.
- Recovery/verification routes have explicit throttles. Unknown/inactive account requests do not send arbitrary mail. Verification email addresses are normalized before signing tokens. Existing transaction, replay, membership and tenant ownership protections remain enforced.
- Settings now exposes independently computed create/update/approve capabilities. Forms, quick actions, record actions and command search follow these capabilities. Read-only payment history does not expose refund/reversal controls. A product creator without inventory update permission starts with zero stock. Server authorization remains the final authority.
- Desktop API exposure is restricted to the connected identity and retail endpoints through `desktop-retail-boundary.ts`. Legacy enterprise APIs and Swagger are unavailable in desktop mode; permitted business endpoints still require authentication, permissions and ownership checks. Production bootstrap behavior is preserved. Both desktop listeners remain bound to 127.0.0.1.
- Applied compatible dependency updates, including Next.js 15.5.28 in the lockfile, NestJS platform-express 11.2.7, Swagger 11.4.7 and Nodemailer 10.1.1. No automatic force upgrade, database reset/migration, module deletion or repository rebuild was performed.

## Exact executed results

| Check | Result | Evidence |
| --- | --- | --- |
| Complete source/unit suite | **276 passed, 0 failed, 0 skipped** | [Source results](verification/completion-source-tests-2026-10-16.txt) |
| Money/disposable PostgreSQL/HTTP suite | **65 passed, 0 failed, 0 skipped** | [Database results](verification/completion-retail-tests-2026-10-16.txt) |
| Encrypted backup/restore integration, separate run | **1 passed, 0 failed, 0 skipped** | Same database evidence, after the 65-test run |
| API build | Passed, exit 0 | [API build](verification/completion-api-build-2026-10-16.txt) |
| Frontend build | Passed, exit 0; 245 static pages generated | [Web build](verification/completion-web-build-2026-10-16.txt) |
| API/web type checks | Passed, exit 0 | [Types](verification/completion-typecheck-2026-10-16.txt) |
| Native launcher and API startup | Passed; icon verified; browser not opened | [Desktop lifecycle](verification/completion-desktop-lifecycle-2026-10-16.txt) |
| Desktop route isolation | Health 200, anonymous business access 401, legacy/Swagger/wrong-method requests 404 | Same desktop lifecycle evidence |
| Database connectivity after restart | Authenticated read-only schema check passed | Same desktop lifecycle evidence |
| Mail environment check | Disabled; required SMTP fields absent; no real email sent | [Configuration check](verification/completion-mail-config-2026-10-16.txt) |
| Dependency audit | **14 findings: 10 high, 4 moderate, 0 critical**; audit remains failing | [Full audit](verification/completion-dependency-audit-2026-10-16.json) |

The source and workflow suites overlap in money unit coverage; these are separate run counts. The existing unused `_plan` frontend lint warning remains. No test was skipped or disabled.

The new database scenario used a real disposable SMTP receiver that never relays mail: HTTP reset request → actual MIME message/signed token → stored token hash → HTTP reset → revoked session → replay rejection → login with the new password. Unknown accounts generated no mail. Inventory concurrency/rollback, payment reconciliation, known profit/currency cases, tenant separation and independent dashboard permissions still passed. Backup restoration compared exact rows in 14 models and verified restored revenue 60.00, COGS 20.00 and net profit 29.90. Migrations and restores used only new disposable clusters; persistent development and production data were not reset or migrated.

## Investigated failures

1. Source tests were started before the API build completed and two imports could not find compiled files. Corrected execution ordering and reran after build completion. [First-run evidence](verification/completion-source-first-run-2026-10-16.txt).
2. The first SMTP unit run returned false because the sandbox denied a loopback socket with `EACCES`. The same test passed with approved normal loopback access; no assertion was weakened.
3. The SMTP recovery HTTP scenario initially returned 500 because its lightweight test fixture supplied a signup-only mail stub without `sendPasswordResetEmail`. The fixture now attaches the actual provider service for that scenario; the expected HTTP success, persisted state and replay assertions are unchanged. [First-run evidence](verification/completion-retail-first-run-2026-10-16.txt).
4. The recovery SSR test imported an ESM React Query provider while the test loader transpiles application imports to CommonJS, producing separate contexts. The fixture now uses the same CommonJS package entry as the application loader. Its UI assertions are unchanged; the actual Next build also prerendered `/recover` successfully.
5. A restricted Windows frontend build could not canonicalize the workspace path and reported Access denied from the native compiler. The approved local build passed. No lint/type check was disabled.

Historical failing-test classifications remain in [retail failure triage](RETAIL-FAILURE-TRIAGE.md). Earlier checkpoints in [desktop verification](DESKTOP-VERIFICATION.md) and [identity verification](IDENTITY-WORKFLOW-VERIFICATION.md) remain preserved.

## Files changed in this increment

API: `main.ts`, new `common/middleware/desktop-retail-boundary.ts`, `auth.controller.ts`, `auth.service.ts`, `shop.service.ts`, `email.service.ts`, three mail providers and new `providers/mail-config.ts`.

Frontend: new `app/recover/page.tsx`, `shop-recovery.tsx`, `shop-action-permissions.ts`; revised `app-providers.tsx`, `shop-auth.tsx`, `shop-account-panels.tsx`, `shop-workspace.tsx`, `shop-overview.tsx`, `shop-command-palette.tsx` and `shop-forms.tsx`.

Configuration/tests: `.env.example`, root/API manifests and `package-lock.json`; new `check-mail-config.mjs`, `email-transport.test.mjs`, `shop-action-permissions.test.mjs`, `desktop-retail-boundary.test.mjs`, `helpers/smtp-receiver.mjs`; expanded `retail.integration.mjs`; reports and evidence. Existing uncommitted work was preserved.

## Exact blockers and remaining scope

**Real email:** local configuration has `EMAIL_DELIVERY_ENABLED` off and is missing `EMAIL_FROM`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`. Configure user-owned provider values privately in the ignored `.env`; never paste credentials into chat. Select `EMAIL_PROVIDER=smtp`, set a provider port, keep `SMTP_ALLOW_INSECURE_LOCAL=false`, and enable delivery only after configuration. Resend/SendGrid may instead use the corresponding key and a verified sender. `npm run mail:check` reports missing field names without values. Inbox delivery remains unverified; no real recipient was contacted.

**Security:** the full audit remains open. Findings include Prisma/config/deepmerge, Tailwind/globbing/selector dependencies, Next/PostCSS and Swagger/YAML dependency chains. Several suggested fixes require framework/tooling major migrations; a force upgrade would exceed the preserved-architecture constraint and needs its own compatibility work. Compatible upgrades removed critical findings, but this is not a clean security audit or production certification. The desktop route boundary reduces legacy exposure; it does not certify those modules for hosted use.

**Unimplemented business modules:** full quote/purchasing/supplier/payable lifecycles, team invitations, billing, configurable approvals/automations, live AI actions and forecasts are still not delivered. They are not represented as working retail features. Advanced enterprise additions remain excluded by the user's earlier scope rule. No AI provider/execution workflow is connected in the retail UI.

**Production/visual acceptance:** no hosted target, TLS deployment, independently verified off-device backups or production monitoring/recovery acceptance has been supplied/executed. Automatic browser security review still blocks localhost visual/click-through checks, including after earlier approval; no browser bypass was attempted. The native launcher was tested with `--verify`, not by opening its normal Edge window.

The next smallest acceptance step is a user-operated desktop launch and signup/setup/dashboard walkthrough. The next external step is private mail configuration and a user-authorized inbox delivery/recovery test. Before a hosted release, resolve dependency migrations and deployment/security acceptance. Remaining modules require additional implementation; this increment cannot honestly be labelled “all pending work complete” or “100% production ready.”

Transport references used: [Nodemailer SMTP](https://nodemailer.com/smtp), [Resend Send Email](https://resend.com/docs/api-reference/emails/send-email), [SendGrid Mail Send](https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send).
