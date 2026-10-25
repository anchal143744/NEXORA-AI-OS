# Deployment Guide

NEXORA deploys as an API container, worker container, PostgreSQL, Redis, MinIO-compatible object storage and an NGINX edge proxy.

## Local Cloud Stack

1. Copy `.env.production.example` to `.env` and set strong secrets.
2. Run `docker compose up --build`.
3. Verify `GET http://localhost:4000/api/v1/health/live`.
4. Verify Prometheus text at `GET http://localhost:4000/api/metrics`.

## Production Compose

1. Build and push `NEXORA_API_IMAGE` and `NEXORA_WORKER_IMAGE`.
2. Fill `infra/env/.env.production.example` with production secrets from the secret manager.
3. Run database backups before migration.
4. Run `docker compose -f docker-compose.production.yml up -d`.
5. Confirm health, readiness and logs.

## Kubernetes

Apply in this order:

```powershell
kubectl apply -f infra/kubernetes/namespace.yaml
kubectl apply -f infra/kubernetes/configmap.yaml
kubectl apply -f infra/kubernetes/secret.template.yaml
kubectl apply -f infra/kubernetes/service.yaml
kubectl apply -f infra/kubernetes/api-deployment.yaml
kubectl apply -f infra/kubernetes/worker-deployment.yaml
kubectl apply -f infra/kubernetes/ingress.yaml
kubectl apply -f infra/kubernetes/hpa.yaml
```

Replace `secret.template.yaml` values before applying to a real cluster.