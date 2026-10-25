import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CompleteOnboardingStepDto, GenerateOnboardingWorkspaceDto, OnboardingAssistantDto, StartOnboardingDto } from '../dto/onboarding.dto';
import { CustomerOnboardingService } from './customer-onboarding.service';

@ApiTags('Customer Onboarding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-onboarding', version: '1' })
export class CustomerOnboardingController {
  constructor(private readonly onboarding: CustomerOnboardingService) {}
  @Get('industries') industries() { return this.onboarding.industries(); }
  @Get('profiles') profiles(@Query('status') status?: string) { return this.onboarding.profiles(status); }
  @Post('profiles') start(@Body() dto: StartOnboardingDto) { return this.onboarding.start(dto); }
  @Post('profiles/:id/steps') completeStep(@Param('id') id: string, @Body() dto: CompleteOnboardingStepDto) { return this.onboarding.completeStep(id, dto); }
  @Get('profiles/:id/recommendations') recommendations(@Param('id') id: string) { return this.onboarding.recommendations(id); }
  @Post('profiles/:id/generate-workspace') generateWorkspace(@Param('id') id: string, @Body() dto: GenerateOnboardingWorkspaceDto) { return this.onboarding.generateWorkspace(id, dto); }
  @Post('profiles/:id/assistant') assistant(@Param('id') id: string, @Body() dto: OnboardingAssistantDto) { return this.onboarding.assistant(id, dto); }
  @Post('profiles/:id/complete') complete(@Param('id') id: string) { return this.onboarding.complete(id); }
}
