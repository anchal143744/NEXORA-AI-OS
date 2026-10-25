import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { tracingBackend } from '../../../common/observability/tracing-backend';
import { QUEUES } from '../queue.constants';

@Processor(QUEUES.DEAD_LETTER)
export class QueueFailureProcessor extends WorkerHost {
  constructor(@InjectQueue(QUEUES.DEAD_LETTER) private readonly deadLetterQueue: Queue) { super(); }

  async process(job: Job) {
    const span = tracingBackend.startSpan('bullmq.dead_letter.process', { kind: 'consumer', attributes: { queue: job.queueName, jobName: job.name, jobId: job.id } });
    const started = process.hrtime.bigint();
    try { const result = { id: job.id, queue: job.queueName, retained: true, failedAt: new Date().toISOString() }; recordQueue(job, started, 'ok'); tracingBackend.finishSpan(span, 'OK'); return result; }
    catch (error) { recordQueue(job, started, 'error'); tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' }); throw error; }
  }

  async moveToDeadLetter(sourceQueue: string, failedJob: Job, error: Error) {
    telemetryRegistry.incrementCounter('nexora_bullmq_dead_letter_moves_total', 1, { source_queue: sourceQueue, job_name: failedJob.name });
    await this.deadLetterQueue.add('failed-job', { sourceQueue, failedJobId: failedJob.id, name: failedJob.name, data: failedJob.data, error: { message: error.message, stack: error.stack }, failedAt: new Date().toISOString() });
  }
}

function recordQueue(job: Job, started: bigint, status: string) { const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000; telemetryRegistry.incrementCounter('nexora_bullmq_jobs_total', 1, { queue: job.queueName, job_name: job.name, status }); telemetryRegistry.observeHistogram('nexora_bullmq_job_duration_ms', durationMs, { queue: job.queueName, job_name: job.name, status }); }