import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataResidencyService } from '../data-residency.service';
import { CreateDataTransferRuleDto, CreateSovereigntyRuleDto } from '../dto/data-residency.dto';
import { ResidencyPolicyService } from '../residency-policy.service';

@ApiTags('Data Sovereignty')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-sovereignty', version: '1' })
export class DataSovereigntyController {
  constructor(private readonly center: DataResidencyService, private readonly residency: ResidencyPolicyService) {}

  @Get('dashboard') dashboard() { return this.center.sovereigntyCenter(); }
  @Get('rules') rules(@Query('countryCode') countryCode?: string, @Query('jurisdiction') jurisdiction?: string, @Query('status') status?: string) { return this.residency.sovereigntyRules(countryCode, jurisdiction, status); }
  @Post('rules') createRule(@Body() dto: CreateSovereigntyRuleDto) { return this.residency.createSovereigntyRule(dto); }
  @Get('transfer-rules') transferRules(@Query('transferType') transferType?: string, @Query('status') status?: string, @Query('allowed') allowed?: string) { return this.residency.transferRules(transferType, status, allowed === undefined ? undefined : allowed === 'true'); }
  @Post('transfer-rules') createTransferRule(@Body() dto: CreateDataTransferRuleDto) { return this.residency.createTransferRule(dto); }
}