# Security Guide

## Runtime Controls

- Helmet CSP, HSTS, frame denial, referrer policy and no-sniff headers.
- CORS allowlist through `CORS_ORIGINS`.
- Payload limits through `API_PAYLOAD_LIMIT`.
- Tenant and workspace validation middleware.
- JWT authentication and RBAC guards.
- Redacted JSON logging for secrets, tokens, cookies, credentials and passwords.

## Secret Rules

- Use a secret manager for all Kubernetes secret values.
- Rotate API keys every 180 days.
- Rotate OAuth and webhook secrets every 90 days.
- Use 64+ character signing and encryption secrets.

## Metrics Endpoint

`/api/metrics` is public to the application but should be network restricted at NGINX, ingress or service mesh level.