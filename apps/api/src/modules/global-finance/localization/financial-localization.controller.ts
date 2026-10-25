import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpsertFinancialLocalizationDto } from '../dto/global-finance.dto';
import { FinancialLocalizationService } from './financial-localization.service';

@ApiTags('Financial Localization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'financial-localization', version: '1' })
export class FinancialLocalizationController {
  constructor(private readonly localization: FinancialLocalizationService) {}

  @Get() list(@Query('countryCode') countryCode?: string) { return this.localization.list(countryCode); }
  @Post() upsert(@Body() dto: UpsertFinancialLocalizationDto) { return this.localization.upsert(dto); }
  @Get('context') context(@Query('countryCode') countryCode: string, @Query('profileKey') profileKey?: string) { return this.localization.invoiceLocalizationContext(countryCode, profileKey); }
}