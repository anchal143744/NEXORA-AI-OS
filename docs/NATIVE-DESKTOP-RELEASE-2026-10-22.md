# NEXORA native desktop release verification — 22 October 2026

## Latest remaining-work continuation — 24 October 2026

**Decision: NO-GO for a production Windows release.** Independent release fixes and their runtime checks below are complete. Microsoft SignTool is now provisioned and verified; the trusted publisher certificate is still unavailable. The freshly compiled native EXE/MSI remains unsigned, uninstalled and unopened. Installation, first native launch and signed upgrade/reinstall acceptance have not executed.

This section supersedes the earlier 24 October checkpoint below, including its statement that SignTool was unavailable. The prior financial/browser verification remains valid evidence with its stated scope; it is not native-window acceptance.

### Implemented and verified now

- Prepared Microsoft's official **Windows SDK BuildTools 10.0.28000.2705** inside this workspace, without a system installer. The pinned archive SHA-256 is `8BFDFB6CA2633F531CF80B5FA22512BA61A394D7988F0970DB83BAADC67929ED`. Seven signing-tool files are checked against that archive and their Microsoft Authenticode signatures before use; unexpected adjacent DLLs are refused. The resolver supports this bundle automatically. The actual SignTool verified trusted Node, rejected unsigned NEXORA without executing NEXORA, and rejected a modified signing library. This is the [Microsoft-documented SDK BuildTools distribution](https://learn.microsoft.com/en-us/azure/artifact-signing/how-to-signing-integrations#download-and-install-signtool), not provisioning of a signing identity/cloud account.
- Fixed the child shutdown listener race by registering exit observation before requesting shutdown. Cleanup is idempotent. Next's IPC preload now invokes graceful cleanup once when its supervisor disconnects, preventing an abandoned frontend listener after parent loss.
- Added real disposable frontend/API lifecycle verification. Authenticated shutdown and deliberate parent IPC loss both executed successfully. Both listeners closed; frontend exit was zero without forced termination; API closed; source bytes restored exactly. Normal close leaves PostgreSQL ownership with the runner. Parent loss also stops only the session's verified disposable cluster after checking the captured postmaster identity. These tests execute HTTP/process/database behavior; they do not execute a browser or native window.
- Added durable source snapshots, a single-fixture lease, frontend process identity and guarded recovery. Both source files validate before either write, so an independent declaration edit cannot trigger a partially restored tsconfig. Recovery refuses live owner/frontend processes, ownership mismatch and independent edits. A stopped synthetic owner was recovered in tests. A real external hard kill/power-loss recovery was not performed.
- Moved the active test PostgreSQL log outside PGDATA, gave command/frontend logs unique names, retained failed disposable clusters for diagnosis, and rejected conflicting/unknown runner modes before creating a database. No existing user cluster was reset, migrated or deleted.

The original historical fixture's external process interruption is **not conclusively diagnosed**. Its PostgreSQL log recorded sharing/fsync problems involving a log inside PGDATA. The new placement avoids that specific contention, and controlled parent-loss recovery is now verified; that does not prove the original interruption's cause or guarantee recovery from every OS failure.

### Exact checks executed

Evidence below is in `docs/verification`. Counts are per command and may overlap; repeated runs are not additional unique tests.

| Check | Actual result / evidence |
| --- | --- |
| `node --test --test-concurrency=1 tests/*.test.mjs` | **319 passed, 0 failed, 0 skipped**; `remaining-source-tests-2026-10-24.txt`. The final expanded source-recovery checks were rerun separately: **6 passed**, included in that source-suite count, `remaining-source-recovery-final-2026-10-24.txt`. |
| `node scripts/run-retail-tests.mjs` | **73 database/API/money tests + 1 encrypted backup/restore passed**, zero failures/skips; `remaining-retail-tests-2026-10-24.txt`. New disposable PostgreSQL only, complete checked-in migrations. |
| `npm run retail:ui:fixture:test` | **2 passed**, zero failures/skips; final run `remaining-fixture-child-identity-2026-10-24.txt`. Real frontend/API normal shutdown and parent-loss shutdown, durable frontend identity, exact configuration preservation, disposable DB stop. |
| Microsoft signing-tool integration tests | **3 passed**, zero failures/skips; `remaining-signing-tool-tests-2026-10-24.txt`. No NEXORA target execution. |
| Publisher/package/startup-error/DPAPI tests | **15 passed**, zero failures/skips; `remaining-launcher-tests-2026-10-24.txt`. Missing certificate and unsigned installation paths remain fail-closed. |
| Native host/MSI build and actual cabinet inspection | **1 passed**; `remaining-msi-tests-2026-10-24.txt`. C# compiled, nine payload files, two shortcut definitions and cabinet hashes inspected. No MSI installation or unsigned EXE execution. |
| Actual owned application service lifecycle | **1 passed**; `remaining-desktop-lifecycle-2026-10-24.txt`. Start/reuse/graceful stop/restart, HTTP/auth boundary, existing saved-data/configuration preservation. Local services left running. |
| Running frontend/API CORS, CSP and authentication boundary | **2 passed**; `remaining-http-security-2026-10-24.txt`. |
| `npm run typecheck`, `npm run lint`, `npm run web:lint` | Passed; `remaining-typecheck`, `remaining-api-lint`, `remaining-web-lint` dated 2026-10-24. These are the repository's scoped lint checks. |
| Full / production `npm audit` | Both **0 critical, 0 high, 0 moderate, 0 low**; `remaining-dependency-audit-2026-10-24.json`, `remaining-production-audit-2026-10-24.json`. No suppression or forced upgrades. Dependency versions were unchanged in this continuation. |
| Artifact / runtime integrity after service startup | All **10 artifact hashes, 55,509 runtime hashes and Node hash matched**; `remaining-artifact-integrity-2026-10-24.json`. |
| Configured-secret artifact scan | Passed across **2,774 files**, checking two configured secret literals without printing their values; `remaining-artifact-secret-scan-2026-10-24.txt`. Limited literal scan, not comprehensive malware/secret certification. |
| Signing prerequisites / actual NEXORA signatures | SignTool available, **0 certificate candidates**, readiness correctly false; `remaining-signing-state-final-2026-10-24.json`, `remaining-signing-readiness-2026-10-24.txt`. EXE/MSI both **NotSigned**, no timestamps; `remaining-nexora-signatures-2026-10-24.json`. |

No API/web TypeScript or CSS implementation changed in this remaining-work continuation. The previously executed production API/web builds and final authentication frontend build remain recorded in `finalize-build-2026-10-24.txt` and `finalize-web-build-final-auth-2026-10-24.txt`; those builds were **not repeated** here. The affected native build/package was rebuilt and inspected above. Existing Tailwind ESM configuration and `_plan` warnings remain.

The fresh preservation baseline was captured read-only while owned services were stopped. The actual lifecycle comparison found **all 822 existing table hashes unchanged** and preserved `.env`, legacy executable/configuration and the desktop shortcut. The user database was only started using its existing ownership marker; no initialization, migration, reset or deletion occurred. All migrations and business writes in the database suites used new designated disposable clusters.

Earlier attempts are retained: `remaining-source-tests-sandbox-attempt-2026-10-24.txt` has 316 passes/3 failures from denied loopback HTTP/SMTP connections (`EACCES`). The authorized rerun passed all 319 without expectation changes. `remaining-signing-tool-tests-first-attempt-2026-10-24.txt` records a negative-test harness issue: Windows PowerShell treated SignTool's expected unsigned-file stderr as a terminating native error. The harness now captures the actual nonzero exit and still requires `NotSigned`; all three tests passed. No failing product tests were disabled.

### Current diagnostic artifact — do not install or open

```text
C:\Users\Acer\OneDrive\Documents\PORTFOLIOV1\NEXORA_AI\.local\windows-releases\814c42921f5244b3a9857e4ec20ae46e\NEXORA-1.9.0-x64.msi
MSI SHA-256: 4B8A990EF5F995DE925D19B853DDB416207A3AE9190407626046AE8B1F3BA7A5
EXE SHA-256: 2EB5C76BBC3AC58787B392506304FA7939374FDC9352C8AC59443EF562EA77D6
EXE / MSI: NotSigned; timestamps absent; installed/opened: no.
```

The legacy launcher and actual desktop shortcut remain preserved. A successful service test is not a successful native-window test. The separately running web application is available at http://localhost:3001/login.

### Remaining gates and exact next step

1. Provision a legitimate trusted code-signing certificate for the actual publisher, with its hardware/HSM/CSP key accessible to the publishing identity through the Windows certificate store. Human/provider identity validation is external; no certificate was purchased, fabricated, imported or trusted here. No secrets or private keys should be sent in chat.
2. In the workspace PowerShell session, set the actual `NEXORA_SIGNING_CERT_THUMBPRINT` and provider RFC3161 HTTPS `NEXORA_SIGNING_TIMESTAMP_URL`. SignTool is already prepared; optionally set `NEXORA_SIGNTOOL_PATH` to `.local/tools/windows-sdk/10.0.28000.2705/x64/signtool.exe` using `Resolve-Path`. Run `npm run desktop:signing:check`, then **`npm run desktop:release`**. It must produce trusted, timestamped EXE/MSI/catalog output. Exact verification and installation commands are in [WINDOWS-SIGNING.md](WINDOWS-SIGNING.md).
3. Verify all signed outputs with SignTool and the independently known publisher identity before installing the signed MSI. Only then launch the installed app using `Start-Process "$env:LOCALAPPDATA\Programs\NEXORA\NEXORA.exe"`. Execute native shortcut/first-launch/authentication/single-instance/close/recovery and signed upgrade/repair/uninstall/reinstall preservation acceptance. None of these installed-native acceptance results is claimed here. Preserve the legacy launcher until they pass.

The installer is still a companion to the existing configured workspace, not a standalone clean-PC bundle. Other open risks remain: CSP inline-script permission, same-user/cloud-sync exposure, browser compatibility beyond the tested engine, unexecuted standalone Playwright CLI/CI path, and broader enterprise modules/provider integrations outside the verified retail flow. The earlier approved CUA browser financial flow is retained; the new HTTP fixture tests do not replace its browser evidence or native acceptance. A zero dependency audit is not a 100% security claim.

Changed in this continuation: `package.json`; `scripts/run-retail-tests.mjs`, `scripts/desktop-child-control.cjs`, `scripts/recover-disposable-ui-source.mjs`; `scripts/desktop/publisher-signing.ps1`, new `prepare-signing-tools.ps1`; disposable UI runtime/session helpers and new source-configuration, cluster-stop and lifecycle helpers; `tests/desktop-control.test.mjs`, new source-recovery and SignTool integration tests; README, signing guide, [disposable fixture instructions](DISPOSABLE-UI-VERIFICATION.md), this report and verification evidence. No application architecture rewrite, removal of existing modules, production data mutation, unsigned NEXORA execution or Windows-protection bypass occurred.

## Earlier 24 October checkpoint — superseded by the continuation above

**Decision remains NO-GO.** The five remaining high dependency findings are resolved, and the requested retail workflow has now executed through the approved browser, real API and designated disposable PostgreSQL database. Trusted signing and native installation/runtime acceptance remain blocked. Neither the diagnostic EXE nor MSI was installed or executed. The legacy launcher and shortcut remain preserved.

This section supersedes the earlier checkpoint below. Evidence filenames retain the dates of their runs; final signing/audit/package checks use the continuation date. A passing browser workflow is separate from native WebView2 acceptance.

### Dependency repair and compatibility

The five high entries shared the unpatched braces dependency chain. Tenant-supplied glob/CSS compilation was not found in the connected retail API; the exposed consumers were build/watch tooling. That bounded exposure assessment did not justify retaining the findings.

| Finding before repair | Severity | Actual repair / current result |
| --- | --- | --- |
| braces 3.0.3 | High | Removed the Tailwind 3 dependency chain; no unsafe override to an invented patched braces release. |
| micromatch 4.0.8 | High | Removed its vulnerable braces-consuming path. |
| fast-glob 3.3.3 | High | Removed its vulnerable micromatch-consuming path. |
| chokidar 3.6.0 | High | Tailwind's version 3 path removed. Other consumers retain non-vulnerable chokidar 4.0.3. |
| tailwindcss 3.4.19 | High | Reviewed migration to pinned Tailwind 4.3.3 and matching @tailwindcss/postcss 4.3.3. |

**Latest full and production audits: 0 critical, 0 high, 0 moderate, 0 low.** No advisory was suppressed, no dependency was moved to hide it, and no forced audit upgrade was used. The existing Next 15, Prisma 6 and Nest framework majors remain unchanged. Evidence: `finalize-audit-after-additional-fixes-2026-10-24.json`, `finalize-security-scan-after-fixes-2026-10-24.txt`, and `finalize-dependency-paths-2026-10-22.txt` under `docs/verification`.

The initial refreshed 24 October audit reported **six additional entries: four high and two moderate** after advisory updates. That nonzero result is retained as `finalize-audit-2026-10-24.json`; its production audit reported four high/one moderate. These are separate from the five Tailwind-chain findings and were also repaired before the final zero result:

| Additional finding | Severity / inspected exposure | Compatible fix |
| --- | --- | --- |
| body-parser 2.3.0 | High; Express parses compressed JSON/forms before routing/authentication, so the denial-of-service path matters even for authenticated business routes. | Narrow override to 2.4.0; bounded corrupt gzip and ordinary JSON/form requests tested with subsequent health checks. |
| multer 2.4.0 | High; the advisory requires an asynchronous fileFilter. No configured async Multer filter was found in connected retail routes; the Nest adapter still includes the package. | Narrow override to 2.5.0; actual multipart rejection with a pending async callback tested. |
| @nestjs/platform-express 11.2.7 | High inherited from its exact multer 2.4.0 pin. The audit suggested a framework version change. | Retained 11.2.7 and patched its consumer using the same-major override; no framework downgrade. |
| zod 4.4.3 | High; environment/form schemas and generic validation consumers, with broad preserved modules. Unbounded collection exposure was not proven absent. | Pinned API and web to 4.6.6; oversized constrained collection rejects with one bounds issue; actual build/auth tests cover compatibility. |
| nodemailer 10.1.1 | Moderate; recipient parsing can redirect messages when crafted display/comment text is accepted. Real mail remains disabled unless configured, and connected authentication validates addresses. | Patch 10.1.4; local MIME/envelope test proves nested comments cannot replace the recipient; disposable SMTP transport tests also run. No external email sent. |
| fast-uri 3.1.8 | Moderate plus lower-severity advisories; AJV/build-schema URI tooling. No use as the desktop URL authorization parser was found. | Patch 3.1.9; encoded scheme rejection and ordinary relative schema resolution tested. |

Only six installed package versions changed in this second repair, including body-parser's required iconv-lite patch. Existing frameworks remained fixed. New bounded regression tests are in `tests/dependency-request-security.test.mjs`; all five passed. Primary advisories: [body-parser](https://github.com/advisories/GHSA-27r3-jxmh-p828), [multer](https://github.com/advisories/GHSA-q7qp-rjg7-q26m), [Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), [Nodemailer](https://github.com/advisories/GHSA-8c8m-p3m8-cjg8), [fast-uri](https://github.com/advisories/GHSA-w74x-v6f9-j3xg). Exposure statements above are code-review inferences, not guarantees for every preserved module.

The migration changes the PostCSS plugin and stylesheet entry directives, explicitly loads the existing TypeScript theme, registers custom variant utilities, and preserves container, ring, shadow, blur, border, placeholder and cursor defaults. Global resets now sit in the base layer so utility typography can override them. Actual compiler tests check theme values, responsive/group/peer/arbitrary variants and unresolved directives; the complete application builds and the dark retail UI was visually inspected. CSS is **not byte-identical** to Tailwind 3. Supported browsers must satisfy Tailwind 4's modern CSS requirements; the tested browser is not evidence for all browser/old WebView2 versions. See [Tailwind's migration guide](https://tailwindcss.com/docs/upgrade-guide) and [the braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

### Implemented fixes and actual UI evidence

- Corrected the disposable UI fixture's cookie-origin setup: its chosen frontend origin is configured before Nest initialization. The earlier fixture's signup 401 was a test-environment configuration defect, not a successful application test. External messaging/AI credentials are removed from the fixture environment and email delivery is disabled.
- Shared the disposable runtime between the existing two-scenario Playwright specification and approved browser-session helper. Both require the designated generated database name, loopback host and verified PostgreSQL data directory. No real workspace database or web server is a fallback. The ordinary runner still runs every database test and encrypted restore; the explicitly named `--ui-only-session` initializes a fresh fixture for browser work and is not reported as an API test run.
- Expanded inventory and refund assertions in the UI specification. Corrected select-label locators after observing that native select labels include option text; financial expectations were not relaxed.
- Fixed a reproduced signup/setup navigation race: the authenticated workspace previously mounted while still on the auth/setup URL, so a fast-opened customer form could disappear when navigation remounted the page. Auth, logout and setup/dashboard route transitions now render a status screen until the canonical destination mounts. Removed the auth form's duplicate redirect; its parent now owns that transition. The first loading-only repair exposed a competing-redirect stall in the browser and was corrected before acceptance. Two component regressions cover the transient routes; `finalize-navigation-single-owner-tests-2026-10-24.txt` records six passing identity tests, including the two additions.
- Corrected the disposable UI helper to restore only Next's known generated type-configuration changes. Unknown concurrent changes are preserved and cause verification to fail instead of being overwritten. Actual post-session hashes confirmed `tsconfig.json` and `next-env.d.ts` restored byte for byte (`finalize-ui-source-preservation-2026-10-24.json`).
- Corrected native browser-process recovery to recreate the WebView2 control after `BrowserProcessExited`, ignore self-recovering GPU/utility failures, and clear disabled/retry UI on successful startup. Compilation/package checks verify this implementation; the crash/retry behavior has **not executed in the native host**. [Microsoft documents browser-process recreation separately from other failures](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/process-related-events).

The approved browser used separate generated frontends and new disposable clusters, including the full workflow on `127.0.0.1:64052` after the additional dependency fixes (the earlier run used port 57325). The real workspace database was never used for these writes. The two prepared scenarios were exercised as one continuous approved-browser workflow; **the standalone Playwright CLI runner was not executed** and no CLI pass count is claimed. No alternate browser/CDP bypass was used.

| Actual browser action and persisted checkpoint | Verified result |
| --- | --- |
| Signup → business setup → empty dashboard | Synthetic private business and INR currency saved; initial financial values zero. |
| Add customer; reload Contacts | Customer persisted. |
| Add product at price 30.00, cost 10.00, opening stock 10 | Persisted product and opening ledger. |
| Receipt +5, adjustment -2 with reasons; reload/history | Quantity 13, value 130.00; OPENING/RECEIPT/ADJUSTMENT visible and persisted. |
| Create customer-linked sale, 3 × 30.00; complete | Invoice 90.00, stock 10/value 100.00, sale movement persisted. |
| Attempt payment 100.00 | Actual validation error: payment exceeds outstanding balance. |
| Record partial payment 50.00 | Invoice paid 50.00, due 40.00, PARTIALLY_PAID. |
| Record refund 10.00 | Invoice paid 40.00, due 50.00; net customer cash 40.00. Refund without goods return reopens the balance. |
| Record expense 10.10; reload dashboard | Revenue 90.00, COGS 30.00, gross profit 60.00, net profit 49.90, net receipts 40.00, receivables 50.00, stock value 100.00. |
| Sign out → sign in → reload | Session restored and the same recorded totals loaded. |

The customer-receipts headline correctly shows **gross receipts 50.00**; the financial overview separately shows **net receipts 40.00** after the refund. Neither is a bank balance. Four read-only database/API checkpoints verify actual stored records and report totals: `finalize-ui-stock`, `finalize-ui-payment`, `finalize-ui-refund`, `finalize-ui-final` JSON files dated 2026-10-24. Browser request evidence is `finalize-approved-ui-2026-10-24.txt`; the loaded synthetic dashboard screenshot is `finalize-approved-ui-dashboard-2026-10-24.png`. Earlier 22 October evidence is retained. The fixture and its generated cluster were stopped after testing.

After the final redirect repair, another fresh disposable fixture on port 49971 verified **automatic** signup → canonical setup → canonical dashboard, an immediately opened customer form retaining its draft, saved customer persistence after reload, logout → canonical login and login → dashboard without reload. Evidence: `finalize-approved-ui-navigation-2026-10-24.txt`, `finalize-navigation-browser-result-2026-10-24.json`, and `finalize-navigation-persistence-2026-10-24.png`.

That later fixture became unavailable after the browser steps, before an extra direct-SQL customer/shutdown check; PostgreSQL connection initially failed (P1001) and its runner/control process was no longer present. A guarded restart of **only that stopped disposable cluster** timed out while PostgreSQL performed normal WAL recovery; its log recorded a file sharing violation, fsync delay and eventual readiness. The subsequent read-only SQL check **passed** and that recovered test database stopped gracefully (`finalize-navigation-recovered-check-2026-10-24.txt`). No reset, migration, recovery override or Windows-protection change was used. **Graceful shutdown of the interrupted full frontend/API fixture remains unverified**; the cause of its process interruption is unresolved. The disposable cluster is retained for diagnosis and the real workspace database was never substituted.

Next declarations were recovered against their pre-test hash. Only the known generated include entry was removed from tsconfig, preserving every other current setting; its byte hash differs from the pre-test snapshot, so exact byte restoration is not claimed for this interrupted fixture. Durable ignored source snapshots were added for future interrupted-test recovery; this addition was syntax-checked, not exercised through another interruption. The earlier full financial fixture completed all four SQL/API checkpoints and byte-for-byte configuration restoration normally.

### Checks actually executed in this continuation

| Check / command | Result and evidence in docs/verification |
| --- | --- |
| `npm run build`; final `npm run web:build` | API + Next production builds passed after dependency fixes (`finalize-build-2026-10-24.txt`), followed by the completed auth-navigation frontend build (`finalize-web-build-final-auth-2026-10-24.txt`). 245 routes; existing `_plan` unused warning and ESM config warning remain. |
| `npm run typecheck`, repository API lint, frontend foundation lint | Passed; `finalize-typecheck`, `finalize-api-lint`, `finalize-web-lint` dated 2026-10-24. Final web checks also passed in `finalize-web-typecheck-final-auth` / `finalize-web-lint-final-auth` files. Scoped checks, not universal certification. |
| `node --test --test-concurrency=1 tests/*.test.mjs` | **311 passed, 0 failed, 0 skipped** after all fixes; `finalize-source-tests-final-auth-2026-10-24.txt`. Earlier 304/309/311-pass checkpoints remain retained. |
| Dependency consumer/security regressions | **6 passed**; `finalize-compiler-tests-2026-10-22.txt`; included in the source count, not additional unique tests. |
| `node scripts/run-retail-tests.mjs` | **73 money/database/API tests + 1 encrypted backup/restore passed** after the final dependency changes; `finalize-retail-tests-2026-10-24.txt`. Complete migrations applied only to its new disposable cluster. |
| Approved browser + four read-only database/API checkpoints | All requested retail stages above executed and reconciled. Separate from an unexecuted standalone Playwright runner. |
| Publisher, legacy package/rollback, startup-error and DPAPI tests | **15 passed, 0 failed, 0 skipped** against final compiled files; `finalize-launcher-final-all-2026-10-24.txt`. |
| Actual owned service lifecycle | **1 passed** against the final build; `finalize-lifecycle-final-all-2026-10-24.txt`: cold start, reuse, HTTP/auth boundary, graceful exit of both owned children, read-only DB/config preservation and restart. This tests services, not a native window. |
| Actual HTTP CORS/CSP/auth tests | **2 passed** against the final build; `finalize-http-final-all-2026-10-24.txt`. |
| Final embedded-host/MSI verification | **1 passed**, `finalize-msi-final-all-2026-10-24.txt`: C# compile, nine packaged files, actual cabinet hashes, two shortcut definitions, per-user metadata and upgrade/preservation boundaries. No installation/unsigned execution. |
| Full / production dependency audits | Both zero findings; 24 October files listed above. |
| npm 12 lockfile consistency | `npm ci --dry-run --ignore-scripts --no-audit --no-fund` passed after the additional dependency repairs; `finalize-lockfile-check-2026-10-24.txt`. Full clean reinstall not executed. |
| Final runtime integrity | **55,490 pinned file hashes and Node hash matched after final service startup**; `finalize-runtime-integrity-final-all-2026-10-24.json`. User database/config secrets are excluded. |
| Final configured-secret artifact scan | Passed, 2 configured literals checked across 2,766 compiled/native files without printing values; `finalize-secret-scan-final-all-2026-10-24.json`. Limited literal detection, not complete secret/malware certification. |
| Current filesystem permissions | Read-only ACL inspection found zero allow entries for Everyone, Authenticated Users or BUILTIN Users on the four inspected environment/database/control/payload paths; inheritance remains enabled. `finalize-acl-state-2026-10-24.json`. Not a full effective-access or cloud-sync assessment; permissions unchanged. |

The final executed suites above have zero failed or skipped assertions. Unexecuted native acceptance and the standalone Playwright runner are not counted as passes. The interrupted disposable fixture/recovery attempts are recorded separately above rather than hidden by those final suite counts.

The database suite also executed concurrency/overselling, duplicate sale/payment processing, transaction rollback, returns/cancellation, refunds/reversals, exact currency calculations, cross-tenant/organization denial, revoked permissions and authentication-session tests. Its encrypted restore used a second disposable database. Existing user records were compared read-only against a fresh baseline with **all 822 table hashes unchanged** during service lifecycle testing. `.env`, legacy executable/config and shortcut were preserved. Local services were restarted; PostgreSQL was never reset or stopped by the desktop lifecycle.

Final inspected **unsigned diagnostic** package, never installed or opened:

```text
C:\Users\Acer\OneDrive\Documents\PORTFOLIOV1\NEXORA_AI\.local\windows-releases\b9f0de9e36774322b0f84fb11f893cfa\NEXORA-1.9.0-x64.msi
MSI SHA-256: 865CF9C21DA7F94D3263994B846309A79FA394A1C26CB6737B555D2B26B26912
EXE SHA-256: 141DDB1B8A4830978F57582AEE1FB2945512A23FD75744C11E215FE62CE9F974
EXE signature: NotSigned; MSI signature: NotSigned; timestamps: absent.
```

The current artifact inventory and actual signature checks are `finalize-artifacts-final-all-2026-10-24.json` and `finalize-signatures-final-all-2026-10-24.json`. Earlier diagnostic packages remain historical. `finalize-shortcut-state-2026-10-24.json` confirms the existing shortcut still targets the preserved legacy EXE and its working directory exists; it was not changed. The running local web app is available independently at http://localhost:3001/login. No native launch is implied by that HTTP result.

Earlier failing attempts remain on disk: compiler fixture assertions were corrected for Tailwind 4's package exports and equivalent inlined theme declarations; the first browser fixture had the origin defect above; an over-broad browser alert locator matched Next's empty announcer and was narrowed to the dialog. A later final packaging run was interrupted before producing a result and is not counted as passed. No failing product expectation was changed to obtain green results.

On the 24 October continuation, the existing project-owned PostgreSQL cluster was stopped. It was started only after its ownership marker and configured paths matched; no database initialization/migration/reset occurred. A preservation comparison attempted before its named baseline was captured failed explicitly; the corrected `--capture` operation created a new baseline without overwriting older evidence. The subsequent 24 October lifecycle comparison passed across all 822 tables. Failed prerequisite attempts are retained, not counted as successful verification.

### Remaining release gates and exact external setup

The current certificate-store/SDK check still finds **zero code-signing certificate candidates and no Windows SDK SignTool** (`finalize-signing-setup-2026-10-24.json`). Registry inspection finds WebView2 Runtime 155.0.4283.62 and .NET Framework Release 534296 (`finalize-native-prerequisites-full-2026-10-24.json`); registration is not native execution proof. Legacy and new diagnostic NEXORA artifacts are unsigned. Signature-chain, private-key, timestamp, signed installation, first launch, native authentication, window single-instance behavior, native close/crash recovery, and actual signed upgrade/repair/uninstall/reinstall preservation remain **unverified**. Source inspection, compilation and service tests do not satisfy those native acceptance gates.

1. Obtain a legitimate trusted code-signing certificate using the actual publisher's legal identity and its provider's hardware/HSM/CSP provisioning. Expose the key through `Cert:\CurrentUser\My` or `Cert:\LocalMachine\My` to the publishing identity. Do not export/share private keys or send passwords in chat.
2. Install Microsoft's Windows SDK **Signing Tools for Desktop Apps**. Set the actual Microsoft-signed SignTool path, actual certificate thumbprint and provider's RFC3161 HTTPS timestamp endpoint in the publishing PowerShell session.

```powershell
Set-Location 'C:\Users\Acer\OneDrive\Documents\PORTFOLIOV1\NEXORA_AI'
$env:NEXORA_SIGNTOOL_PATH = '<actual SDK signtool.exe path>'
$env:NEXORA_SIGNING_CERT_THUMBPRINT = '<actual trusted certificate thumbprint>'
$env:NEXORA_SIGNING_TIMESTAMP_URL = '<provider RFC3161 HTTPS URL>'
npm run desktop:signing:check
npm run desktop:release
```

3. Require successful trusted signing of EXE, MSI and catalog; verify the actual output with `signtool verify /pa /all /v`, publisher/chain and trusted timestamp. Follow [the native signing/installation guide](WINDOWS-SIGNING.md). Only after verification, install the **signed** MSI as a normal user, verify both installed shortcuts and run the acceptance checklist below with Windows protections enabled.
4. On disposable acceptance infrastructure, execute native startup/login/setup/dashboard, second launch, close/reopen, backend interruption, browser-process recovery and signed upgrade/repair/uninstall/reinstall. Compare saved records/configuration/profile before and after; restore backups separately. Preserve the legacy launcher until the new host passes acceptance.

The MSI remains a **companion shell for this configured workspace**, not a clean-PC standalone application. Runtime paths are pinned; changing/moving Node, scripts, compiled application or dependencies requires a rebuilt signed package. The embedded profile is separate from legacy Edge. Remaining risks include native acceptance and signing, incomplete installer portability, browser compatibility beyond the tested engine, same-user/cloud-sync exposure of local data, remaining CSP inline-script permission, the unexecuted standalone Playwright runner/CI path, the interrupted final test fixture and unverified broader enterprise modules. A zero npm audit is not proof of complete security.

Changed in this continuation: root/API/web manifests and lockfile; web PostCSS/Tailwind/global CSS; `apps/web/features/shop/shop-workspace.tsx` and `shop-auth.tsx`; dependency compatibility/security tests and new `tests/dependency-request-security.test.mjs`; `tests/shop-identity.test.mjs`; `scripts/desktop/NexoraDesktop.cs`; `scripts/run-retail-tests.mjs`; `tests/e2e/retail-ui.spec.mjs` and new disposable runtime/session/checkpoint helpers; README, signing guide, this report and verification evidence. All pre-existing project changes remain. No production/user database migration/reset, unsigned execution, certificate fabrication, security bypass or destructive cleanup of existing user/workspace files was performed.

## Earlier 22 October checkpoint — superseded by the continuation above

**Decision: NO-GO for a production Windows release.** A genuine embedded WebView2 host and a per-user Windows Installer package are implemented and compile/package verification passes. Neither NEXORA binary nor MSI is signed, installed or opened. The existing desktop shortcut still points to the preserved legacy unsigned launcher. The local application services work independently at http://localhost:3001/login.

This report supersedes the earlier same-day 10-finding release checkpoint. It does not certify preserved enterprise modules or claim completion of the entire requested business operating system.

## What changed and why

- Added a WinForms/WebView2 host; the earlier C# launcher remains preserved. The new host embeds the UI in its own branded, resizable window rather than starting external Edge. It has a mutex for the window's lifetime, startup verification, health monitoring, an explicit recovery button and asynchronous close that requests the existing authenticated graceful service shutdown. It does not shut down PostgreSQL.
- Restricted top-level/frame navigation to the exact local origin. New windows stay inside that origin, external URI schemes are cancelled, web messaging and host objects are disabled, permissions are denied, certificate errors are cancelled, password autofill is disabled and developer tools are disabled. No Node integration, generic native command bridge, remote-debugging argument or certificate-error bypass was added.
- Embedded SHA-256 hashes for the Node executable and application runtime files, including nested npm dependencies. These are checked before startup/recovery. Next's generated cache/trace and user data are excluded. This detects changes relative to a signed host; it does not defend against a compromised Windows account or replace dependency auditing. Verification performance in the native UI is unmeasured.
- Added an MSI authored using Windows Installer's database API and Microsoft's makecab. It installs the shell under `%LOCALAPPDATA%\Programs\NEXORA`, creates desktop/start menu shortcuts, uses HKCU/per-user components and versioned files, and contains major-upgrade/downgrade rules. It has no executable custom actions or wildcard deletion table. Normal Windows Installer uninstall manages only its recorded shell files.
- Corrected MSI authoring bugs found by tests: COM return values leaking into metadata enumeration, a live authoring-process handle blocking subsequent hashing/signing, and default CAB disk splitting that left an incomplete payload. Verification now checks the embedded cabinet size and extracted file hashes.
- Added trusted signing of both EXE and MSI using the existing certificate-store/SDK SignTool workflow and a signed release catalog. Unsigned test builds remain isolated, explicitly labelled and never installed. Missing signing prerequisites are checked before stopping services/rebuilding.
- Restricted desktop API CORS to configured loopback frontend origins. Removed production CSP `unsafe-eval`; inline scripts remain permitted. Stripped inherited Node debugger/preload flags and refused disabled TLS certificate validation. OS protection settings were not changed.
- Added a scan for configured secret literals in compiled API, web and native artifacts; it checks UTF-8, UTF-16 and JSON escaping without printing values. This is a limited check, not universal proof that no secret exists anywhere in the repository.
- Added two guarded UI regression tests, isolated frontend output and a disposable-database-only runner. Discovery succeeds; **UI execution has not occurred**.

## Important installer limitation

**This MSI is a desktop-shell companion installer for the existing configured workspace. It is not a self-contained installer for a clean PC.** It packages WebView2 SDK redistributable DLLs, branding, notices and a path configuration, while the compiled API/web application, Node installation, PostgreSQL, `.env`, documents and backups stay in the existing workspace. Their integrity is pinned, not bundled. Moving the workspace or changing pinned runtime files requires a new verified package. WebView2 Evergreen and a supported .NET Framework must exist on the target Windows x64 installation.

The old Edge browser profile remains untouched. The new embedded profile lives in `%LOCALAPPDATA%\NEXORA\WebView2\<workspace-identity>` and initially requires login; cookie/profile migration is not claimed. MSI uninstall does not remove that profile or the existing workspace/database. Actual install, upgrade, uninstall and reinstall preservation acceptance remains pending. An autonomous clean-machine engine/data bootstrapper is a separate unfinished deliverable.

Final inspected **unsigned diagnostic** package (not installed or opened):

```text
C:\Users\Acer\OneDrive\Documents\PORTFOLIOV1\NEXORA_AI\.local\windows-releases\8c314d0717644d5cb7773ffc0fa20a9e\NEXORA-1.9.0-x64.msi
MSI SHA-256: 55CBB62DFB8B777919A03D6BD357BBA9A55A34D80F46224FDB261E9E3F885F98
EXE SHA-256: 83C564C8A90CD67CF6CF7E419CF9B507BDD12AEE6EA26F4DED81076BD17EE50D
```

Nine packaged files and both shortcut definitions were inspected. All **56,209** pinned runtime-file hashes still matched after the real local services started (`native-runtime-integrity-2026-10-22.json`). The final literal secret scan checked 2 configured values across 2,766 compiled/native files without printing values. These checks do not substitute for running the native application.

## All ten original dependency findings

The ten findings were package entries arising from three advisories, not ten independent exploits. Final full audit: **0 critical, 5 high, 0 moderate, 0 low**. Final production `--omit=dev` audit: **zero reported findings**. No findings were suppressed; the full audit still exits nonzero.

| Package at investigation | Severity | Path / root cause / application exposure | Remediation and current state |
| --- | --- | --- | --- |
| deepmerge-ts 7.1.5 | High | prisma → @prisma/config → merger; recursive object graphs can exhaust stack. Used by local Prisma config/CLI, not a JSON API merger. | Scoped override to 8.0.2. Prisma's actual config loader, plain records/arrays/functions and cyclic graph regression passed; disposable full migrations/API suite passed. Fixed. |
| @prisma/config 6.19.3 | High | Cascades from deepmerge-ts. | Same scoped repair; Prisma framework stays 6.19.3. Fixed. |
| prisma 6.19.3 | High | Cascades through @prisma/config; startup may invoke the CLI to generate its client. | Same repair; not moved to dev dependencies to conceal it. Fixed. |
| postcss-selector-parser 6.1.4 | Moderate | Tailwind and postcss-nested parse selectors; adversarial flat selectors can consume excessive CPU. No user CSS upload/compiler route was found in connected retail endpoints. | Scoped override to 7.1.7. Actual nested/group/peer/arbitrary variants passed. All three production CSS files remain byte-identical. Fixed. |
| postcss-nested 6.2.0 | Moderate | Cascades from selector-parser. | Same scoped repair. Fixed. |
| braces 3.0.3 | High | Stack exhaustion from deeply nested brace patterns; latest registry release remains 3.0.3. | Open: no patched release. Audit proposes Tailwind 4 migration; not applied blindly. |
| chokidar 3.6.0 | High | Tailwind's nested watcher → braces. | Open, inherited from braces. Desktop uses compiled Next start, not Tailwind watch. |
| micromatch 4.0.8 | High | Glob matcher → braces. | Open, inherited from braces; fixed checked-in build patterns are used. |
| fast-glob 3.3.3 | High | Tailwind → fast-glob → micromatch → braces. | Open despite audit's generic `fixAvailable` flag: the reachable braces chain has no published compatible patch. |
| tailwindcss 3.4.19 | High | Cascades from watcher/glob dependencies; existing frontend build dependency. | Open. A reviewed Tailwind 4 migration or compatible upstream patch is needed. Framework major retained. |

The two new scoped overrides cross dependency majors but leave application frameworks unchanged. They were retained only after inspecting actual consumers and executing compatibility checks. Deepmerge 8 changes Map/deepmergeInto behavior; Prisma's inspected loader uses deepmerge on configuration records, not Maps or deepmergeInto. Selector-parser 7 changes insertion during iteration; actual Tailwind output was compared byte-for-byte. Future framework/config changes must revalidate these overrides using npm 12.2.1.

Exploitability statements are bounded inferences from the inspected retail code/build paths. They are not proof that a vulnerable dependency can never be reached through a future feature, malicious source checkout or preserved legacy module. Never accept tenant-supplied glob/config/CSS for local compilation.

Advisories: [braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [deepmerge-ts](https://github.com/advisories/GHSA-ggr8-5vv4-36mx), [selector parser](https://github.com/advisories/GHSA-rj75-hqrm-r3gf). Compatibility notes: [deepmerge 8](https://github.com/RebeccaStevens/deepmerge-ts/releases/tag/v8.0.0), [selector-parser 7](https://github.com/postcss/postcss-selector-parser/releases/tag/v7.0.0).

## Verification actually executed

| Check | Actual result / evidence under docs/verification |
| --- | --- |
| API production build | Passed; `native-api-build-2026-10-22.txt` |
| Final Next production build | Passed, 245 static routes; `native-web-build-final-2026-10-22.txt`. Existing `_plan` unused-variable warning remains. |
| API/web TypeScript | Passed; `native-typecheck-2026-10-22.txt` |
| Repository API lint / frontend foundation lint | Passed; `native-api-lint-2026-10-22.txt`, `native-web-lint-2026-10-22.txt`. These are the repository's scoped lint checks, not universal lint/security certification. |
| Source tests | **304 passed, 0 failed, 0 skipped**, final `node --test --test-concurrency=1 tests/*.test.mjs`; `native-source-tests-final-2026-10-22.txt` |
| Real database/API/financial tests | **73 passed**, full migration chain applied only to a new disposable PostgreSQL cluster; `native-retail-tests-2026-10-22.txt` |
| Encrypted backup/restore | **1 passed**, exact records/financial result restored to a second disposable database; same retail evidence |
| Publisher, legacy package, rollback, bad startup and DPAPI checks | **15 passed**; `native-launcher-tests-final-2026-10-22.txt`. Unsigned native binaries were compiled/inspected, not executed. |
| New embedded host/MSI | **1 passed**; `native-msi-tests-final-2026-10-22.txt`. C# compilation, actual CAB hashes, embedded stream size, per-user metadata, shortcuts and upgrade rules verified. Not an installation test. |
| Actual owned service lifecycle | **1 passed**; `native-lifecycle-tests-final-2026-10-22.txt`. Cold/reused start, real HTTP health/auth boundary, graceful two-child exit, read-only DB check and restart. |
| Actual CORS/CSP/auth HTTP checks | **2 passed**; `native-http-security-tests-2026-10-22.txt` |
| Existing data preservation | Fresh read-only baseline; exact hashes across **822 tables unchanged** at the stopped-service comparison. `.env`, installed legacy EXE/config and shortcut preserved. Lifecycle leaves local services running. |
| CSS compatibility | Three production CSS files byte-identical; `native-css-compatibility-2026-10-22.json` |
| Configured-secret artifact scan | Passed with values withheld; `native-secret-scan-2026-10-22.json`. Limited literal detection, not a full secret/malware assessment. |
| Filesystem permissions | `.env`, runtime control metadata and PostgreSQL folder showed no explicit/inherited allow entries for the three inspected broad groups. Inheritance remains; not a full effective-access/cloud-sync assessment. `native-acl-check-2026-10-22.json` |
| npm 12 lockfile | `npm ci --dry-run --ignore-scripts --no-audit --no-fund` passed. A full clean reinstall was not performed. |
| Full / production audits | Full **5 high**; production **0**. `native-audit-final-2026-10-22.json`, `native-security-scan-2026-10-22.json` |
| UI automation | **2 tests discovered, 0 executed**; `native-ui-test-discovery-2026-10-22.txt`. Earlier automatic browser review denied localhost, including the approved retry. No alternative-browser/CDP bypass was used. |
| Native install, launch, close/recovery, signed upgrade/reinstall | **Not executed**: trusted publisher certificate and Windows SDK SignTool are unavailable. |

Earlier failed runs are retained. One source run failed SMTP connectivity in the sandbox and passed with the disposable loopback server allowed. A concurrent source run had a Windows child-process exit `3221226505` (`0xC0000409`) in the unchanged production-launch-gate test; its isolated retry and final sequential suite passed. The underlying native crash cause is unconfirmed. An overlapping launcher/lifecycle invocation changed PID metadata and failed preservation assertions; rerunning the launcher suite after lifecycle completion passed without expectation changes. The new MSI bugs listed above were genuine implementation/setup defects and were fixed. No failing tests were disabled.

## Business behavior verified versus unverified

Real API/database tests verify signup/session/context ownership, setup persistence, customer and product records, receipts/adjustments, sale completion, returns/cancellation, movement history, idempotent payments, refunds/reversals, transaction rollback, concurrent stock protection, membership/tenant isolation and financial reporting. A deterministic complete workflow records sales 90.00, returns 30.00, recognized revenue 60.00, COGS 20.00, gross profit 40.00, expenses 10.10, net profit 29.90, customer cash 50.00, outstanding 10.00 and stock value 80.00. These are disposable test fixtures, never dashboard seed data.

Money uses decimal arithmetic and configured currency precision, with half-up rounding; quantities support four decimals. Revenue is recognized on completed sales net of returns, rather than on payment receipt. Customer cash is payments minus recorded corrections, distinct from revenue/profit or a bank balance. Stock costs use the existing ledger's cost method; stock adjustments do not silently invent operating expenses. No FX conversion, complete tax accounting, depreciation or statutory accounting certification is supplied. See the existing retail financial assumptions and tests before adding more finance features.

UI → API → DB → reload acceptance has **not** been executed for these workflows. The prepared UI suite covers signup/setup, customer/product persistence, stock history, sale completion, rejected overpayment, partial payment, expense and financial results; it does not yet cover every requested operation. Printing, signature capture, accessibility, window sizing, install/upgrade/uninstall and crash recovery need native/manual acceptance.

Quotes, purchasing/payables, full bank cash flow, companies/deals, team/role administration, durable notifications/background automation and autonomous AI are not certified retail features. Preserved legacy code/navigation does not make them operational. Follow-ups are saved tasks, not live phone/WhatsApp contact. Live AI, messaging, calling and real mail still require provider setup. Invoice image signatures are business presentation, not cryptographic identity signatures.

## Exact build, installation and launch commands

Use this existing workspace with Node 24, npm 12.2.1, configured local PostgreSQL and the current `.env`; never reset/migrate the user database as part of building. Keep the project/Node paths stable.

```powershell
Set-Location 'C:\Users\Acer\OneDrive\Documents\PORTFOLIOV1\NEXORA_AI'
npm run desktop:sdk
# Complete the trusted certificate/SDK setup below first.
npm run desktop:release
```

The production command checks the publisher first, stops only owned services, builds API/web, compiles/signs the embedded host, authors/signs the MSI and signs a catalog. Output is printed as `NEXORA_DESKTOP_PACKAGE:<absolute path>` under `.local/windows-releases/<build-id>/`. `artifacts.json` records exact SHA-256 hashes. The published artifact inventory is also linked from `docs/verification/native-artifacts-2026-10-22.json`.

`npm run desktop:package:test` produces an **unsigned diagnostic build only**. Do not install/open it to bypass Smart App Control. The currently inspected output is such a diagnostic build, not a signed release.

After a real signed release exists, verify the EXE, MSI and catalog against the independently obtained publisher thumbprint and trusted timestamp using the shared signing helper and SDK `signtool verify /pa /all /v`. Require exit code zero; inspect the signer/chain/timestamp. Only then install:

```powershell
$msi = '<actual publisher-verified NEXORA-1.9.0-x64.msi path>'
msiexec.exe /i "$msi" /passive /norestart
# After successful installation, launch its own application window:
Start-Process -FilePath "$env:LOCALAPPDATA\Programs\NEXORA\NEXORA.exe"
```

The MSI uses normal Windows Installer repair/uninstall support. Close NEXORA before upgrade or uninstall and use Windows Installed Apps. Do not point any cleanup command at the workspace or its `.local/postgres`, documents, `.env`, backups or profiles. Native close adopts/stops the workspace's owned API/web services even if they were previously started from the CLI; the standalone website becomes unavailable until restarted.

## Manual trusted signing setup

1. Obtain a legitimate code-signing certificate after provider identity verification, using your actual legal identity. Provision its hardware/HSM/CSP key in `Cert:\CurrentUser\My` or `Cert:\LocalMachine\My` for the publishing user. Do not send/export/commit keys, PFX passwords, credentials or private certificate material.
2. Install Microsoft Windows SDK Signing Tools for Desktop Apps. Set the actual Microsoft-signed `signtool.exe` path. A certificate-provider login or hardware-token prompt may need your interaction.
3. Set `NEXORA_SIGNING_CERT_THUMBPRINT`, `NEXORA_SIGNING_TIMESTAMP_URL` (provider RFC3161 HTTPS endpoint) and `NEXORA_SIGNTOOL_PATH` in the publishing PowerShell session; run `npm run desktop:signing:check`. The code validates dates, code-signing EKU, trust/revocation, selected signer and timestamp. Nothing is fabricated/imported/trusted automatically.
4. Run the release command and the signature verification described above. Signing must succeed for both EXE and MSI before distribution. Cloud Artifact Signing requires a separate provider adapter; merely creating an Azure account does not satisfy this certificate-store workflow.
5. Run the acceptance checklist below with Defender, SmartScreen and Smart App Control enabled. Signing does not guarantee immediate SmartScreen reputation or certify malware absence.

No NEXORA publisher, certificate chain or timestamp can currently be reported: **both files are NotSigned**. Windows' existing block is consistent with its inability to verify that publisher, not evidence that a malware scan passed or failed. [Microsoft signing requirements](https://learn.microsoft.com/en-us/windows/apps/develop/smart-app-control/code-signing-for-smart-app-control), [SignTool](https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool), [WebView2 security](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/security).

## Acceptance checklist and next smallest step

- Verify trusted signatures; install signed MSI as the normal user. Confirm exact installed path, desktop/start menu shortcuts and their targets; the old shortcut should now open the new host.
- Double-click once: native window → login/signup → setup → dashboard; no browser tab or terminal is required. Double-click again: one window/backend set, no conflicting listeners.
- Add a customer/product, receive and adjust stock, complete a sale, enter partial payment, issue a return/refund, record an expense; verify balances, movement history, reports/CSV and reload persistence. Use a disposable test business/database for acceptance data.
- Test a second tenant and a limited role. Verify denied actions and no cross-organization records or cached metrics.
- Close the window: API/web stop gracefully, PostgreSQL/data stay intact. Reopen. On disposable infrastructure, interrupt a backend and test the recovery banner/retry without duplicate posting.
- Test invoice print/download and business signature. Confirm no arbitrary external navigation, native command access or unprompted file writes.
- Test signed upgrade, repair, uninstall and reinstall; compare saved records/config/profile hashes and restore a backup in a separate disposable database.
- Once browser execution is permitted, install the test browser through official Playwright tooling and run `npm run retail:ui:test`. It creates a disposable cluster and independent frontend; it never reuses the user database or application server. Do not use this command to bypass the earlier automation review.

The smallest next release gate is **trusted signing provisioning, then signed MSI/native first-launch acceptance**. Separately, retire the remaining braces dependency chain with a reviewed compatible patch/framework migration. A self-contained clean-PC engine installer, complete UI acceptance and the outstanding broader product features remain real work; a report or signed shell alone does not complete them.

## Files changed in this increment

| Files | Purpose |
| --- | --- |
| package.json, package-lock.json | Scoped dependency repairs, pinned Playwright tooling and explicit build/UI commands |
| scripts/desktop/NexoraDesktop.cs | New embedded host, isolation, startup/recovery/shutdown and pinned runtime integrity |
| scripts/desktop/prepare-webview2.ps1 | Official pinned SDK download/hash/Microsoft-loader verification |
| scripts/desktop/build-msi.ps1 | Per-user MSI, cabinet, shortcuts, version/upgrade/uninstall metadata |
| scripts/desktop/build-windows-release.ps1 | Isolated native build, secret check, trusted signing, MSI, catalog and hashes |
| scripts/desktop/runtime-manifest.mjs, check-release-secrets.mjs | Integrity and configured-secret checks without user-data bundling |
| scripts/desktop-config.mjs, desktop-launch.mjs, dev-start.mjs | Desktop debugger/preload removal and TLS validation guard |
| apps/api/src/main.ts, common/middleware/desktop-cors.ts | Desktop CORS origin restriction |
| apps/web/next.config.ts, .gitignore | Production CSP improvement and isolated E2E output |
| scripts/run-retail-tests.mjs, tests/e2e/* | Guarded real UI test infrastructure; execution pending |
| scripts/desktop-data-fingerprint.mjs | Fresh named preservation baselines without replacing the older checkpoint |
| tests/dependency-consumer-compatibility.test.mjs | Actual Prisma merger/config and Tailwind compatibility regressions |
| tests/desktop-cors.test.mjs, desktop-environment.test.mjs, desktop-runtime-manifest.test.mjs, desktop-release-secrets.test.mjs | Security and artifact regressions |
| tests/desktop-msi.integration.mjs, helpers/desktop-msi-inspect.ps1 | Actual compilation, MSI metadata, embedded cabinet and extracted hash validation |
| tests/desktop-http-security.integration.mjs, desktop-publisher.integration.mjs | Actual CORS/CSP/auth and certificate-first release guard |
| README.md, WINDOWS-SIGNING.md, this report, docs/verification/native-* | Current evidence, boundaries and manual steps |

Existing dirty changes, legacy launcher/install scripts, modules, user records and credentials were preserved. No production/user migration, database reset, test suppression, unsigned installation or Windows-protection change was performed.
