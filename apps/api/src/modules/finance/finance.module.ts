import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { TenantsModule } from '../tenants/tenants.module';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { RetailModule } from '../retail/retail.module';
@Module({imports:[TenantsModule,AuditModule,RetailModule],controllers:[FinanceController],providers:[FinanceService],exports:[FinanceService]})
export class FinanceModule {}
