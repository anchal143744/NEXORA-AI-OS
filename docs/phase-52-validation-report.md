# Phase 52 Validation Report

Version: 1.2.0

## Results

- npm install: PASSED - Workspace dependencies and package-lock refreshed for version 1.2.0.
- Web TypeScript compile: PASSED - npm run web:typecheck completed successfully.
- Phase 52 tests: PASSED - node --test tests/phase52-auth-onboarding.test.mjs passed 4 tests.
- Next build: PASSED - npm run web:build generated 9 static pages including /auth/login, /auth/signup, /onboarding and /invite.
- npm audit: COMPLETED_WITH_TRACKED_EXCEPTIONS - 0 critical, 0 high, 2 moderate Next/PostCSS advisories remain; npm offers only a major Next downgrade.
- HTTP route smoke: PASSED - /, /welcome, /auth/login, /auth/signup, /onboarding and /invite returned HTTP 200 with Phase 52 content markers.
- Browser visual smoke: BLOCKED_BY_ENVIRONMENT - In-app browser bridge failed with the Windows sandbox setup refresh issue; build and HTTP checks passed.

## Route Coverage

- /
- /welcome
- /auth/login
- /auth/signup
- /onboarding
- /invite

## Audit Note

The dependency audit has no critical or high findings. Two moderate Next/PostCSS advisories remain tracked as release exceptions because npm currently proposes a major downgrade to Next 9.3.3 instead of a safe upgrade path for the installed Next 15 line.
