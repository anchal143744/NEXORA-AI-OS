import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { ConnectorExecution } from './connector.contracts';
@Injectable()
export class ConnectorRuntime { constructor(@InjectQueue(QUEUES.INTEGRATIONS) private readonly queue: Queue) {} execute(input: ConnectorExecution) { return this.queue.add('connector-runtime', input).then(job => ({ queued: true, jobId: job.id, connectorKey: input.connectorKey, operation: input.operation })); } }
