import { Global, Logger, Module, OnModuleInit, Provider } from '@nestjs/common';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { DEFAULT_JOB_OPTIONS, QUEUES } from './queue.constants';
import { NoopQueue } from './noop-queue';
import { AiJobsQueueProcessor } from './processors/ai-jobs.processor';
import { EmailQueueProcessor } from './processors/email.processor';
import { NotificationsQueueProcessor } from './processors/notifications.processor';
import { QueueFailureProcessor } from './processors/queue-failure.processor';
import { ReportsQueueProcessor } from './processors/reports.processor';

const queueDefinitions = [
  { name: QUEUES.EMAIL, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.NOTIFICATIONS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.REPORTS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.EVENTS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.AI_JOBS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.ACTIVITY, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.WORKFLOW_EXECUTION, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.WORKFLOW_RETRY, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.AGENT_EXECUTION, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.AGENT_ANALYSIS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.KPI_SNAPSHOTS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.ANALYTICS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.ALERTS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.INTEGRATIONS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.WEBHOOKS, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.SYNC, defaultJobOptions: DEFAULT_JOB_OPTIONS },
  { name: QUEUES.DEAD_LETTER, defaultJobOptions: { attempts: 1, removeOnComplete: 1000, removeOnFail: false } },
];

const production = process.env.NODE_ENV === 'production';
const noopQueueProviders: Provider[] = queueDefinitions.map((definition) => ({ provide: getQueueToken(definition.name), useValue: new NoopQueue(definition.name) }));
const noopQueueExports = queueDefinitions.map((definition) => getQueueToken(definition.name));
const queueProcessors = [EmailQueueProcessor, NotificationsQueueProcessor, ReportsQueueProcessor, AiJobsQueueProcessor, QueueFailureProcessor];

class QueueRuntimeStatus implements OnModuleInit {
  private readonly logger = new Logger('QueueModule');
  onModuleInit() {
    if (production) this.logger.log('[Queues Enabled] Production BullMQ workers active.');
    else this.logger.warn('[Queues Disabled] Running Development Mode.');
  }
}

@Global()
@Module({
  imports: production
    ? [
        BullModule.forRoot({ connection: { url: process.env.REDIS_URL ?? 'redis://localhost:6379' }, defaultJobOptions: DEFAULT_JOB_OPTIONS }),
        BullModule.registerQueue(...queueDefinitions),
      ]
    : [],
  providers: production ? [...queueProcessors, QueueRuntimeStatus] : [...noopQueueProviders, QueueRuntimeStatus],
  exports: production ? [BullModule] : noopQueueExports,
})
export class QueueModule {}