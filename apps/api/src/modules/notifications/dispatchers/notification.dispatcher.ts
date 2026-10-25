import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { EmailService } from '../../email/email.service';
import { REALTIME_CHANNELS } from '../../realtime/channels/realtime-channel';
import { RealtimeChannelService } from '../../realtime/realtime-channel.service';

@Injectable()
export class NotificationDispatcher {
  constructor(private readonly realtime: RealtimeChannelService, private readonly email: EmailService, @InjectQueue(QUEUES.NOTIFICATIONS) private readonly queue: Queue, @InjectQueue(QUEUES.EMAIL) private readonly emailQueue: Queue) {}
  async dispatch(notification: any, channels: Array<'in-app'|'email'|'realtime'> = ['in-app','realtime']) {
    await this.queue.add('notification.dispatch', { notification, channels });
    if (channels.includes('realtime')) this.realtime.publishTenant(notification.tenantId, REALTIME_CHANNELS.NOTIFICATIONS, 'notification.created', notification);
    if (channels.includes('email')) await this.emailQueue.add('email.notification', { toUserId: notification.userId, notification });
    return { dispatched: true, channels };
  }
}
