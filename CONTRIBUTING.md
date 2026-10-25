# Contributing

## Release Freeze Policy

NEXORA AI OS is in Version 1.0 release freeze. Contributions must be limited to stability, security, validation, documentation and release-gate closure. New business modules and experimental features are not accepted during this freeze.

## Required Checks

```powershell
npm.cmd run api:typecheck
npm.cmd run api:build
npm.cmd run api:test
npm.cmd run api:e2e
```

## Recommended Checks

```powershell
npm.cmd run lint
npm.cmd run security:scan
npm.cmd run web:typecheck
npm.cmd run web:build
```

## Code Standards

- Preserve module boundaries.
- Do not duplicate providers.
- Do not import AuthModule into feature modules to satisfy guards.
- Use structured logging instead of console logging in app source.
- Keep tenant and workspace context intact.
- Update documentation when behavior changes.
