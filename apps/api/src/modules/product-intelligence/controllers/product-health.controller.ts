import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProductHealthScoreDto } from '../dto/product-intelligence.dto';
import { ProductIntelligenceService } from '../product-intelligence.service';

@ApiTags('Product Health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'product-health', version: '1' })
export class ProductHealthController {
  constructor(private readonly product: ProductIntelligenceService) {}

  @Get('scores') scores(@Query('moduleKey') moduleKey?: string, @Query('scoreBand') scoreBand?: string) { return this.product.healthScores(moduleKey, scoreBand); }
  @Post('scores') createScore(@Body() dto: CreateProductHealthScoreDto) { return this.product.createHealthScore(dto); }
  @Get('latest') latest(@Query('moduleKey') moduleKey?: string) { return this.product.latestHealth(moduleKey); }
  @Get('risks') risks(@Query('moduleKey') moduleKey?: string) { return this.product.riskDetection(moduleKey); }
}
