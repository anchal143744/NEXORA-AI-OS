import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { AlertEngine } from '../alerts/alert-engine.service';
@Processor(QUEUES.ALERTS)
export class AlertsProcessor extends WorkerHost { constructor(private readonly alerts: AlertEngine) { super(); } process(job: Job<Record<string, unknown>>) { return this.alerts.generate(); } }
