import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePartnerAccountDto, CreatePartnerCommissionDto, CreatePartnerWorkspaceDto } from '../dto/customer-portal.dto';
import { ExternalPortalService } from '../external-portal.service';
import { PartnerPortalService } from '../partner-portal.service';

@ApiTags('Partner Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'partner-portal', version: '1' })
export class PartnerPortalController {
  constructor(private readonly partners: PartnerPortalService, private readonly external: ExternalPortalService) {}
  @Get('dashboard') dashboard() { return this.external.partnerPortal(); }
  @Get('accounts') accounts(@Query('status') status?: string, @Query('partnerType') partnerType?: string, @Query('tier') tier?: string) { return this.partners.accounts(status, partnerType, tier); }
  @Post('accounts') createAccount(@Body() dto: CreatePartnerAccountDto) { return this.partners.createAccount(dto); }
  @Get('workspaces') workspaces(@Query('partnerAccountId') partnerAccountId?: string, @Query('status') status?: string, @Query('portalRole') portalRole?: string) { return this.partners.workspaces(partnerAccountId, status, portalRole); }
  @Post('workspaces') createWorkspace(@Body() dto: CreatePartnerWorkspaceDto) { return this.partners.createWorkspace(dto); }
  @Get('commissions') commissions(@Query('partnerAccountId') partnerAccountId?: string, @Query('status') status?: string, @Query('sourceType') sourceType?: string) { return this.partners.commissions(partnerAccountId, status, sourceType); }
  @Post('commissions') createCommission(@Body() dto: CreatePartnerCommissionDto) { return this.partners.createCommission(dto); }
}
