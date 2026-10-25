import { Injectable } from '@nestjs/common';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDispatcher } from './dispatchers/notification.dispatcher';
import { NotificationRepository } from './repositories/notification.repository';
@Injectable()
export class NotificationService { constructor(private readonly repo:NotificationRepository, private readonly context:TenantContextService, private readonly dispatcher:NotificationDispatcher, private readonly eventBus: EventBusService){}
async create(dto:CreateNotificationDto){const tenantId=this.context.currentTenantId(); const notification=await this.repo.create({tenantId,...dto}); await this.dispatcher.dispatch(notification,['in-app','realtime']); await this.eventBus.publish({tenantId,type:'notification.created',source:'notification',subject:{type:'notification',id:notification.id},payload:{userId:dto.userId,type:dto.type,title:dto.title}}); return notification}
listMine(){const ctx=this.context.context(); return this.repo.list(this.context.currentTenantId(),ctx?.userId??'')}
}
