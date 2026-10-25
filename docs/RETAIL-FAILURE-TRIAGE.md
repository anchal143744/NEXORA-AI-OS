# Investigation of the 33 legacy failures

Reviewed against checkpoint `3609b6e` and the current source on 14 October 2026. The unchanged phase suite was executed again: **219 tests, 186 passed, 33 failed, zero skipped**. None of its expectations was edited or disabled.

These are source-inspection tests, despite some filenames saying “integration”. They do not execute PostgreSQL, sale completion, payment reconciliation or browser interactions. All 33 failures are assertions, not database connection errors. The earlier 32 absolute-path setup defects were repaired in the preceding checkpoint and are not among these 33.

## Classification

- **14 outdated version expectations:** different tests require mutually incompatible exact versions of the same package.
- **11 broken test boundaries:** navigation tests inspect the old configuration facade; registration moved to `module-registry.ts`, which the facade imports.
- **8 outdated source/behavior contracts:** endpoint configuration, identity fields, component composition or removed local AI fallback differ from the assertions. Two involve previous UI composition and still need browser behavior review before declaring equivalent functionality.
- **Database/environment failures among these 33: zero.** Database availability was a separate verification gap, addressed with isolated PostgreSQL tests.
- **Genuine product defects demonstrated by these 33: none established by these assertions alone.** The inventory/payment/accounting defects were found by source review and exercised with new behavioral tests.
- **Unrelated runtime regressions established: none.** The command-center and error/loading composition changes remain behavior-review candidates; source-name mismatches are insufficient to conclude a runtime regression.

## Every investigated failure

| # | Test (file and original line) | Root cause and evidence | Classification |
| --- | --- | --- | --- |
| 1 | Phase 3 workspace generation (`phase3-ai-onboarding.test.mjs:54`) | Requires `/generate-workspace`. Service calls `/v1/workspaces/generate`; the workspace controller exposes the matching `generate` route. The organization-context guard remains present and results require persisted IDs/timestamp. | Outdated endpoint expectation |
| 2 | Phase 5 backend AI / workspace fallback (`phase5-ai-copilot.test.mjs:55`) | Backend `/v1/ai/chat` and `/v1/ai/insights` remain. The expected `workspace-context` local response fallback was removed; backend failures now surface errors rather than invented success. | Outdated fallback expectation |
| 3 | Phase 50 registration/version (`phase50-production-readiness.integration.test.mjs:19`) | First assertion requires `1.0.0-RC1`; current package is `1.9.0-src.1`. Remaining assertions in this compound test are not counted as executed after its first failure. | Outdated exact version |
| 4 | Phase 52 version (`phase52-auth-onboarding.test.mjs:40`) | Requires `1.2.0`. | Outdated exact version |
| 5 | Phase 53 version (`phase53-workspace-intelligence.test.mjs:38`) | Requires `1.3.0`. | Outdated exact version |
| 6 | Phase 54 version (`phase54-command-center.test.mjs:43`) | Requires `1.4.0`. | Outdated exact version |
| 7 | Phase 54 command-center modules (`phase54-command-center.test.mjs:57`) | `enterprise-command-center.tsx` now composes `DynamicWorkspaceEngine`, whose dashboard is composed downstream. Test still requires nine former component names directly in the wrapper. This does not prove that all former UI capabilities are retained. | Outdated composition contract; unrelated UI review remains |
| 8 | Phase 55 sales copilot intents (`phase55-crm-workspace.test.mjs:26`) | Test reads the frontend calculation library; the live command handler is now `crm.service.ts:runSalesCommand`, containing hot lead, forecast, risk, pipeline health and next action branches. | Outdated frontend-only contract |
| 9 | Phase 6 resilience boundaries (`phase6-production-readiness.test.mjs:51`) | `error.tsx` uses a custom retry card, `loading.tsx` uses a labelled skeleton. `global-error.tsx` and `not-found.tsx` retain production screen components. Test requires all old component names, not error/retry/loading behavior. | Outdated component contract; browser review remains |
| 10 | Phase 60 route-aware navigation (`phase60-production-ui.test.mjs:40`) | Registration tokens `launch-readiness` / `Launch RC` live in `module-registry.ts`, not `workspace-config.ts`. The facade imports the registry and engine. | Broken test boundary |
| 11 | Phase 61 production navigation (`phase61-production-deployment.test.mjs:62`) | `Production Ops`, `ServerCog` and the route are registered in the module registry. | Broken test boundary |
| 12 | Phase 61 versions/worker scripts (`phase61-production-deployment.test.mjs:77`) | First assertion requires `2.1.0-RC1`; worker scripts remain in the API manifest. Compound test stops at version assertion. | Outdated exact version |
| 13 | Phase 62 beta navigation (`phase62-public-beta.test.mjs:73`) | `Public Beta`, `Megaphone` and route are in the registry. | Broken test boundary |
| 14 | Phase 62 versions (`phase62-public-beta.test.mjs:81`) | Requires `2.2.0-RC1`. | Outdated exact version |
| 15 | Phase 63 trust navigation (`phase63-enterprise-trust.test.mjs:78`) | `Trust Program`, `ShieldCheck` and route are in the registry. | Broken test boundary |
| 16 | Phase 63 versions (`phase63-enterprise-trust.test.mjs:86`) | Requires `2.3.0-RC1`. | Outdated exact version |
| 17 | Phase 64 marketplace navigation (`phase64-ecosystem-marketplace.test.mjs:92`) | `Marketplace`, `Store` and route are in the registry. | Broken test boundary |
| 18 | Phase 64 versions (`phase64-ecosystem-marketplace.test.mjs:100`) | Requires `2.4.0-RC1`. | Outdated exact version |
| 19 | Phase 65 launch navigation (`phase65-public-launch.test.mjs:90`) | `Public Launch`, `Globe2` and route are in the registry. | Broken test boundary |
| 20 | Phase 65 versions (`phase65-public-launch.test.mjs:98`) | Requires `2.5.0`. | Outdated exact version |
| 21 | Phase 66 growth navigation (`phase66-growth-program.test.mjs:90`) | `Growth Program`, `TrendingUp` and route are in the registry. | Broken test boundary |
| 22 | Phase 66 versions (`phase66-growth-program.test.mjs:98`) | Requires `2.6.0`. | Outdated exact version |
| 23 | Phase 67 autonomous navigation (`phase67-autonomous-enterprise.test.mjs:98`) | Registration is a `createModule(...)` call in the registry, not inline `key` / `route` properties in the facade. | Broken test boundary |
| 24 | Phase 67 versions (`phase67-autonomous-enterprise.test.mjs:106`) | Requires `2.7.0`. | Outdated exact version |
| 25 | Phase 68 twin navigation (`phase68-enterprise-digital-twin.test.mjs:105`) | Same registry/facade boundary; registrations remain but advanced modules are deferred for retail. | Broken test boundary |
| 26 | Phase 68 versions (`phase68-enterprise-digital-twin.test.mjs:113`) | Requires `2.8.0`. | Outdated exact version |
| 27 | Phase 69 autonomous operations navigation (`phase69-autonomous-operations.test.mjs:103`) | Same registry/facade boundary. | Broken test boundary |
| 28 | Phase 69 versions (`phase69-autonomous-operations.test.mjs:111`) | Requires `2.9.0`. | Outdated exact version |
| 29 | Phase 70 AGI navigation (`phase70-enterprise-agi.test.mjs:114`) | Same registry/facade boundary. No enterprise feature was added to satisfy it. | Broken test boundary |
| 30 | Phase 70 versions (`phase70-enterprise-agi.test.mjs:122`) | Requires `3.0.0`. | Outdated exact version |
| 31 | Phase 71 API client (`phase71-product-completion.test.mjs:9`) | Requires the literal `http://localhost:4000/api` in the client. The base is configured in `env.ts` and defaults to same-origin `/api`; Next rewrites proxy to the API. Auth headers and response unwrapping remain. | Outdated hardcoded configuration expectation |
| 32 | Phase 71 JWT identity (`phase71-product-completion.test.mjs:29`) | Requires assigning `payload.sub`; guard assigns `payload.userId`. Token verification requires both IDs and equality. Real signed-token/session/revocation HTTP tests exercise this guard. | Outdated source field expectation |
| 33 | Phase 71 generation wiring (`phase71-product-completion.test.mjs:46`) | Requires `/v1/adaptive-workspace/generate-workspace`; the current services use workspace generation endpoints under `/v1/workspaces`. | Outdated endpoint expectation |

## Product defects found outside this suite

Retail stock history previously did not update stock. Stock writes lacked workspace/related-record checks and proper permissions. Invoice “mark paid” did not persist or reconcile a payment. Financial summaries used floating point, mixed currencies and did not account for COGS. Authentication issued owner claims to every user, public signup could join an existing tenant, and RBAC assignment endpoints allowed authenticated self-escalation. These are product/security defects, addressed by the retail transaction services and scoped checks rather than by editing legacy assertions.

Future test repair should replace source-spelling checks with agreed behavior contracts and separately archive historical release assertions after review. That cleanup is deliberately not part of obtaining a green result here.

## Repair verified on 16 October 2026

All 33 contracts were repaired without skipping tests or changing package versions to impersonate old releases. Fourteen version checks now require valid synchronized root/API/web/lockfile versions; helper tests prove mismatches fail. Eleven navigation checks evaluate actual registered modules, permissions, feature flags and physical routes, plus facade wiring. Endpoint and source composition checks now inspect their current owners; workspace generation rejects missing persisted identifiers and the AI client test proves backend errors propagate instead of becoming fabricated success. The root route assertion now requires the requested ShopWorkspace and retains the original marketing component. The release marker scanner now parses actual comments, with positive TODO/FIXME comment tests and a negative database-status test.

The complete source/unit suite passes 245/245, zero skipped. This validates these contracts, not equivalence of every legacy enterprise screen or visual quality. Browser verification remains separately blocked.
