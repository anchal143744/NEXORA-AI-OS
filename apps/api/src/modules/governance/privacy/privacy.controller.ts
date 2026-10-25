import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CompletePrivacyRequestDto, CreatePrivacyRequestDto, UpsertConsentDto } from '../dto/governance.dto';
import { PrivacyAutomationService } from './privacy.service';

@ApiTags('Privacy Automation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'privacy', version: '1' })
export class PrivacyController {
  constructor(private readonly privacy: PrivacyAutomationService) {}

  @Get('workflows') workflows() { return this.privacy.workflows(); }
  @Get('consents') consents(@Query('subjectType') subjectType?: string, @Query('status') status?: string) { return this.privacy.consents(subjectType, status); }
  @Post('consents') upsertConsent(@Body() dto: UpsertConsentDto) { return this.privacy.upsertConsent(dto); }
  @Get('requests') requests(@Query('type') type?: string, @Query('status') status?: string) { return this.privacy.requests(type, status); }
  @Post('requests') createRequest(@Body() dto: CreatePrivacyRequestDto) { return this.privacy.createRequest(dto); }
  @Post('requests/:id/run-workflow') runWorkflow(@Param('id') id: string) { return this.privacy.runWorkflow(id); }
  @Post('requests/:id/complete') completeRequest(@Param('id') id: string, @Body() dto: CompletePrivacyRequestDto) { return this.privacy.completeRequest(id, dto); }
  @Get('requests/:id/access-package') accessPackage(@Param('id') id: string) { return this.privacy.accessPackage(id); }
  @Get('requests/:id/deletion-plan') deletionPlan(@Param('id') id: string) { return this.privacy.deletionPlan(id); }
}