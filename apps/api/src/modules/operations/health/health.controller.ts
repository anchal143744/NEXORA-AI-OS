import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthMonitoringService } from '../observability/health-monitoring.service';
import { DatabaseHealthService } from './database-health.service';
import { ExternalHealthService } from './external-health.service';
import { QueueHealthService } from './queue-health.service';
import { RedisHealthService } from './redis-health.service';
@ApiTags('Health') @Controller({ path: 'health', version: '1' })
export class HealthController { constructor(private readonly db: DatabaseHealthService, private readonly redis: RedisHealthService, private readonly queues: QueueHealthService, private readonly external: ExternalHealthService, private readonly monitor: HealthMonitoringService) {} @Get() async health() { const checks = { database: await this.db.check(), redis: await this.redis.check(), queues: await this.queues.check(), webhook: this.external.webhook(), aiProvider: this.external.aiProvider(), storage: this.external.storage() }; return this.monitor.status(checks); } @Get('ready') async ready() { return this.health(); } @Get('live') live() { return { status: 'ok', checkedAt: new Date().toISOString() }; } }
