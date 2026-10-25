import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProductionReadinessScoreDto, CreateProductionRiskRegisterDto, CreateHardeningAuditEventDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Production Readiness Scoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'production-readiness-scoring', version: '1' })
export class ProductionReadinessScoringController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Production Readiness Scoring');
  }

  @Get('scores') listProductionReadinessScore(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('productionReadinessScore', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('scores') createProductionReadinessScore(@Body() dto: CreateProductionReadinessScoreDto) {
    return this.commands.create('productionReadinessScore', dto);
  }

  @Get('risk-register') listProductionRiskRegister(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('productionRiskRegister', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('risk-register') createProductionRiskRegister(@Body() dto: CreateProductionRiskRegisterDto) {
    return this.commands.create('productionRiskRegister', dto);
  }

  @Get('audit-events') listHardeningAuditEvent(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('hardeningAuditEvent', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('audit-events') createHardeningAuditEvent(@Body() dto: CreateHardeningAuditEventDto) {
    return this.commands.create('hardeningAuditEvent', dto);
  }
}
