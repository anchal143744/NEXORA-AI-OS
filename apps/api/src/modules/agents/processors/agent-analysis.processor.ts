import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
@Processor(QUEUES.AGENT_ANALYSIS)
export class AgentAnalysisProcessor extends WorkerHost { async process(job: Job<Record<string, unknown>>) { return { analyzed: true, ...job.data }; } }
