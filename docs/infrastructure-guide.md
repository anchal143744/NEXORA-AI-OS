# Infrastructure Guide

## Runtime Components

- API: NestJS process on port 4000.
- Worker: BullMQ and event processing process.
- PostgreSQL: primary system of record through Prisma.
- Redis: BullMQ, cache and Pub/Sub transport.
- MinIO/S3: object storage foundation.
- NGINX: edge proxy for `/api`, `/docs`, `/metrics` and `/healthz`.

## Required Environment

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NEXORA_SECRET_KEY`
- `CORS_ORIGINS`
- `OTEL_EXPORTER_OTLP_ENDPOINT` for trace export

## Health Endpoints

- Liveness: `/api/v1/health/live`
- Readiness: `/api/v1/health/ready`
- Prometheus: `/api/metrics`