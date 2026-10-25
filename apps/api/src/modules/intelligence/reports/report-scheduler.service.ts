import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
@Injectable()
export class ReportScheduler { constructor(@InjectQueue(QUEUES.REPORTS) private readonly queue: Queue) {} schedule(input: Record<string, unknown>) { return this.queue.add('scheduled-report', input); } }
