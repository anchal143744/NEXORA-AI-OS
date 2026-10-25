# Changelog

## 1.9.0-src.1+phase10 - Production Launch Gate

- Added the Phase 10 production launch gate for the v2.0.0 target release.
- Added production launch, deployment, infrastructure, smoke, performance, security, monitoring, release notes and portfolio asset reports.
- Added `production:launch-gate` validation script and Phase 10 test coverage.
- Kept package metadata at `1.9.0-src.1` because release-blocking infrastructure validation is not complete.
- Recorded v2.0.0 as No-Go until Redis/API E2E, production deployment, hosted smoke checks, Lighthouse and provider validation pass.

# Changelog

## 1.9.0-src.1 - Staging Release Candidate

- Promoted NEXORA AI OS to a staging release candidate for production-like launch validation.
- Added staging Docker Compose coverage for API, web, worker, AI worker, PostgreSQL, Redis, MinIO and NGINX.
- Added representative multi-industry staging seed fixtures and a guarded seed runner.
- Added live backend E2E journey automation for signup, login, password reset request, email verification request, workspace generation, dashboard blueprint retrieval and frontend route checks.
- Added SRC load testing, staging audit, phase test coverage and release readiness documentation.

# Changelog

## 1.8.0-gm.1 - Frontend Gold Master

- Promoted the frontend release to Gold Master status for staging launch validation.
- Added Gold Master audit coverage for release metadata, core workflow routes, source cleanup, accessibility hooks, security headers and performance controls.
- Added Gold Master regression test coverage and `web:gm` validation script.
- Added Gold Master report, demo guide, QA matrix and release notes.
- Updated README release status, validation commands and documentation index.

## 1.7.0-lc.1 - Frontend Launch Candidate 1

- Connected metadata-driven workspace routes for Inventory, Projects, Documents, Workflows and Integrations through a reusable integrated module workspace.
- Replaced empty global search with a workspace-aware enterprise search index consumed by both Global Search and the Command Palette.
- Replaced static shell notifications with unified workspace notifications derived from widgets, KPI signals, reports, AI context and settings guidance.
- Added a unified settings workspace for organization, workspace, access, notification, AI and capability review.
- Added breadcrumbs to the enterprise shell and introduced LC1 integration audit/test coverage.

## 1.6.1-rc.1 - Frontend Release Candidate 1

- Replaced primary technical workspace copy with business-facing release copy.
- Added shell profile sign-out wired to backend logout and local session clearing.
- Added RC1 workflow audit covering auth, onboarding, workspace generation, dashboard, navigation and AI copilot wiring.
- Added RC1 release and workflow verification documentation.


## 1.0.0-rc.1 - Version 1.0 Release Freeze

### Changed

- Entered Version 1.0 release freeze.
- Stopped feature/module expansion for this release candidate.
- Normalized release metadata across root, API and web package manifests.
- Cleaned generated runtime log artifacts from the repository root.
- Normalized AppModule formatting without changing business logic.
- Added root-level GitHub release documentation.
- Added release-candidate documentation, portfolio summaries, technical debt and v1.1+ roadmap artifacts.

### Verified Scope

- Existing multi-tenant backend architecture remains intact.
- AuthCoreModule remains the single auth infrastructure provider boundary.
- CommonModule remains the single RequestContextStore provider boundary.
- Prisma model count remains 818.
- Controller endpoint decorator count remains 2013.
