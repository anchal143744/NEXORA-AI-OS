import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DeveloperPortalService } from '../developer-portal.service';
import { CreateDeveloperAccountDto, CreateDeveloperApplicationDto } from '../dto/ecosystem.dto';
import { EcosystemService } from '../ecosystem.service';

@ApiTags('Developer Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'developer-portal', version: '1' })
export class DeveloperPortalController {
  constructor(private readonly portal: DeveloperPortalService, private readonly center: EcosystemService) {}
  @Get('dashboard') dashboard() { return this.center.developerPortal(); }
  @Get('accounts') accounts(@Query('accountType') accountType?: string, @Query('status') status?: string, @Query('verificationStatus') verificationStatus?: string) { return this.portal.accounts(accountType, status, verificationStatus); }
  @Post('accounts') createAccount(@Body() dto: CreateDeveloperAccountDto) { return this.portal.createAccount(dto); }
  @Get('applications') applications(@Query('appType') appType?: string, @Query('status') status?: string, @Query('approvalStatus') approvalStatus?: string) { return this.portal.applications(appType, status, approvalStatus); }
  @Post('applications') createApplication(@Body() dto: CreateDeveloperApplicationDto) { return this.portal.createApplication(dto); }
}
