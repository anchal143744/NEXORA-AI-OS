import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { tracingBackend } from '../../../common/observability/tracing-backend';
import { QUEUES } from '../queue.constants';

@Processor(QUEUES.EMAIL)
export class EmailQueueProcessor extends WorkerHost {
  async process(job: Job) {
    const span = tracingBackend.startSpan('bullmq.email.process', { kind: 'consumer', attributes: { queue: job.queueName, jobName: job.name, jobId: job.id } });
    const started = process.hrtime.bigint();
    try {
      const result = { sent: true, jobId: job.id, type: job.name };
      recordQueue(job, started, 'ok');
      tracingBackend.finishSpan(span, 'OK');
      return result;
    } catch (error) {
      recordQueue(job, started, 'error');
      tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' });
      throw error;
    }
  }
}

function recordQueue(job: Job, started: bigint, status: string) {
  const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000;
  telemetryRegistry.incrementCounter('nexora_bullmq_jobs_total', 1, { queue: job.queueName, job_name: job.name, status });
  telemetryRegistry.observeHistogram('nexora_bullmq_job_duration_ms', durationMs, { queue: job.queueName, job_name: job.name, status });
}