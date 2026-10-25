import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
@Processor(QUEUES.ANALYTICS)
export class AnalyticsProcessor extends WorkerHost { async process(job: Job<Record<string, unknown>>) { return { processed: true, kind: 'analytics', ...job.data }; } }
