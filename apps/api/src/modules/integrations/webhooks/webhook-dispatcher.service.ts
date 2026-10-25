import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
@Injectable()
export class WebhookDispatcher { constructor(@InjectQueue(QUEUES.WEBHOOKS) private readonly queue: Queue) {} dispatch(input: Record<string, unknown>) { return this.queue.add('webhook-delivery', input); } }
