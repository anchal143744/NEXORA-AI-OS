# DevOps Audit

## Implemented

- GitHub Actions validates lint, Prisma, typecheck, build, API smoke tests, E2E health checks and security scan.
- Docker build jobs publish API and worker images to GHCR on non-PR runs.
- Manual deployment uses GitHub environment approvals and Kubernetes rollout checks.

## Required Operator Inputs

- Cluster credentials configured in GitHub Actions environment.
- Production secrets managed outside source control.
- Real image tags promoted through release approval.