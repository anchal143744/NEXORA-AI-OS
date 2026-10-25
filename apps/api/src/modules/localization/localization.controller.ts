import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ComplianceService } from './compliance/compliance.service';
import { CountryIntelligenceService } from './country/country-intelligence.service';
import { ComplianceRuleQueryDto, FormatBusinessValueDto, LocalizationSettingsDto, TimeConversionDto, TranslationQueryDto, UpsertTranslationDto } from './dto/localization.dto';
import { LanguageService } from './languages/language.service';
import { LocalizationService } from './localization.service';
import { CountryRuleEngineService } from './rules/country-rule-engine.service';
import { TimezoneService } from './timezone/timezone.service';
import { TranslationService } from './translations/translation.service';

@ApiTags('Localization & Country Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'localization', version: '1' })
export class LocalizationController {
  constructor(private readonly localization: LocalizationService, private readonly countries: CountryIntelligenceService, private readonly languages: LanguageService, private readonly timezones: TimezoneService, private readonly translations: TranslationService, private readonly compliance: ComplianceService, private readonly rules: CountryRuleEngineService) {}

  @Get('countries') getCountries() { return this.countries.getCountries(); }
  @Get('countries/profile') getCountryProfile(@Query('countryCode') countryCode: string) { return this.countries.getCountryProfile(countryCode); }
  @Get('compliance/rules') getComplianceRules(@Query() query: ComplianceRuleQueryDto) { return this.compliance.getRules(query); }
  @Get('compliance/frameworks') getComplianceFrameworks() { return this.compliance.getFrameworks(); }
  @Get('compliance/controls') getComplianceControls(@Query('frameworkKey') frameworkKey?: string) { return this.compliance.getControls(frameworkKey); }
  @Get('compliance/data-policies') getDataPolicies(@Query('countryCode') countryCode?: string) { return this.compliance.getDataPolicies(countryCode); }
  @Get('settings') getLocalizationSettings(@Query('scope') scope?: string, @Query('scopeId') scopeId?: string) { return this.localization.getSettings(scope, scopeId); }
  @Post('settings') updateLocalization(@Body() dto: LocalizationSettingsDto) { return this.localization.updateSettings(dto); }
  @Get('languages') getSupportedLanguages() { return this.languages.getSupportedLanguages(); }
  @Get('timezones') getTimezones(@Query('countryCode') countryCode?: string) { return this.timezones.getTimezones(countryCode); }
  @Post('timezones/convert') convertTime(@Body() dto: TimeConversionDto) { return this.timezones.convert(dto); }
  @Get('translations') getTranslations(@Query() query: TranslationQueryDto) { return this.translations.getTranslations(query); }
  @Post('translations') upsertTranslation(@Body() dto: UpsertTranslationDto) { return this.translations.upsertTranslation(dto); }
  @Get('rules/evaluate') evaluateCountryRules(@Query('countryCode') countryCode: string) { return this.rules.evaluate(countryCode); }
  @Post('rules/format') formatBusinessValue(@Body() dto: FormatBusinessValueDto) { return this.rules.formatBusinessValue(dto); }
}