# DevOps

Production deployment assets include Dockerfile.prod, docker-compose.prod.yml and .env.production.example.

Startup checks validate required environment variables, database connectivity, Redis connectivity and queue availability before reporting readiness.
