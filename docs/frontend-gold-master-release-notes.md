# Gold Master Release Notes

## Version

`1.8.0-gm.1`

## Release Type

Gold Master frontend release candidate for staging launch validation.

## Highlights

- Preserves LC1 integrated navigation, module routes, universal search, unified notifications and unified settings.
- Adds Gold Master validation gate through `npm.cmd run web:gm`.
- Adds Gold Master QA matrix, demo guide and release notes.
- Promotes release metadata and changelog to Gold Master status.
- Keeps feature development frozen; no new business modules are introduced.

## Validation

Required validation:

```powershell
npm.cmd run web:lint
npm.cmd run web:typecheck
node --test tests\phase51-frontend-foundation.test.mjs tests\phase2-landing-auth.test.mjs tests\phase3-ai-onboarding.test.mjs tests\phase4-dynamic-workspace-engine.test.mjs tests\phase5-ai-copilot.test.mjs tests\phase6-production-readiness.test.mjs tests\phase6-rc1-release-candidate.test.mjs tests\phase7-launch-candidate.test.mjs tests\phase8-gold-master.test.mjs
npm.cmd run web:build
npm.cmd run web:smoke
npm.cmd run web:rc1
npm.cmd run web:lc1
npm.cmd run web:gm
npm.cmd run security:scan
```

## Launch Guidance

Gold Master may move to staging after validation passes. Public release still requires staging Lighthouse evidence, real backend auth/session verification and deployment dry run.
