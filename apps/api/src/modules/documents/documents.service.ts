import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessAuditService } from '../audit/business-audit.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateDocumentDto, CreateFolderDto, CreateUploadRecordDto } from './dto/documents.dto';
import { StorageAbstractionService } from './storage.service';
@Injectable()
export class DocumentsService{constructor(private readonly prisma:PrismaService,private readonly context:TenantContextService,private readonly audit:BusinessAuditService,private readonly storage:StorageAbstractionService){}
private tenantId(){return this.context.currentTenantId()} private workspaceId(){const id=this.context.currentWorkspaceId(); if(!id) throw new NotFoundException('Workspace context is required'); return id} private rec(a:'CREATE'|'UPDATE'|'DELETE',t:string,id:string,m:string){return this.audit.record({tenantId:this.tenantId(),userId:this.context.context()?.userId,action:a,resourceType:t,resourceId:id,message:m})}
async createFolder(dto:CreateFolderDto){const row=await this.prisma.documentFolder.create({data:{tenantId:this.tenantId(),workspaceId:this.workspaceId(),parentId:dto.parentId,name:dto.name,path:dto.path}}); await this.rec('CREATE','document.folder',row.id,'Document folder created'); return row}
async createDocument(dto:CreateDocumentDto){const row=await this.prisma.document.create({data:{tenantId:this.tenantId(),title:dto.title,documentType:dto.documentType,contentRef:dto.contentRef}}); await this.rec('CREATE','document.metadata',row.id,'Document metadata created'); return row}
async createUploadRecord(dto:CreateUploadRecordDto){const tenantId=this.tenantId(); const workspaceId=this.workspaceId(); const row=await this.prisma.uploadRecord.create({data:{tenantId,workspaceId,folderId:dto.folderId,fileName:dto.fileName,mimeType:dto.mimeType,sizeBytes:BigInt(dto.sizeBytes),storageProvider:dto.storageProvider??'pending',storageKey:this.storage.buildPendingStorageKey(tenantId,workspaceId,dto.fileName)}}); await this.rec('CREATE','document.upload',row.id,'Upload record created'); return row}
}
