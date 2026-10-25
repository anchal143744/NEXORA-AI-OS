import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class NotificationRepository { constructor(private readonly prisma:PrismaService){}
create(input:{tenantId:string;userId:string;type:string;title:string;body?:string;actionUrl?:string;metadata?:Record<string,unknown>}){return this.prisma.notification.create({data:{tenantId:input.tenantId,userId:input.userId,type:mapType(input.type),title:input.title,body:input.body,actionUrl:input.actionUrl,metadata:input.metadata??{}}})}
list(tenantId:string,userId:string){return this.prisma.notification.findMany({where:{tenantId,userId,deletedAt:null},orderBy:{createdAt:'desc'},take:100})}}
function mapType(type:string){ if(type==='critical') return 'SECURITY'; if(type==='warning') return 'SYSTEM'; if(type==='success') return 'SYSTEM'; return 'SYSTEM'; }
