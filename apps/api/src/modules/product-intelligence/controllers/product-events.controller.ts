import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TrackProductEventDto } from '../dto/product-intelligence.dto';
import { UsageAnalyticsService } from '../usage-analytics.service';

@ApiTags('Product Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'events', version: '1' })
export class ProductEventsController {
  constructor(private readonly usage: UsageAnalyticsService) {}

  @Get('product') events(@Query('eventName') eventName?: string, @Query('userId') userId?: string) { return this.usage.eventsList(eventName, userId); }
  @Post('product') trackEvent(@Body() dto: TrackProductEventDto) { return this.usage.trackEvent(dto); }
  @Post('track') track(@Body() dto: TrackProductEventDto) { return this.usage.trackEvent(dto); }
}
