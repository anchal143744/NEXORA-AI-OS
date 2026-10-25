import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDisasterRecoveryPlanDto, CreateDisasterRecoveryExerciseDto, CreateFailoverValidationDto } from '../dto/production-readiness.dto';
import { ProductionReadinessAnalyticsService } from '../production-readiness-analytics.service';
import { ProductionReadinessCommandService } from '../production-readiness-command.service';
import { ProductionReadinessQueryService } from '../production-readiness-query.service';

@ApiTags('Disaster Recovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'disaster-recovery', version: '1' })
export class DisasterRecoveryController {
  constructor(private readonly commands: ProductionReadinessCommandService, private readonly queries: ProductionReadinessQueryService, private readonly analytics: ProductionReadinessAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Disaster Recovery');
  }

  @Get('plans') listDisasterRecoveryPlan(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('disasterRecoveryPlan', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('plans') createDisasterRecoveryPlan(@Body() dto: CreateDisasterRecoveryPlanDto) {
    return this.commands.create('disasterRecoveryPlan', dto);
  }

  @Get('exercises') listDisasterRecoveryExercise(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('disasterRecoveryExercise', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('exercises') createDisasterRecoveryExercise(@Body() dto: CreateDisasterRecoveryExerciseDto) {
    return this.commands.create('disasterRecoveryExercise', dto);
  }

  @Get('failover-validations') listFailoverValidation(@Query('status') status?: string, @Query('environment') environment?: string, @Query('releaseVersion') releaseVersion?: string, @Query('validationStatus') validationStatus?: string, @Query('approvalStatus') approvalStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('severity') severity?: string, @Query('isBlocking') isBlocking?: string) {
    return this.queries.list('failoverValidation', { status, environment, releaseVersion, validationStatus, approvalStatus, riskLevel, severity, isBlocking });
  }

  @Post('failover-validations') createFailoverValidation(@Body() dto: CreateFailoverValidationDto) {
    return this.commands.create('failoverValidation', dto);
  }
}
