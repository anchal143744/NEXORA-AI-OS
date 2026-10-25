import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { RedisService } from '../../../infrastructure/redis/redis.service';

@Injectable()
export class QueueHealthService {
  constructor(
    private readonly redis: RedisService,
    @InjectQueue(QUEUES.EVENTS) private readonly eventsQueue: Queue,
    @InjectQueue(QUEUES.WORKFLOW_EXECUTION) private readonly workflowQueue: Queue,
    @InjectQueue(QUEUES.AGENT_EXECUTION) private readonly agentQueue: Queue,
    @InjectQueue(QUEUES.WEBHOOKS) private readonly webhookQueue: Queue,
  ) {}

  async check() {
    const [events, workflows, agents, webhooks] = await Promise.all([
      this.eventsQueue.getJobCounts(),
      this.workflowQueue.getJobCounts(),
      this.agentQueue.getJobCounts(),
      this.webhookQueue.getJobCounts(),
    ]);
    return {
      status: this.redis.isEnabled() ? 'ok' : (process.env.NODE_ENV === 'production' ? 'error' : 'disabled'),
      mode: process.env.NODE_ENV ?? 'development',
      message: this.redis.isEnabled() ? 'Queues enabled.' : 'Queues Disabled - Running Development Mode.',
      queues: { events, workflows, agents, webhooks },
    };
  }
}