import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { AgentExecutionJob } from '../contracts/agent.contract';
import { AgentExecutionService } from '../runtime/agent-execution.service';
@Processor(QUEUES.AGENT_EXECUTION)
export class AgentExecutionProcessor extends WorkerHost { constructor(private readonly execution: AgentExecutionService) { super(); } process(job: Job<AgentExecutionJob>) { return this.execution.execute(job.data); } }
