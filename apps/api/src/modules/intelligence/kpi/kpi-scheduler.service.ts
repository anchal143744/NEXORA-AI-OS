import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { KpiPeriod } from './kpi.contracts';
@Injectable()
export class KpiScheduler { constructor(@InjectQueue(QUEUES.KPI_SNAPSHOTS) private readonly queue: Queue) {} schedule(input: { tenantId: string; workspaceId?: string; period: KpiPeriod; runAt?: Date }) { return this.queue.add('kpi-snapshot', input, input.runAt ? { delay: Math.max(0, input.runAt.getTime() - Date.now()) } : undefined); } }
