import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
@Processor(QUEUES.INTEGRATIONS)
export class ConnectorProcessor extends WorkerHost { async process(job: Job<Record<string, unknown>>) { return { executed: true, operation: job.data.operation, connectorKey: job.data.connectorKey }; } }
