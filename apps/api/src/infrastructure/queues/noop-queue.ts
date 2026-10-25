import { Logger } from '@nestjs/common';
import { telemetryRegistry } from '../../common/observability/telemetry-registry';

export type NoopQueueJob<T = unknown> = {
  id: string;
  name: string;
  data: T;
  queueName: string;
  opts?: Record<string, unknown>;
};

export class NoopQueue<T = unknown> {
  private readonly logger = new Logger('NoopQueue');
  private readonly jobs: NoopQueueJob<T>[] = [];
  private counter = 0;

  constructor(readonly name: string) {}

  async add(name: string, data: T, opts?: Record<string, unknown>) {
    const job = { id: `${this.name}:${++this.counter}`, name, data, queueName: this.name, opts };
    this.jobs.push(job);
    telemetryRegistry.incrementCounter('nexora_bullmq_jobs_total', 1, { queue: this.name, job_name: name, status: 'disabled' });
    this.logger.debug(`[Queues Disabled] Accepted no-op job ${name} on ${this.name}.`);
    return job;
  }

  async getJobCounts() {
    return { waiting: this.jobs.length, active: 0, completed: 0, failed: 0, delayed: 0, paused: 0 };
  }

  async getWaiting() { return this.jobs; }
  async getActive() { return []; }
  async getCompleted() { return []; }
  async getFailed() { return []; }
  async getDelayed() { return []; }
  async close() { return undefined; }
}