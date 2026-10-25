import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { KpiSnapshotService } from '../kpi/kpi-snapshot.service';
@Processor(QUEUES.KPI_SNAPSHOTS)
export class KpiSnapshotProcessor extends WorkerHost { constructor(private readonly snapshots: KpiSnapshotService) { super(); } process(job: Job<any>) { const now = new Date(); return this.snapshots.generate({ tenantId: job.data.tenantId, workspaceId: job.data.workspaceId, period: job.data.period ?? 'monthly', periodStart: job.data.periodStart ? new Date(job.data.periodStart) : new Date(now.getFullYear(), now.getMonth(), 1), periodEnd: job.data.periodEnd ? new Date(job.data.periodEnd) : now }); } }
