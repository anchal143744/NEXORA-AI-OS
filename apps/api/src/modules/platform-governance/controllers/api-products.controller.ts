import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiProductService } from '../api-product.service';
import { CreateApiPlanDto, CreateApiProductDto, CreateApiSubscriptionDto } from '../dto/platform-governance.dto';

@ApiTags('API Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'api-products', version: '1' })
export class ApiProductsController {
  constructor(private readonly products: ApiProductService) {}

  @Get('marketplace') marketplace() { return this.products.marketplace(); }
  @Get() list(@Query('category') category?: string, @Query('status') status?: string, @Query('visibility') visibility?: string) { return this.products.products(category, status, visibility); }
  @Post() create(@Body() dto: CreateApiProductDto) { return this.products.createProduct(dto); }
  @Get('plans') plans(@Query('apiProductId') apiProductId?: string, @Query('status') status?: string, @Query('tier') tier?: string) { return this.products.plans(apiProductId, status, tier); }
  @Post('plans') createPlan(@Body() dto: CreateApiPlanDto) { return this.products.createPlan(dto); }
  @Get('subscriptions') subscriptions(@Query('status') status?: string, @Query('subscriberType') subscriberType?: string, @Query('apiProductId') apiProductId?: string) { return this.products.subscriptions(status, subscriberType, apiProductId); }
  @Post('subscriptions') createSubscription(@Body() dto: CreateApiSubscriptionDto) { return this.products.createSubscription(dto); }
}
