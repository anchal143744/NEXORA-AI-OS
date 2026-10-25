import { Injectable } from '@nestjs/common';
import { WebhookDispatcher } from './webhook-dispatcher.service';
@Injectable()
export class WebhookRetryEngine { constructor(private readonly dispatcher: WebhookDispatcher) {} retry(delivery: Record<string, unknown>) { return this.dispatcher.dispatch({ ...delivery, retry: true }); } }
