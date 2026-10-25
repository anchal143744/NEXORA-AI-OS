import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { WorkflowExecutionJob } from '../contracts/workflow-definition.contract';
@Processor(QUEUES.WORKFLOW_RETRY)
export class WorkflowRetryProcessor extends WorkerHost {
  constructor(@InjectQueue(QUEUES.WORKFLOW_EXECUTION) private readonly executionQueue: Queue<WorkflowExecutionJob>) { super(); }
  async process(job: Job<WorkflowExecutionJob>) { await this.executionQueue.add('execute-workflow-retry', job.data); return { retried: true, executionId: job.data.executionId }; }
}
