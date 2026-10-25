import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataRegionService } from '../data-region.service';
import { CreateJurisdictionRuleDto } from '../dto/data-residency.dto';

@ApiTags('Jurisdictions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'jurisdictions', version: '1' })
export class JurisdictionsController {
  constructor(private readonly regions: DataRegionService) {}

  @Get('manager') manager() { return this.regions.dashboard(); }
  @Get('rules') rules(@Query('jurisdiction') jurisdiction?: string, @Query('countryCode') countryCode?: string, @Query('status') status?: string) { return this.regions.jurisdictionRules(jurisdiction, countryCode, status); }
  @Post('rules') createRule(@Body() dto: CreateJurisdictionRuleDto) { return this.regions.createJurisdictionRule(dto); }
  @Get('regions') regionsList(@Query('countryCode') countryCode?: string, @Query('jurisdiction') jurisdiction?: string, @Query('status') status?: string) { return this.regions.regions(countryCode, jurisdiction, status); }
}