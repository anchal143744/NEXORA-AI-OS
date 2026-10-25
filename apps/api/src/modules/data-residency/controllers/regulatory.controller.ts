import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateComplianceRequirementDto, CreateRegulatoryFrameworkDto } from '../dto/data-residency.dto';
import { RegulatoryService } from '../regulatory.service';

@ApiTags('Regulatory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'regulatory', version: '1' })
export class RegulatoryController {
  constructor(private readonly regulatory: RegulatoryService) {}

  @Get('dashboard') dashboard() { return this.regulatory.dashboard(); }
  @Get('frameworks') frameworks(@Query('frameworkType') frameworkType?: string, @Query('countryCode') countryCode?: string, @Query('status') status?: string) { return this.regulatory.frameworks(frameworkType, countryCode, status); }
  @Post('frameworks') createFramework(@Body() dto: CreateRegulatoryFrameworkDto) { return this.regulatory.createFramework(dto); }
  @Get('requirements') requirements(@Query('frameworkId') frameworkId?: string, @Query('severity') severity?: string, @Query('status') status?: string) { return this.regulatory.requirements(frameworkId, severity, status); }
  @Post('requirements') createRequirement(@Body() dto: CreateComplianceRequirementDto) { return this.regulatory.createRequirement(dto); }
}