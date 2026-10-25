import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { TenantsModule } from '../tenants/tenants.module';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
@Module({imports:[TenantsModule,AuditModule],controllers:[HrController],providers:[HrService],exports:[HrService]})
export class HrModule {}
