import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { WorkflowExecutionJob } from '../contracts/workflow-definition.contract';
import { WorkflowExecutorService } from '../workflow-executor.service';
@Processor(QUEUES.WORKFLOW_EXECUTION)
export class WorkflowExecutionProcessor extends WorkerHost {
  constructor(private readonly executor: WorkflowExecutorService) { super(); }
  process(job: Job<WorkflowExecutionJob>) { return this.executor.execute(job.data); }
}
