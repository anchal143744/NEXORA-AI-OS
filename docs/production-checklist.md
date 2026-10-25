# Production Checklist

## Build

- [x] npm install
- [x] Prisma validate
- [x] Prisma generate
- [x] API TypeScript compile
- [x] Web TypeScript compile
- [x] Nest build
- [x] Next build
- [x] Critical frontend route smoke

## Database

- [ ] PostgreSQL migration status passes
- [ ] Fresh database migration apply passes
- [ ] Seed/bootstrap flow verified
- [ ] Tenant isolation queries tested
- [ ] Performance indexes reviewed with production-like data

## User Workflow

- [x] Welcome route renders
- [x] Signup route renders
- [x] Login route renders
- [x] Onboarding route renders actual onboarding flow
- [x] Workspace and core module routes render
- [ ] Live signup creates tenant/org/business/workspace in PostgreSQL
- [ ] Email verification UI flow complete
- [ ] Team invitation API and UI complete
- [ ] Live CRM/HR/Finance workflows verified with authenticated session

## Security

- [ ] npm audit advisories remediated or risk-accepted
- [ ] OAuth callbacks verified
- [ ] RBAC integration tests pass
- [ ] CSRF/XSS/CSP validated
- [ ] Secrets loaded from managed secret store

## AI

- [ ] Copilot natural-language commands dispatch real audited platform actions
- [ ] Approval policies enforced before medium/high risk actions
- [ ] Provider keys and model fallback configured
- [ ] Prompt and action logs reviewed for privacy

## Performance

- [ ] Lighthouse score above 90
- [ ] Bundle budget reviewed
- [ ] Dashboard query latency tested
- [ ] Caching validated

## Release Decision

Current status: release candidate documentation complete, enterprise GA blocked.
