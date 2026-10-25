import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
@Module({imports:[TenantsModule,AuditModule],controllers:[ProjectsController],providers:[ProjectsService],exports:[ProjectsService]})
export class ProjectsModule {}
