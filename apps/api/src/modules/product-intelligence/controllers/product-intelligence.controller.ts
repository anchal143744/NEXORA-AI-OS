import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GrowthInsightsService } from '../growth-insights.service';
import { ProductIntelligenceService } from '../product-intelligence.service';

@ApiTags('Product Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'product-intelligence', version: '1' })
export class ProductIntelligenceController {
  constructor(private readonly product: ProductIntelligenceService, private readonly growth: GrowthInsightsService) {}

  @Get('dashboard') dashboard(@Query('productKey') productKey?: string) { return this.product.dashboard(productKey); }
  @Get('insights') insights(@Query('moduleKey') moduleKey?: string) { return this.product.insights(moduleKey); }
  @Get('risks') risks(@Query('moduleKey') moduleKey?: string) { return this.product.riskDetection(moduleKey); }
  @Get('success-metrics') successMetrics(@Query('moduleKey') moduleKey?: string) { return this.product.successMetrics(moduleKey); }
  @Get('copilot') copilot(@Query('moduleKey') moduleKey?: string) { return this.growth.productInsights(moduleKey); }
}
