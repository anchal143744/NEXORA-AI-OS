import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsNumber, IsObject, IsOptional, IsString, Length } from 'class-validator';

export const SUPPORTED_CURRENCIES = ['USD','EUR','GBP','INR','AED','CAD','AUD','JPY','SGD','CHF'] as const;
export const TAX_TYPES = ['GST','VAT','SALES_TAX','CORPORATE_TAX'] as const;
export const INVOICE_STATUSES = ['DRAFT','SENT','ISSUED','PARTIALLY_PAID','PAID','OVERDUE','CANCELLED','REFUNDED','VOID'] as const;
export const PAYMENT_PROVIDERS = ['stripe','razorpay','paypal','wise','bank_transfer','manual'] as const;

export class UpsertCurrencyDto {
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) code!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() symbol!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() precision?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() roundingMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() symbolPosition?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() thousandsSeparator?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decimalSeparator?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateExchangeRateDto {
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) baseCurrencyCode!: string;
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) quoteCurrencyCode!: string;
  @ApiProperty() @IsNumber() rate!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() providerReference?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rateDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ConvertCurrencyDto {
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) fromCurrency!: string;
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) toCurrency!: string;
  @ApiProperty() @IsNumber() amount!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() at?: string;
}

export class CreateTaxRegionDto {
  @ApiProperty() @IsString() @Length(2, 2) countryCode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionCode?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() parentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateTaxCategoryDto {
  @ApiProperty() @IsString() code!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() exempt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateTaxRuleDto {
  @ApiProperty() @IsString() @Length(2, 2) countryCode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() taxCategoryId?: string;
  @ApiProperty({ enum: TAX_TYPES }) @IsIn(TAX_TYPES) taxType!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsNumber() rate!: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() inclusive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() exemptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() exemptionReason?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() reverseCharge?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() version?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() corporateTaxMetadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CalculateTaxDto {
  @ApiProperty() @IsString() @Length(2, 2) countryCode!: string;
  @ApiProperty() @IsNumber() amount!: number;
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) currency!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() taxCategoryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() inclusive?: boolean;
}

export class InvoiceLineDto {
  @ApiProperty() @IsString() description!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantity?: number;
  @ApiProperty() @IsNumber() unitPrice!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() discount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() itemType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() taxCategoryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateInvoiceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() billingAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supplierId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() templateId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() seriesKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() invoiceNumber?: string;
  @ApiProperty() @IsString() @Length(2, 2) countryCode!: string;
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) currency!: string;
  @ApiPropertyOptional({ enum: SUPPORTED_CURRENCIES }) @IsOptional() @IsIn(SUPPORTED_CURRENCIES) baseCurrency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() exchangeRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() taxMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentTerms?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() lateFeeRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() billingAddress?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() shippingAddress?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiProperty({ type: [InvoiceLineDto] }) @IsArray() items!: InvoiceLineDto[];
}

export class UpdateInvoiceStatusDto {
  @ApiProperty({ enum: INVOICE_STATUSES }) @IsIn(INVOICE_STATUSES) status!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePaymentDto {
  @ApiProperty() @IsString() idempotencyKey!: string;
  @ApiProperty() @IsString() invoiceId!: string;
  @ApiProperty({ enum: PAYMENT_PROVIDERS }) @IsIn(PAYMENT_PROVIDERS) provider!: string;
  @ApiProperty() @IsString() paymentMethod!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() transactionReference?: string;
  @ApiProperty() @IsNumber() amount!: number;
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) currency!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paidAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateInvoiceTemplateDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(2, 2) countryCode?: string;
  @ApiProperty() @IsString() templateKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() invoiceFormat?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() taxFormat?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() registrationFormat?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() paymentInstructions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsNumber() version?: number;
}

export class CreateInvoiceSeriesDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(2, 2) countryCode?: string;
  @ApiProperty() @IsString() seriesKey!: string;
  @ApiProperty() @IsString() prefix!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() suffix?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() nextNumber?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() padding?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() resetPolicy?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpsertFinancialLocalizationDto {
  @ApiProperty() @IsString() @Length(2, 2) countryCode!: string;
  @ApiProperty() @IsString() profileKey!: string;
  @ApiProperty({ enum: SUPPORTED_CURRENCIES }) @IsIn(SUPPORTED_CURRENCIES) currencyCode!: string;
  @ApiProperty() @IsString() locale!: string;
  @ApiProperty() @IsString() dateFormat!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() currencyFormat?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() invoiceFormat?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() taxFormat?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() businessRegistrationFormat?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() roundingRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() paymentTerms?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() lateFeeRules?: Record<string, unknown>;
}
