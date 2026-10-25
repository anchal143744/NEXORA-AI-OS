# Disaster Recovery Guide

## Backup Scope

- PostgreSQL snapshots and logical backups.
- Redis append-only data where queue recovery is required.
- MinIO/S3 buckets for documents and generated exports.
- Kubernetes ConfigMaps, Secrets and release manifests.

## Recovery Targets

- API and worker stateless services: recreate from images.
- PostgreSQL RPO: 15 minutes or better for production.
- PostgreSQL RTO: 60 minutes for standard regions.
- Redis queue RPO: best effort unless Redis persistence is enabled.

## Recovery Runbook

1. Freeze writes at the edge proxy.
2. Restore PostgreSQL from the selected recovery point.
3. Restore object storage bucket state.
4. Recreate Redis from persisted data or accept queue replay gaps.
5. Apply Kubernetes manifests.
6. Run `/api/v1/health/ready` and workflow queue checks.
7. Re-enable traffic after audit sign-off.