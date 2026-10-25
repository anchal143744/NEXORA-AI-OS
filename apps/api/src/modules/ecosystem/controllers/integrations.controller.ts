import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateExternalIntegrationDto } from '../dto/ecosystem.dto';
import { EcosystemCatalogService } from '../ecosystem-catalog.service';
import { EcosystemService } from '../ecosystem.service';

@ApiTags('Integration Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'integrations', version: '1' })
export class IntegrationsController {
  constructor(private readonly catalog: EcosystemCatalogService, private readonly center: EcosystemService) {}
  @Get('catalog') catalogView() { return this.center.integrationCatalog(); }
  @Get() integrations(@Query('provider') provider?: string, @Query('category') category?: string, @Query('status') status?: string) { return this.catalog.integrations(provider, category, status); }
  @Post() create(@Body() dto: CreateExternalIntegrationDto) { return this.catalog.createIntegration(dto); }
}
