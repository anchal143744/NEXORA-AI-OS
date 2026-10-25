import { Module } from '@nestjs/common';

import { TenantsModule } from '../tenants/tenants.module';

import { ComplianceService } from './compliance/compliance.service';
import { CountryIntelligenceService } from './country/country-intelligence.service';
import { LanguageService } from './languages/language.service';
import { LocalizationController } from './localization.controller';
import { LocalizationService } from './localization.service';
import { CountryRuleEngineService } from './rules/country-rule-engine.service';
import { TimezoneService } from './timezone/timezone.service';
import { TranslationService } from './translations/translation.service';

@Module({
  imports: [TenantsModule],

  controllers: [LocalizationController],

  providers: [
    LocalizationService,
    CountryIntelligenceService,
    LanguageService,
    TimezoneService,
    TranslationService,
    ComplianceService,
    CountryRuleEngineService,
  ],
})
export class LocalizationModule {}