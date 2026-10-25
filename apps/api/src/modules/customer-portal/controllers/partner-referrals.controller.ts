import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePartnerReferralDto } from '../dto/customer-portal.dto';
import { PartnerPortalService } from '../partner-portal.service';

@ApiTags('Partner Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'partner-referrals', version: '1' })
export class PartnerReferralsController {
  constructor(private readonly partners: PartnerPortalService) {}
  @Get() referrals(@Query('partnerAccountId') partnerAccountId?: string, @Query('status') status?: string, @Query('customerAccountId') customerAccountId?: string) { return this.partners.referrals(partnerAccountId, status, customerAccountId); }
  @Post() createReferral(@Body() dto: CreatePartnerReferralDto) { return this.partners.createReferral(dto); }
}
