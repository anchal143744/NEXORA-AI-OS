import { Module } from '@nestjs/common';
import { RetailModule } from '../retail/retail.module';
import { AuditModule } from '../audit/audit.module';
import { TenantsModule } from '../tenants/tenants.module';
import { CurrenciesController } from './currency/currencies.controller';
import { CurrencyEngineService } from './currency/currency-engine.service';
import { ExchangeRatesController } from './currency/exchange-rates.controller';
import { ExchangeRateService } from './currency/exchange-rate.service';
import { GlobalBillingService } from './payments/global-billing.service';
import { PaymentsController } from './payments/payments.controller';
import { InvoiceIntelligenceService } from './invoices/invoice-intelligence.service';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoiceTemplatesController } from './templates/invoice-templates.controller';
import { FinancialLocalizationController } from './localization/financial-localization.controller';
import { FinancialLocalizationService } from './localization/financial-localization.service';
import { TaxRulesController } from './tax/tax-rules.controller';
import { TaxEngineService } from './tax/tax-engine.service';

@Module({ imports: [TenantsModule, AuditModule, RetailModule], controllers: [CurrenciesController, ExchangeRatesController, TaxRulesController, InvoicesController, PaymentsController, InvoiceTemplatesController, FinancialLocalizationController], providers: [CurrencyEngineService, ExchangeRateService, TaxEngineService, InvoiceIntelligenceService, GlobalBillingService, FinancialLocalizationService], exports: [CurrencyEngineService, ExchangeRateService, TaxEngineService, InvoiceIntelligenceService, GlobalBillingService, FinancialLocalizationService] })
export class GlobalFinanceModule {}
