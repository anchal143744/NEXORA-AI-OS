# Redis Architecture

Phase 6 implements Redis infrastructure for cache, pub/sub, and event transport.

Services:

- RedisService
- RedisCacheService
- RedisPubSubService
- RedisEventTransportService

Cache scopes:

- dashboard
- workspace
- analytics
- ai-context
- user-session

Redis event channels follow:

`nexora:events:tenant:{tenantId}`

BullMQ uses Redis for queues:

- email
- notifications
- reports
- events
- ai-jobs
- activity
- dead-letter
