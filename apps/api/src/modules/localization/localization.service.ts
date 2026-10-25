import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CountryIntelligenceService } from './country/country-intelligence.service';
import { LocalizationSettingsDto } from './dto/localization.dto';
import { LanguageService } from './languages/language.service';

@Injectable()
export class LocalizationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly languages: LanguageService, private readonly countries: CountryIntelligenceService) {}

  async getSettings(scope?: string, scopeId?: string) {
    const tenantId = this.context.currentTenantId();
    const where: any = { tenantId, deletedAt: null };
    if (scope) where.scope = scope;
    if (scopeId) where.scopeId = scopeId;
    const preferences = await this.prisma.languagePreference.findMany({ where, orderBy: { updatedAt: 'desc' } });
    const active = preferences[0];
    if (!active) return { tenantId, languageCode: 'en', locale: 'en-US', countryCode: 'US', timezone: 'UTC', preferences: [] };
    const countryProfile = await this.countries.getCountryProfile(active.countryCode);
    return { ...active, countryProfile, preferences };
  }

  async updateSettings(dto: LocalizationSettingsDto) {
    const tenantId = this.context.currentTenantId();
    return this.prisma.languagePreference.upsert({
      where: { tenantId_scope_scopeId: { tenantId, scope: dto.scope, scopeId: dto.scopeId ?? 'default' } },
      update: { languageCode: dto.languageCode, locale: dto.locale, countryCode: dto.countryCode.toUpperCase(), timezone: dto.timezone, currencyCode: dto.currencyCode, dateFormat: dto.dateFormat, numberFormat: dto.numberFormat },
      create: { tenantId, scope: dto.scope, scopeId: dto.scopeId ?? 'default', languageCode: dto.languageCode, locale: dto.locale, countryCode: dto.countryCode.toUpperCase(), timezone: dto.timezone, currencyCode: dto.currencyCode, dateFormat: dto.dateFormat, numberFormat: dto.numberFormat },
    });
  }

  detect(input?: { acceptLanguage?: string; locale?: string; countryCode?: string; timezone?: string }) {
    const countryCode = this.countries.detectCountry({ ipCountry: input?.countryCode, locale: input?.locale, timezone: input?.timezone });
    const languageCode = this.languages.detectLanguage({ acceptLanguage: input?.acceptLanguage, locale: input?.locale, countryCode });
    const locale = input?.locale ?? `${languageCode}-${countryCode}`;
    return { languageCode, countryCode, locale, timezone: input?.timezone ?? 'UTC' };
  }
}