import { Injectable } from '@nestjs/common';
import { DatabaseHealthService } from '../health/database-health.service';
import { RedisHealthService } from '../health/redis-health.service';
import { QueueHealthService } from '../health/queue-health.service';
@Injectable()
export class DependencyValidationService { constructor(private readonly db: DatabaseHealthService, private readonly redis: RedisHealthService, private readonly queues: QueueHealthService) {} async validate() { return { database: await this.db.check(), redis: await this.redis.check(), queues: await this.queues.check() }; } }
