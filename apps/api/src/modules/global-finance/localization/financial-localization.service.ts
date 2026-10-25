import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { UpsertFinancialLocalizationDto } from '../dto/global-finance.dto';

@Injectable()
export class FinancialLocalizationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private tenantId() { return this.context.currentTenantId(); }

  async list(countryCode?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (countryCode) where.countryCode = countryCode.toUpperCase();
    return this.prisma.financialLocalizationProfile.findMany({ where, orderBy: [{ countryCode: 'asc' }, { profileKey: 'asc' }] });
  }

  async get(countryCode: string, profileKey = 'default') {
    const profile = await this.prisma.financialLocalizationProfile.findFirst({ where: { tenantId: this.tenantId(), countryCode: countryCode.toUpperCase(), profileKey, deletedAt: null } });
    if (!profile) throw new NotFoundException('Financial localization profile not found');
    return profile;
  }

  async upsert(dto: UpsertFinancialLocalizationDto) {
    const tenantId = this.tenantId();
    return this.prisma.financialLocalizationProfile.upsert({
      where: { tenantId_countryCode_profileKey: { tenantId, countryCode: dto.countryCode.toUpperCase(), profileKey: dto.profileKey } },
      update: { currencyCode: dto.currencyCode, locale: dto.locale, dateFormat: dto.dateFormat, currencyFormat: dto.currencyFormat ?? {}, invoiceFormat: dto.invoiceFormat ?? {}, taxFormat: dto.taxFormat ?? {}, businessRegistrationFormat: dto.businessRegistrationFormat ?? {}, roundingRules: dto.roundingRules ?? {}, paymentTerms: dto.paymentTerms ?? {}, lateFeeRules: dto.lateFeeRules ?? {} },
      create: { tenantId, countryCode: dto.countryCode.toUpperCase(), profileKey: dto.profileKey, currencyCode: dto.currencyCode, locale: dto.locale, dateFormat: dto.dateFormat, currencyFormat: dto.currencyFormat ?? {}, invoiceFormat: dto.invoiceFormat ?? {}, taxFormat: dto.taxFormat ?? {}, businessRegistrationFormat: dto.businessRegistrationFormat ?? {}, roundingRules: dto.roundingRules ?? {}, paymentTerms: dto.paymentTerms ?? {}, lateFeeRules: dto.lateFeeRules ?? {} },
    });
  }

  async invoiceLocalizationContext(countryCode: string, profileKey = 'default') {
    const [financialProfile, countryProfile, taxProfiles] = await Promise.all([
      this.prisma.financialLocalizationProfile.findFirst({ where: { tenantId: this.tenantId(), countryCode: countryCode.toUpperCase(), profileKey, deletedAt: null } }),
      this.prisma.countryProfile.findUnique({ where: { countryCode: countryCode.toUpperCase() } }),
      this.prisma.countryTaxProfile.findMany({ where: { countryCode: countryCode.toUpperCase(), deletedAt: null } }),
    ]);
    return {
      countryCode: countryCode.toUpperCase(),
      profileKey,
      currencyCode: financialProfile?.currencyCode ?? countryProfile?.currencyCode,
      locale: financialProfile?.locale ?? countryProfile?.locale,
      dateFormat: financialProfile?.dateFormat ?? countryProfile?.dateFormat,
      invoiceFormat: financialProfile?.invoiceFormat ?? {},
      taxFormat: financialProfile?.taxFormat ?? {},
      registrationFormat: financialProfile?.businessRegistrationFormat ?? {},
      currencyFormat: financialProfile?.currencyFormat ?? {},
      paymentTerms: financialProfile?.paymentTerms ?? {},
      lateFeeRules: financialProfile?.lateFeeRules ?? {},
      taxProfiles,
    };
  }
}