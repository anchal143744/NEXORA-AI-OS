import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
@Injectable()
export class SyncScheduler { constructor(@InjectQueue(QUEUES.SYNC) private readonly queue: Queue) {} schedule(input: Record<string, unknown>, runAt?: Date) { return this.queue.add('scheduled-sync', input, runAt ? { delay: Math.max(0, runAt.getTime() - Date.now()) } : undefined); } }
