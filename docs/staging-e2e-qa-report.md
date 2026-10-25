# Staging End-to-End QA Report

## Critical Journey

- Signup creates the tenant, organization, business, workspace, owner user, credential, workspace membership and session.
- Login returns an access token, refresh token, tenant ID, organization ID and workspace ID.
- Password reset request and email verification request use existing backend email provider abstraction.
- Organization Creation is verified through signup bootstrap.
- Workspace Generation is verified through /api/v1/adaptive-workspace/generate-workspace.
- Dashboard blueprint retrieval validates dashboard generation from workspace intelligence.
- AI Copilot route availability validates that the assistant surface is reachable after workspace creation.

## Actual SRC Result

- Production web routes: PASSED on http://127.0.0.1:3014.
- API journey: BLOCKED because Redis is offline and API cannot boot.
- npm.cmd run staging:e2e produced failed API checks and passed frontend route checks.

## Release Blockers

Any failed Signup, Login, Organization Creation, Workspace Generation, Dashboard or AI Copilot API step is Critical until Redis-backed API runtime validation passes.
