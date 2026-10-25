import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCompensationPlanDto, CreateSalaryBandDto, CreateBonusPlanDto, CreatePromotionPlanDto, CreateCompensationHistoryDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Compensation Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'compensation-intelligence', version: '1' })
export class CompensationIntelligenceController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Compensation Intelligence');
  }

  @Get('compensation-plans') listCompensationPlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('compensationPlan', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('compensation-plans') createCompensationPlan(@Body() dto: CreateCompensationPlanDto) {
    return this.commands.create('compensationPlan', dto);
  }

  @Get('salary-bands') listSalaryBand(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('salaryBand', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('salary-bands') createSalaryBand(@Body() dto: CreateSalaryBandDto) {
    return this.commands.create('salaryBand', dto);
  }

  @Get('bonus-plans') listBonusPlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('bonusPlan', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('bonus-plans') createBonusPlan(@Body() dto: CreateBonusPlanDto) {
    return this.commands.create('bonusPlan', dto);
  }

  @Get('promotion-plans') listPromotionPlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('promotionPlan', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('promotion-plans') createPromotionPlan(@Body() dto: CreatePromotionPlanDto) {
    return this.commands.create('promotionPlan', dto);
  }

  @Get('compensation-history') listCompensationHistory(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('compensationHistory', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('compensation-history') createCompensationHistory(@Body() dto: CreateCompensationHistoryDto) {
    return this.commands.create('compensationHistory', dto);
  }
}

