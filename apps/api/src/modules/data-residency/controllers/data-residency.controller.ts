import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataResidencyService } from '../data-residency.service';
import { CreateResidencyAssignmentDto, CreateResidencyPolicyDto } from '../dto/data-residency.dto';
import { ResidencyPolicyService } from '../residency-policy.service';

@ApiTags('Data Residency')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-residency', version: '1' })
export class DataResidencyController {
  constructor(private readonly center: DataResidencyService, private readonly residency: ResidencyPolicyService) {}

  @Get('dashboard') dashboard() { return this.center.dashboard(); }
  @Get('center') residencyCenter() { return this.center.residencyCenter(); }
  @Get('policies') policies(@Query('policyType') policyType?: string, @Query('status') status?: string, @Query('enforcementMode') enforcementMode?: string) { return this.residency.policies(policyType, status, enforcementMode); }
  @Post('policies') createPolicy(@Body() dto: CreateResidencyPolicyDto) { return this.residency.createPolicy(dto); }
  @Get('assignments') assignments(@Query('subjectType') subjectType?: string, @Query('dataClass') dataClass?: string, @Query('residencyStatus') residencyStatus?: string) { return this.residency.assignments(subjectType, dataClass, residencyStatus); }
  @Post('assignments') createAssignment(@Body() dto: CreateResidencyAssignmentDto) { return this.residency.createAssignment(dto); }
}