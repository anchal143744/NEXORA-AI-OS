import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiProductService } from '../api-product.service';
import { CreatePartnerAccessDto } from '../dto/platform-governance.dto';
import { PlatformGovernanceService } from '../platform-governance.service';

@ApiTags('Partner Access')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'partner-access', version: '1' })
export class PartnerAccessController {
  constructor(private readonly center: PlatformGovernanceService, private readonly products: ApiProductService) {}

  @Get('dashboard') dashboard() { return this.center.partnerManagement(); }
  @Get() list(@Query('status') status?: string, @Query('partnerType') partnerType?: string) { return this.products.partnerAccess(status, partnerType); }
  @Post() create(@Body() dto: CreatePartnerAccessDto) { return this.products.createPartnerAccess(dto); }
  @Get('subscriptions') subscriptions(@Query('status') status?: string, @Query('subscriberType') subscriberType?: string, @Query('apiProductId') apiProductId?: string) { return this.products.subscriptions(status, subscriberType, apiProductId); }
}
