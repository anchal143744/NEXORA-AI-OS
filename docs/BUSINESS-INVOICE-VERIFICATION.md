# Business, invoices and lead capture — 16 October 2026

This is an incremental update to the existing retail desktop application. Existing changes and modules were preserved. No schema changes, production migrations, resets or production business writes were performed. The screenshot is a design/behavior reference, not permission to insert example records.

## Delivered behavior

- Business setup/settings now saves address, phone, email, website, what the business sells and buys, tax registration, invoice layout and terms. Business detail and signature changes require the persisted organization owner. These descriptions do not invent catalogue entries or stock.
- Sale search matches individual words across saved product names/SKUs. It shows loading, request errors and empty results, preserves selected customers/products across searches, and lets authorized users create and select a real product with their own price, cost and opening quantity. The screenshot alone cannot prove that the searched product existed; typed search text never becomes a fictitious product.
- Invoice view derives amounts/status from authorized sale/payment records. New completions snapshot seller, item descriptions and registered signature so subsequent edits do not alter issued document details. Standard, compact and service layouts are business choices. Print/Save PDF uses the browser print dialog. Older records without snapshots explicitly show reconstructed details.
- Owners can draw or upload a PNG signature. This is a signature image, not a cryptographic signing certificate.
- Authorized users can upload original PDF/PNG/JPEG invoices, download them privately and review them into a draft mapped to real customers/products. Uploading alone changes no stock, revenue or payment. No automatic OCR, imported template execution or automatic accounting is claimed. Limits: 5 MB/file, 25 MB/workspace for invoice sources, 200 KB/signature. Blobs remain in private PostgreSQL FileAsset metadata and are included in backups.
- Reviewed CSV imports support contacts, WhatsApp exports and website enquiries. Matching email/phone records are reused; repeat batches are idempotent. Supported mobile browsers can offer the user-initiated Contact Picker. No phone call history or background contact harvesting is implemented. [Chrome's Contact Picker documentation](https://developer.chrome.com/docs/capabilities/web-apis/contact-picker) describes the device/browser requirements.
- Website backends can submit leads with an owner-created capture-only key. Only its hash is stored; keys expire after 30 days and can be rotated. The handler derives tenant, organization, workspace and actor from the stored connection, rechecks membership and returns no customer records. Local HTTP behavior is tested; a public HTTPS website integration is not deployed. Never embed the key in public browser JavaScript.
- Follow-ups persist an editable message draft. The optional OpenAI Responses adapter uses the configured model, minimal business/customer-first-name context, no tools, no send/call actions and human review. Provider failure or missing configuration fails closed. [Official Responses documentation](https://developers.openai.com/api/docs/guides/migrate-to-responses) informed the adapter; the openai-docs skill was used.
- Dashboard/business queries refresh every 15 seconds while active. This is polling, not a tested live WhatsApp/socket connection.

## Verification and failures

- `node --test tests/*.test.mjs`: **282 passed, 0 failed, 0 skipped**. Includes CSV round trips, embedded setup rendering, file validation and a mocked AI adapter. The mock is not live-provider evidence.
- `npm run retail:test`: **73 money/PostgreSQL/HTTP tests passed** in a newly initialized disposable PostgreSQL cluster, with the complete checked-in migration chain. Includes concurrent overselling, stock/payment rollback, authorization, signup/login/context isolation and exact financial calculations. New scenarios cover word search, owner-only profile edits, immutable invoice/signature snapshots, private document ownership, upload rollback, duplicate reviewed imports, real HTTP website intake/key rotation and saved follow-up drafts.
- The first backup run failed because adding FileAsset comparison exposed Prisma BigInt file sizes that JSON.stringify cannot serialize. This was broken test normalization, not an observed restore defect. The comparison now encodes BigInt as exact decimal strings without omitting fields or rounding. First-run evidence is preserved separately.
- API and production frontend builds and final type checks passed. The corrected encrypted backup/restore test passed (**1 passed, 0 failed**) and compared all 16 selected business models, including documents and private files, plus known reconciled profit values in the restored disposable database. Final required checks have no remaining test failures.
- Rebuilt native launcher `--verify` returned 0 without opening a browser. Actual local health/login/signup returned 200; unauthenticated documents/invoice/intake requests returned 401; disabled legacy API docs returned 404. Compiled local services were restarted using the owned-process checks; PostgreSQL and saved records were preserved.

## Remaining blockers and risks

- User confirmed no WhatsApp Business/Meta or calling-provider accounts. Live WhatsApp ingestion, outbound conversations and AI phone calls remain disconnected. Reviewed exports work; no real customer communications were sent.
- Local AI configuration check: drafts flag false, API key absent, model absent. No secrets were printed. Live AI cannot run until these are privately configured; only the adapter mock and disabled-provider behavior were tested.
- Browser screenshot, click-through, canvas signature drawing, print/PDF output and real mobile Contact Picker checks remain unverified. Automatic browser approval review rejected localhost browser access, including after user approval; no alternate browser/control path was used to bypass it.
- File checks validate type headers, encoding, size/dimensions and common active PDF markers. They are not a complete PDF parser or antivirus scanner. Dedicated malware scanning remains a deployment requirement for untrusted public file uploads.
- Earlier full dependency audit still has 14 findings (10 high, 4 moderate). No dependency changes or fresh audit occurred in this increment. Unavailable enterprise modules remain outside the verified retail desktop boundary.
- This is verified local retail functionality, not a claim of 100% production readiness or completion of every historical enterprise module.

Next smallest step: manually accept sale creation, signature registration and invoice printing in the desktop app, then privately configure one external provider and test its signed webhook with synthetic leads before live customer use.

## Changed files in this increment

API: business-context.ts, shop.dto.ts, shop.service.ts, shop.controller.ts, shop-documents.dto.ts, shop-documents.service.ts, shop-leads.dto.ts, shop-leads.service.ts, lead-intake.controller.ts, shop-assistant.service.ts, retail-sales.service.ts, retail.dto.ts, retail.module.ts, main.ts and desktop-retail-boundary.ts. All retail service files are under `apps/api/src/modules/retail/` unless stated otherwise.

Web: `apps/web/features/shop/` shop-business-setup.tsx, shop-forms.tsx, shop-types.ts, shop-action-permissions.ts, shop-workspace.tsx, shop.css, new shop-invoices.tsx, shop-invoices.css, shop-lead-capture.tsx and contact-csv.ts. Configuration: .env.example. Tests: retail.integration.mjs, desktop-backup.integration.mjs, shop-business-invoices.test.mjs and helpers/api-source.mjs. README and this report updated. Earlier Git changes remain intact.

Evidence: `docs/verification/invoice-{api-build,web-build,typecheck,source-tests,retail-tests,retail-first-run,desktop-lifecycle}-2026-10-16.txt`.
