import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RecordJourneyStepDto, StartUserJourneyDto } from '../dto/product-intelligence.dto';
import { JourneyAnalyticsService } from '../journey-analytics.service';

@ApiTags('Product Journeys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'journeys', version: '1' })
export class JourneysController {
  constructor(private readonly journeys: JourneyAnalyticsService) {}

  @Get() list(@Query('journeyType') journeyType?: string, @Query('status') status?: string) { return this.journeys.journeys(journeyType, status); }
  @Post() start(@Body() dto: StartUserJourneyDto) { return this.journeys.startJourney(dto); }
  @Get(':id') get(@Param('id') id: string) { return this.journeys.getJourney(id); }
  @Post(':id/complete') complete(@Param('id') id: string) { return this.journeys.completeJourney(id); }
  @Get(':id/steps') steps(@Param('id') id: string) { return this.journeys.steps(id); }
  @Post(':id/steps') recordForJourney(@Param('id') id: string, @Body() dto: RecordJourneyStepDto) { return this.journeys.recordStep({ ...dto, journeyId: id }); }
  @Post('steps') recordStep(@Body() dto: RecordJourneyStepDto) { return this.journeys.recordStep(dto); }
}
