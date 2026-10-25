import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAccessVerificationDto, CreateZeroTrustPolicyDto } from '../dto/security-intelligence.dto';
import { ZeroTrustService } from '../zero-trust.service';

@ApiTags('Zero Trust')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'zero-trust', version: '1' })
export class ZeroTrustController {
  constructor(private readonly zeroTrust: ZeroTrustService) {}

  @Get('access-layer') accessLayer() { return this.zeroTrust.accessLayer(); }
  @Get('policies') policies(@Query('policyType') policyType?: string, @Query('status') status?: string, @Query('enforcementMode') enforcementMode?: string) { return this.zeroTrust.policies(policyType, status, enforcementMode); }
  @Post('policies') createPolicy(@Body() dto: CreateZeroTrustPolicyDto) { return this.zeroTrust.createPolicy(dto); }
  @Get('verifications') verifications(@Query('decision') decision?: string, @Query('trustLevel') trustLevel?: string, @Query('resourceType') resourceType?: string) { return this.zeroTrust.verifications(decision, trustLevel, resourceType); }
  @Post('verifications') createVerification(@Body() dto: CreateAccessVerificationDto) { return this.zeroTrust.createVerification(dto); }
}