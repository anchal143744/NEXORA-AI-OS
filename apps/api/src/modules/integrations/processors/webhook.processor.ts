import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
@Processor(QUEUES.WEBHOOKS)
export class WebhookProcessor extends WorkerHost { constructor(private readonly prisma: PrismaService) { super(); } async process(job: Job<any>) { if (job.data.deliveryId) await this.prisma.webhookDelivery.update({ where: { id: job.data.deliveryId }, data: { status: 'SUCCEEDED', deliveredAt: new Date() } }); return { delivered: true }; } }
