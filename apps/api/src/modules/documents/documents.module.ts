import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { TenantsModule } from '../tenants/tenants.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { StorageAbstractionService } from './storage.service';
@Module({imports:[TenantsModule,AuditModule],controllers:[DocumentsController],providers:[DocumentsService,StorageAbstractionService],exports:[DocumentsService]})
export class DocumentsModule {}
