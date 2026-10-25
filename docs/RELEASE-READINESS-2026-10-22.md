# NEXORA desktop release readiness — 22 October 2026

> Superseded by [the later native desktop/MSI verification](NATIVE-DESKTOP-RELEASE-2026-10-22.md). This report retains the earlier ten-finding checkpoint; current full audit has five high findings and the new embedded host/MSI remains unsigned and uninstalled.

**Release decision: NO-GO for a trusted Windows/production release.** Compatible repairs and local verification are complete for this increment. The existing native executable and installer scripts are **not digitally signed**. No trusted publisher certificate or Windows SDK SignTool is available. Ten dependency findings and native/browser acceptance gates remain open. The compiled local web application is running at `http://localhost:3001/login`.

## Security triage of all 14 original findings

Audit counts include vulnerable transitive consumers; they do not represent 14 independent vulnerabilities. Reachability below is an assessment of the inspected retail desktop routes, dependency paths and compiled startup mode, not proof that a package is universally unexploitable. No exploit payload was run against user data.

| Original package | Original severity | Exposure in this application | Compatible repair / result |
|---|---|---|---|
| `@nestjs/swagger` 11.4.7 | Moderate | Inherits YAML issue. Swagger generation uses application metadata; its desktop HTTP endpoints are blocked. No untrusted YAML intake was found. | **Fixed indirectly**, YAML 5.3.0 → 5.4.1. Swagger remains 11.4.7. |
| `@prisma/config` 6.19.3 | High | Inherits recursive-object merge issue in trusted CLI/config loading. Plain JSON cannot express the required cyclic graph. No retail request path to this merge API was found. | **Open**. Fix requires deepmerge-ts 8; changed merge semantics make a forced override inappropriate. |
| `braces` 3.0.3 | High | Deep pattern nesting can exhaust the stack. Used by development/build globs, not retail product searches or compiled desktop request handlers. | **Open**. Registry latest is still 3.0.3; no patched published version. Restrict build inputs to trusted project files. |
| `chokidar` 3.6.0 (Tailwind copy) | High | Inherits braces through development file watching. Desktop uses compiled services, not Tailwind watch. | **Open**. No compatible remediation of the underlying braces dependency; major watcher changes can break glob support. |
| `deepmerge-ts` 7.1.5 | High | Cyclic object graphs can cause stack exhaustion. Present through Prisma configuration; no direct application import/request-side use was found. | **Open**. Patched 8.x changes Map merging, mutation and type APIs. No forced major override. |
| `fast-glob` 3.3.3 | High | Inherits micromatch/braces; trusted project file enumeration during build. | **Open**, same unpatched braces family. |
| `js-yaml` 4.3.0 / 5.3.0 | High | Crafted merge sources can consume excessive CPU. CLI/config and Swagger dependency; no uploaded-YAML business workflow. | **Fixed** to 4.3.2 and 5.4.1, preserving each consumer's major version. |
| `micromatch` 4.0.8 | High | Inherits braces; trusted build globs. Retail searches use database filters, not glob parsing. | **Open**, same unpatched braces family. |
| `next` 15.5.28 | Moderate | Inherits pinned PostCSS issues. No untrusted CSS compilation endpoint was found in retail scope. | **Fixed indirectly**, vulnerable nested PostCSS removed/deduplicated onto 8.5.31. Next remains 15.5.28. |
| `postcss` 8.4.31 (Next copy) | High | Crafted CSS/source maps can disclose local map files; some versions also have unsafe stringification. Primarily build input exposure here. | **Fixed** to 8.5.31; installed consumer resolution and CSS transformation tested. |
| `postcss-nested` 6.2.0 | Moderate | Inherits selector-parser CPU exhaustion, used by trusted build CSS. | **Open**. Requires changing the parser major expected by Tailwind 3. |
| `postcss-selector-parser` 6.1.4 | Moderate | Crafted flat selectors can consume excessive CPU. Not an inspected retail request input. | **Open**. Patched 7.1.6+; 7.x changes insertion/iteration semantics. No forced incompatible replacement. |
| `prisma` 6.19.3 | High | Inherits config/deepmerge issue. CLI is also used for client generation, so moving it to devDependencies merely to hide the audit was not done. | **Open**, same config/merge family. A Prisma 7 migration was not attempted. |
| `tailwindcss` 3.4.19 | High | Inherits build-time watcher/glob/selector findings above. No runtime watcher in desktop mode. | **Open**. Tailwind 4 changes configuration/plugin behavior and would require a separate tested migration. |

**Final full audit: 10 findings — 8 high, 2 moderate, 0 low, 0 critical.** Four original package findings were removed. **Production-dependency audit: 3 high**, all in the Prisma/config/deepmerge chain. Both audits remain blocking; findings were not suppressed. The repaired security command exits 1 for high/critical findings and for missing/invalid audit results.

Root versions Next 15, Prisma 6, Tailwind 3 and Swagger 11 were retained. Only YAML/PostCSS versions changed. npm 11 initially left nested pins unchanged; temporary npm 12.2.1 and a version-specific PostCSS override resolved the actual tree. `packageManager` now records npm 12.2.1. Its clean-install **dry run** passed; this is not a claim that a full clean reinstall was executed.

Primary sources: [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [deepmerge advisory](https://github.com/advisories/GHSA-ggr8-5vv4-36mx), [deepmerge 8 breaking changes](https://github.com/RebeccaStevens/deepmerge-ts/releases/tag/v8.0.0), [selector-parser advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf), [parser 7 behavior change](https://github.com/postcss/postcss-selector-parser/releases/tag/v7.0.0), and [YAML fix](https://github.com/advisories/GHSA-r3ph-w7gj-g6xm). Exact installed paths and registry versions are in the verification artifacts.

## Fixed implementation defects

- Security reporting: direct `spawnSync('npm.cmd')` was invalid on Windows, and missing audit JSON could be interpreted as zero vulnerabilities. The scanner now invokes a real npm CLI, distinguishes registry/execution failures, retains actual severity counts and fails closed.
- Packaging: `-NoInstall` previously still replaced installed files. Signed staging now returns before installation. Development compilation writes only to isolated staging and cannot install its unsigned output. Release preparation checks signing first, then gracefully stops the owned services before rebuilding their artifacts.
- Release integrity: the prepared workflow signs the EXE, installer and helpers, then creates/signs a SHA-256 catalog covering the payload. Installation verifies the expected publisher, signatures, catalog, configuration and Node/Edge publishers before promoting a fixed launcher-file list. End-user installation needs no signing private key. Partial copy or later installer failures restore previous launcher/shortcut files. Profiles, .env and PostgreSQL are outside that list.
- Signing: the earlier PowerShell timestamp approach incorrectly required HTTPS for a cmdlet documented with HTTP timestamp support. The new workflow uses trusted Microsoft SDK SignTool with `/fd SHA256 /tr <provider endpoint> /td SHA256`, verifies timestamps and pins the selected publisher. No key export, fabricated identity, trust-root installation or Windows protection bypass is used. [Microsoft SignTool documentation](https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool).
- Launcher paths/permissions: explicit `asInvoker` manifest, expected installation directory, absolute Node/Edge paths and executable names. Native launcher and installer share a mutex; the native launcher reads installed configuration only after acquiring it. Both release the mutex on errors and handle abandoned locks. Native runtime behavior awaits signed acceptance; successful C# compilation is not that acceptance.
- Shutdown: replaced unconditional `taskkill /F` with an authenticated local named pipe and parent-owned IPC. Nest closes the application; Next runs its existing asynchronous cleanup handlers. A 20-second watchdog is retained for hung owned children and records a forced outcome as a failed graceful-stop check. The tested runs needed no fallback.
- Startup: reject remote/credential-bearing/malformed API URLs and conflicting ports before touching the running instance; await successful process spawn before saving a PID; stop the supervisor if a child exits unexpectedly. Desktop logs no longer advertise blocked Swagger routes.
- Backup: removed execution-policy overrides from backup invocation and restore tests. Encryption/decryption and full disposable restore pass under the current Windows policy.
- Lint: legitimate `TODO` task statuses were falsely flagged as placeholders. Detection now checks comments and actual debugger statements; business statuses were preserved and regression tests added.

## Executed verification

| Check | Actual final result |
|---|---|
| All source/unit/SSR regression tests | **295 passed, 0 failed, 0 skipped** |
| Money/PostgreSQL/HTTP workflows | **73 passed**, isolated newly created cluster, complete checked-in migrations only there |
| Encrypted database restore | **1 passed**, new disposable database; 16 selected model sets and reconciled financial results compared |
| Publisher/package/startup-error tests | **13 passed**, including C# compile-only, unsigned rejection, rollback, reinstall fixtures, catalog tampering, installer syntax and real invalid-startup cases |
| Actual local service lifecycle | **1 passed**, cold/repeated launch, health/auth checks, graceful stop and restart |
| DPAPI without policy override | **1 passed**, synthetic bytes only |
| API + production frontend build | **Passed**; existing unused `_plan` warning remains non-blocking |
| API + frontend type checks | **Passed** |
| API lint + frontend foundation lint | **Passed** |
| npm 12 clean-install lock consistency | **Dry run passed**, no clean reinstall performed |
| Full audit / production security scan | **Nonzero as expected**: 8 high + 2 moderate / 3 high respectively |
| Native executable and installer signatures | **NotSigned**, zero signing certificates, SDK SignTool unavailable |
| Actual signed install / native first launch | **Not executed: external signing prerequisites missing** |

The real local API/login/signup returned 200; unauthenticated protected settings returned 401. Both listeners are `127.0.0.1` (4001/3001). Both child processes exited 0 on graceful shutdown. The shortcut exists and has the correct target, working directory, empty arguments and existing icon; it still targets the unsigned EXE.

Existing .env, launcher/configuration and shortcut bytes were preserved. Read-only SHA-256 comparisons across **all 822 existing database tables** matched after the tested lifecycle. The first fingerprint attempt exceeded relation-lock capacity; bounded read-only batches fixed the verifier without altering PostgreSQL settings. File upgrade/reinstall/rollback tests use synthetic payloads and demonstrate the transaction mechanism, **not a completed signed reinstall**. Real unsigned installation is refused before modifying the existing installation. No persistent database was reset, migrated, deleted or restored.

Smart App Control is **On** and Defender real-time protection is **enabled**. Signature database timestamp was 22 October, 05:03 IST when checked. No malware-clean guarantee is inferred from those status checks. No real customer communications or signing operations occurred.

## Remaining gates and manual work

1. Obtain a trusted provider's real code-signing identity and configure its certificate/key through Windows/CSP; install Microsoft Windows SDK Signing Tools. Neither exists on this machine. Follow [the exact signing and installation steps](WINDOWS-SIGNING.md).
2. Execute and verify the **signed** package installation, first native launch with Smart App Control still on, upgrade/reinstall and rollback acceptance. Actual signature creation, timestamping and signed promotion remain unverified.
3. Resolve the remaining dependency families with compatible upstream patches or separately tested migrations; no forced upgrade was used to manufacture a clean audit.
4. Complete manual/browser acceptance for splash/Edge app window, user interactions and printing. Prior automatic browser approval review blocked localhost browser testing; no alternative browser path was used to bypass it.

This remains a per-user launcher for the existing project installation, not a self-contained MSI/MSIX or portable database distribution. The project, installed dependencies, Node, Edge and owned PostgreSQL cluster must remain available. The signed catalog covers the launcher payload, not every mutable JavaScript dependency in the checkout. A hardened distributable additionally needs controlled application-file permissions/immutable packaging and off-device recovery. PDF upload validation is not antivirus scanning. These limits, live-provider configuration gaps and public deployment remain outside a production-ready claim.

## Changed files and evidence

Dependencies/configuration: `package.json`, `package-lock.json`. API: `apps/api/src/main.ts`. Runtime/security/lint: `scripts/dev-start.mjs`, `desktop-launch.mjs`, `desktop-backup.mjs`, new `desktop-stop.mjs`, `desktop-control.mjs`, `desktop-child-control.cjs`, `desktop-config.mjs`, `desktop-data-fingerprint.mjs`, `security-audit-result.mjs`, `source-markers.mjs`, plus `security-scan.mjs` and `frontend-foundation-lint.mjs`.

Packaging: `scripts/desktop/` launcher C#, explicit app manifest, build/install script, publisher signing/readiness helpers, new verified installer and file transaction helpers, stop wrapper. Tests: new dependency/audit/source-marker/control/config unit tests; release/lifecycle/startup-error/DPAPI integrations and PowerShell fixtures; existing backup integration invocation updated. README and release/signing reports updated. Earlier unrelated Git changes remain intact.

Evidence is under `docs/verification/release-*-2026-10-22.*`: build, typecheck, API/web lint, source tests, retail tests, launcher tests, lifecycle, DPAPI, audits, registry/dependency paths, lockfile check, Windows signatures/shortcut/protection state, and preservation baseline logs. The aggregate database digest stays in ignored `.local/`; no row values or credentials were logged. Previous failure/checkpoint artifacts are retained.
