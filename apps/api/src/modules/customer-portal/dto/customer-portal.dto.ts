import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCustomerAccountDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accountKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() legalName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accountType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() primaryContactEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() healthScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() successTier?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCustomerWorkspaceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accessLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalWorkspaceRef?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() activatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() suspendedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() users?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() permissions?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateBillingProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() profileKey?: string;
  @ApiProperty() @IsString() billingName!: string;
  @ApiProperty() @IsString() billingEmail!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() taxId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentTerms?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() address?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() taxMetadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCustomerSubscriptionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() billingProfileId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionKey?: string;
  @ApiProperty() @IsString() planName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planTier?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amountMonthly?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() billingCycle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startsAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() renewsAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cancelledAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() entitlements?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() usageLimits?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateInvoiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() billingProfileId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() invoiceKey?: string;
  @ApiProperty() @IsString() invoiceNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() subtotal?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() taxAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amountPaid?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amountDue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() issuedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paidAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() lineItems?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() taxBreakdown?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() payments?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePaymentMethodDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() billingProfileId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() methodKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() methodType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brand?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() last4?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() expMonth?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() expYear?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isDefault?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() verifiedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() billingDetails?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateUsageMetricDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricKey?: string;
  @ApiProperty() @IsString() metricName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricType?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() billable?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerAccountDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tier?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() primaryEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() commissionRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() portalAccess?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerWorkspaceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accessLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portalRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() permissions?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() users?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerCommissionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() commissionKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() grossAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() commissionRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() commissionAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() earnedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paidAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerReferralDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() referralKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() leadId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiProperty() @IsString() customerName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() estimatedValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() submittedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() convertedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
