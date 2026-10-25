import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateMarketplaceAppDto, CreateMarketplacePermissionDto, CreateMarketplaceVersionDto, InstallMarketplaceAppDto } from '../dto/marketplace.dto';
import { MarketplaceService } from './marketplace.service';

@ApiTags('Marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'marketplace', version: '1' })
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @Get('catalog') catalog(@Query('category') category?: string, @Query('status') status?: string) { return this.marketplace.catalog(category, status); }
  @Post('apps') createApp(@Body() dto: CreateMarketplaceAppDto) { return this.marketplace.createApp(dto); }
  @Get('apps/:id') app(@Param('id') id: string) { return this.marketplace.app(id); }
  @Post('apps/:id/versions') createVersion(@Param('id') id: string, @Body() dto: CreateMarketplaceVersionDto) { return this.marketplace.createVersion(id, dto); }
  @Post('apps/:id/permissions') createPermission(@Param('id') id: string, @Body() dto: CreateMarketplacePermissionDto) { return this.marketplace.createPermission(id, dto); }
  @Get('installations') installations(@Query('status') status?: string) { return this.marketplace.installations(status); }
  @Post('apps/:id/install') install(@Param('id') id: string, @Body() dto: InstallMarketplaceAppDto) { return this.marketplace.installApp(id, dto); }
  @Post('installations/:id/uninstall') uninstall(@Param('id') id: string) { return this.marketplace.uninstall(id); }
}