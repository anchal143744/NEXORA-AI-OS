import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

const COUNTRY_DEFAULTS: Record<string, any> = {
  US: { name: 'United States', currencyCode: 'USD', timezones: ['America/New_York','America/Chicago','America/Denver','America/Los_Angeles'], fiscalYearStartMonth: 1, taxSystem: 'sales_tax', dateFormat: 'MM/dd/yyyy', numberFormat: 'en-US', locale: 'en-US' },
  IN: { name: 'India', currencyCode: 'INR', timezones: ['Asia/Kolkata'], fiscalYearStartMonth: 4, taxSystem: 'gst', dateFormat: 'dd/MM/yyyy', numberFormat: 'en-IN', locale: 'en-IN' },
  GB: { name: 'United Kingdom', currencyCode: 'GBP', timezones: ['Europe/London'], fiscalYearStartMonth: 4, taxSystem: 'vat', dateFormat: 'dd/MM/yyyy', numberFormat: 'en-GB', locale: 'en-GB' },
  DE: { name: 'Germany', currencyCode: 'EUR', timezones: ['Europe/Berlin'], fiscalYearStartMonth: 1, taxSystem: 'vat', dateFormat: 'dd.MM.yyyy', numberFormat: 'de-DE', locale: 'de-DE' },
  FR: { name: 'France', currencyCode: 'EUR', timezones: ['Europe/Paris'], fiscalYearStartMonth: 1, taxSystem: 'vat', dateFormat: 'dd/MM/yyyy', numberFormat: 'fr-FR', locale: 'fr-FR' },
  JP: { name: 'Japan', currencyCode: 'JPY', timezones: ['Asia/Tokyo'], fiscalYearStartMonth: 4, taxSystem: 'consumption_tax', dateFormat: 'yyyy/MM/dd', numberFormat: 'ja-JP', locale: 'ja-JP' },
};

@Injectable()
export class CountryIntelligenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getCountries() {
    const countries = await this.prisma.country.findMany({ where: { deletedAt: null, enabled: true }, orderBy: { name: 'asc' } });
    if (countries.length) return countries;
    return Object.entries(COUNTRY_DEFAULTS).map(([code, profile]) => ({ code, name: profile.name, currencyCode: profile.currencyCode, defaultTimezone: profile.timezones[0], enabled: true }));
  }

  async getCountryProfile(countryCode: string) {
    const normalized = countryCode.toUpperCase();
    const country = await this.prisma.country.findUnique({ where: { code: normalized } });
    const profile = await this.prisma.countryProfile.findUnique({ where: { countryCode: normalized } });
    const compliance = await this.prisma.countryCompliance.findMany({ where: { countryCode: normalized, deletedAt: null }, include: { framework: true } });
    const tax = await this.prisma.countryTaxProfile.findMany({ where: { countryCode: normalized, deletedAt: null } });
    const rules = await this.prisma.countryBusinessRule.findMany({ where: { countryCode: normalized, deletedAt: null } });
    const holidays = await this.prisma.countryHoliday.findMany({ where: { countryCode: normalized, deletedAt: null }, orderBy: { observedOn: 'asc' } });
    const fallback = COUNTRY_DEFAULTS[normalized];
    if (!country && !fallback) throw new NotFoundException(`Country profile not found for ${normalized}`);
    return { country: country ?? { code: normalized, ...fallback, defaultTimezone: fallback.timezones[0], enabled: true }, profile: profile ?? fallback, compliance, tax, rules, holidays };
  }

  detectCountry(input?: { ipCountry?: string; locale?: string; timezone?: string }) {
    if (input?.ipCountry) return input.ipCountry.toUpperCase();
    const localeRegion = input?.locale?.split(/[-_]/)[1];
    if (localeRegion) return localeRegion.toUpperCase();
    if (input?.timezone?.includes('Kolkata')) return 'IN';
    if (input?.timezone?.includes('London')) return 'GB';
    if (input?.timezone?.includes('Tokyo')) return 'JP';
    return 'US';
  }
}