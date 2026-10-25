import { Injectable } from '@nestjs/common';
import { CountryIntelligenceService } from '../country/country-intelligence.service';
import { FormatBusinessValueDto } from '../dto/localization.dto';

@Injectable()
export class CountryRuleEngineService {
  constructor(private readonly countries: CountryIntelligenceService) {}

  async evaluate(countryCode: string) {
    const profile = await this.countries.getCountryProfile(countryCode);
    return {
      countryCode: countryCode.toUpperCase(),
      taxSystem: profile.profile?.taxSystem ?? profile.country?.taxSystem,
      fiscalYearStartMonth: profile.profile?.fiscalYearStartMonth ?? 1,
      complianceFrameworks: profile.compliance.map((entry: any) => entry.framework?.key).filter(Boolean),
      invoice: profile.rules.filter((rule: any) => rule.ruleType === 'invoice'),
      addressFormat: profile.profile?.addressFormat ?? {},
      phoneFormat: profile.profile?.phoneFormat ?? {},
      warnings: profile.compliance.map((entry: any) => entry.requirements).filter(Boolean),
    };
  }

  async formatBusinessValue(dto: FormatBusinessValueDto) {
    const profile = await this.countries.getCountryProfile(dto.countryCode);
    const locale = profile.profile?.locale ?? profile.profile?.numberFormat ?? 'en-US';
    const currency = dto.currencyCode ?? profile.country?.currencyCode ?? profile.profile?.currencyCode ?? 'USD';
    return {
      countryCode: dto.countryCode.toUpperCase(),
      amount: dto.amount === undefined ? undefined : new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(dto.amount)),
      date: dto.dateValue ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(dto.dateValue)) : undefined,
      phone: dto.phone ? { raw: dto.phone, countryCode: dto.countryCode.toUpperCase() } : undefined,
      address: dto.address ? { raw: dto.address, countryCode: dto.countryCode.toUpperCase(), format: profile.profile?.addressFormat ?? {} } : undefined,
      taxSystem: profile.profile?.taxSystem,
      complianceWarnings: profile.compliance.map((entry: any) => entry.requirements).filter(Boolean),
    };
  }
}