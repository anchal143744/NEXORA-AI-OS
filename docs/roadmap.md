# NEXORA AI OS Roadmap

## Current Version

1.9.0-src.1

## Release Policy

Version 1.9.0-src.1 remains in production launch freeze. Phase 10 adds the v2.0.0 production launch gate and release evidence only; no new business modules, experimental product areas or unrelated screens are added.

## Completed Scope

- Backend foundations: multi-tenancy, auth, RBAC, Prisma/PostgreSQL, Redis, BullMQ, OpenAPI, security and observability.
- Business workspaces: CRM, HR/People, Finance, Projects, Operations, Analytics and AI Agents.
- Intelligence layer: AI Copilot, AI agents, workflows, knowledge graph, global search, command center and decision intelligence.
- Frontend foundation: Next.js enterprise shell, design system, onboarding and core workspace surfaces.
- Production readiness: Docker, Kubernetes, NGINX, GitHub Actions, monitoring, scaling, security and disaster recovery documentation.
- Staging release candidate: staging compose, env template, seed fixture, E2E journey runner, load test runner and SRC reports.
- Production launch gate: deployment, infrastructure, smoke, performance, security, monitoring, portfolio and Go/No-Go reports.

## Release Gates Before Public Launch

1. Run and pass api:typecheck, api:build, api:test and api:e2e.
2. Verify live PostgreSQL migrations in staging.
3. Verify Redis-backed queues, realtime events and workflow recovery under load.
4. Execute complete live user journey E2E with `npm.cmd run staging:e2e`.
5. Apply representative staging data with `npm.cmd run staging:seed -- --apply` in an isolated staging environment.
6. Complete dependency advisory remediation or risk acceptance.
7. Run Lighthouse, accessibility automation and browser hydration QA against the hosted staging URL.
8. Validate OAuth callbacks, email verification and team invitation flows with real providers.
9. Validate AI Copilot mutating actions through audited platform commands.
10. Run staged load testing with `npm.cmd run staging:load` and close Critical/High issues.
11. Run `npm.cmd run production:launch-gate` and receive a `GO` decision before tagging v2.0.0.

## v1.1+ Roadmap

- Provider-specific email, OAuth and AI action validation.
- E2E coverage expansion for RBAC, tenant isolation and workflows.
- Sustained queue, WebSocket and workflow load testing.
- Screenshot and demo asset capture for public GitHub presentation.
