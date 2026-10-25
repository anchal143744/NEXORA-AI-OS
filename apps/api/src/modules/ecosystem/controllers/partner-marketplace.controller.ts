import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateMarketplaceApplicationDto, CreatePartnerListingDto } from '../dto/ecosystem.dto';
import { EcosystemCatalogService } from '../ecosystem-catalog.service';
import { EcosystemService } from '../ecosystem.service';

@ApiTags('Partner Marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'partner-marketplace', version: '1' })
export class PartnerMarketplaceController {
  constructor(private readonly catalog: EcosystemCatalogService, private readonly center: EcosystemService) {}
  @Get('dashboard') dashboard() { return this.center.partnerMarketplace(); }
  @Get('partners') partners(@Query('partnerType') partnerType?: string, @Query('status') status?: string, @Query('certificationLevel') certificationLevel?: string) { return this.catalog.partnerListings(partnerType, status, certificationLevel); }
  @Post('partners') createPartner(@Body() dto: CreatePartnerListingDto) { return this.catalog.createPartnerListing(dto); }
  @Get('applications') applications(@Query('category') category?: string, @Query('status') status?: string, @Query('pricingModel') pricingModel?: string) { return this.catalog.marketplaceApplications(category, status, pricingModel); }
  @Post('applications') createApplication(@Body() dto: CreateMarketplaceApplicationDto) { return this.catalog.createMarketplaceApplication(dto); }
}
