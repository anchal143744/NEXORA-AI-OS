import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { SyncEngine } from '../sync/sync-engine.service';
@Processor(QUEUES.SYNC)
export class SyncProcessor extends WorkerHost { constructor(private readonly sync: SyncEngine) { super(); } async process(job: Job<any>) { if (job.data.syncRunId) return this.sync.complete(job.data.syncRunId, { processed: true, mode: job.data.mode ?? 'one_way' }); return { scheduled: true }; } }
