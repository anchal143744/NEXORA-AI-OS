import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCourseDto, CreateLearningPathDto, CreateEnrollmentDto, CreateAssessmentDto, CreateCertificationDto, CreateSkillDevelopmentPlanDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Learning Management System')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'learning-management', version: '1' })
export class LearningManagementController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Learning Management System');
  }

  @Get('courses') listCourse(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('course', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('courses') createCourse(@Body() dto: CreateCourseDto) {
    return this.commands.create('course', dto);
  }

  @Get('learning-paths') listLearningPath(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('learningPath', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('learning-paths') createLearningPath(@Body() dto: CreateLearningPathDto) {
    return this.commands.create('learningPath', dto);
  }

  @Get('enrollments') listEnrollment(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('enrollment', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('enrollments') createEnrollment(@Body() dto: CreateEnrollmentDto) {
    return this.commands.create('enrollment', dto);
  }

  @Get('assessments') listAssessment(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('assessment', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('assessments') createAssessment(@Body() dto: CreateAssessmentDto) {
    return this.commands.create('assessment', dto);
  }

  @Get('certifications') listCertification(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('certification', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('certifications') createCertification(@Body() dto: CreateCertificationDto) {
    return this.commands.create('certification', dto);
  }

  @Get('skill-development-plans') listSkillDevelopmentPlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('skillDevelopmentPlan', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('skill-development-plans') createSkillDevelopmentPlan(@Body() dto: CreateSkillDevelopmentPlanDto) {
    return this.commands.create('skillDevelopmentPlan', dto);
  }
}

