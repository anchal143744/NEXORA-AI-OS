import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateJobRequisitionDto, CreateJobPostingDto, CreateCandidateDto, CreateCandidateProfileDto, CreateInterviewDto, CreateInterviewFeedbackDto, CreateOfferLetterDto, CreateHiringPipelineDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Recruitment ATS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'recruitment-ats', version: '1' })
export class RecruitmentAtsController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Recruitment ATS');
  }

  @Get('job-requisitions') listJobRequisition(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('jobRequisition', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('job-requisitions') createJobRequisition(@Body() dto: CreateJobRequisitionDto) {
    return this.commands.create('jobRequisition', dto);
  }

  @Get('job-postings') listJobPosting(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('jobPosting', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('job-postings') createJobPosting(@Body() dto: CreateJobPostingDto) {
    return this.commands.create('jobPosting', dto);
  }

  @Get('candidates') listCandidate(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('candidate', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('candidates') createCandidate(@Body() dto: CreateCandidateDto) {
    return this.commands.create('candidate', dto);
  }

  @Get('candidate-profiles') listCandidateProfile(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('candidateProfile', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('candidate-profiles') createCandidateProfile(@Body() dto: CreateCandidateProfileDto) {
    return this.commands.create('candidateProfile', dto);
  }

  @Get('interviews') listInterview(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('interview', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('interviews') createInterview(@Body() dto: CreateInterviewDto) {
    return this.commands.create('interview', dto);
  }

  @Get('interview-feedback') listInterviewFeedback(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('interviewFeedback', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('interview-feedback') createInterviewFeedback(@Body() dto: CreateInterviewFeedbackDto) {
    return this.commands.create('interviewFeedback', dto);
  }

  @Get('offer-letters') listOfferLetter(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('offerLetter', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('offer-letters') createOfferLetter(@Body() dto: CreateOfferLetterDto) {
    return this.commands.create('offerLetter', dto);
  }

  @Get('hiring-pipelines') listHiringPipeline(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('hiringPipeline', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('hiring-pipelines') createHiringPipeline(@Body() dto: CreateHiringPipelineDto) {
    return this.commands.create('hiringPipeline', dto);
  }
}

