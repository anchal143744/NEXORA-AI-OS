# Technical Architecture Summary

NEXORA AI OS uses a monorepo architecture with NestJS for backend services, Next.js for frontend workspaces, Prisma/PostgreSQL for durable data, Redis/BullMQ for queues and realtime infrastructure, and Docker/Kubernetes for production deployment.

Key technical strengths:

- Global authentication infrastructure with AuthCoreModule and single JwtAuthGuard provider boundary.
- Global request context through CommonModule and RequestContextStore.
- Multi-tenant Prisma data access with audit and observability integration.
- 818 Prisma models and 2013 controller endpoint decorators.
- Structured logging, Prometheus metrics and OpenTelemetry-ready tracing.
