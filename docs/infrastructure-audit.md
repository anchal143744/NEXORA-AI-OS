# Infrastructure Audit

## Current State

- API and worker container images are defined with non-root runtime users.
- Docker Compose includes API, worker, PostgreSQL, Redis, MinIO and NGINX.
- Kubernetes includes API and worker deployments, service, config, secret template, ingress and HPA.
- Health probes use the real Nest paths under `/api/v1/health`.
- Prometheus scrapes `/api/metrics`.

## Readiness

The infrastructure is ready for staging deployment after real secrets and image tags are supplied.