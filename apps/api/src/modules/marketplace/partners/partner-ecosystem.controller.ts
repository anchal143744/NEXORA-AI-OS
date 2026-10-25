import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePartnerCertificationDto, CreatePartnerProfileDto, CreatePartnerServiceListingDto } from '../dto/marketplace.dto';
import { PartnerEcosystemService } from './partner-ecosystem.service';

@ApiTags('Partner Ecosystem')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'partners', version: '1' })
export class PartnerEcosystemController {
  constructor(private readonly partners: PartnerEcosystemService) {}

  @Get() list(@Query('type') type?: string, @Query('status') status?: string) { return this.partners.partners(type, status); }
  @Post() createPartner(@Body() dto: CreatePartnerProfileDto) { return this.partners.createPartner(dto); }
  @Get('services') services(@Query('type') type?: string) { return this.partners.services(type); }
  @Get(':id/certifications') certifications(@Param('id') id: string) { return this.partners.certifications(id); }
  @Post(':id/certifications') addCertification(@Param('id') id: string, @Body() dto: CreatePartnerCertificationDto) { return this.partners.addCertification(id, dto); }
  @Post(':id/services') addService(@Param('id') id: string, @Body() dto: CreatePartnerServiceListingDto) { return this.partners.addService(id, dto); }
}