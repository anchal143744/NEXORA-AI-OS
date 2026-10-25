# Deployment Guide

## Release Target

Version 1.0.0-rc.1 is a release candidate for staging and controlled enterprise evaluation. Production GA requires live migration verification, secret provisioning, managed service configuration and final security sign-off.

## Docker

```powershell
docker compose up --build
```

Production compose:

```powershell
docker compose -f docker-compose.production.yml up --build -d
```

## Kubernetes

Kubernetes manifests are located in infra/kubernetes:

- api-deployment.yaml
- worker-deployment.yaml
- service.yaml
- configmap.yaml
- secret.template.yaml
- ingress.yaml
- hpa.yaml

Apply only after creating real secrets from secret.template.yaml.

## Operational Checks

- /api/v1/health/live
- /api/v1/health/ready
- /docs-json
- /api/metrics

## Phase 10 Launch Gate

Before tagging v2.0.0, run:

```powershell
npm.cmd run production:launch-gate
```

A public launch is allowed only when the gate returns `GO`, the Redis-backed API is healthy, hosted smoke tests pass, Lighthouse evidence is captured and provider credentials have been validated.
