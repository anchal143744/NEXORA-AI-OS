import { Module } from '@nestjs/common';
import { TenantsModule } from '../tenants/tenants.module';
import { InventoryLedgerService } from './inventory-ledger.service';
import { PaymentsService } from './payments.service';
import { RetailAccessService } from './retail-access.service';
import { RetailController } from './retail.controller';
import { RetailReportService } from './retail-report.service';
import { RetailSalesService } from './retail-sales.service';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import {LeadIntakeController} from './lead-intake.controller';import {ShopLeadsService} from './shop-leads.service';
import {ShopAssistantService} from './shop-assistant.service';
import {ShopDocumentsService} from './shop-documents.service';
@Module({ imports: [TenantsModule], providers: [RetailAccessService, InventoryLedgerService, PaymentsService, RetailSalesService, RetailReportService, ShopService,ShopDocumentsService,ShopAssistantService,ShopLeadsService], controllers: [RetailController, ShopController,LeadIntakeController], exports: [RetailAccessService, InventoryLedgerService, PaymentsService, RetailReportService] })
export class RetailModule {}
