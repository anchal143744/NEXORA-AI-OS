import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePredictionModelDto, GeneratePredictionResultDto } from '../dto/strategic-forecasting.dto';
import { PredictionService } from '../prediction.service';

@ApiTags('Predictions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'predictions', version: '1' })
export class PredictionsController {
  constructor(private readonly predictions: PredictionService) {}

  @Get('models') models(@Query('predictionType') predictionType?: string, @Query('status') status?: string) { return this.predictions.models(predictionType, status); }
  @Post('models') createModel(@Body() dto: CreatePredictionModelDto) { return this.predictions.createModel(dto); }
  @Get('results') results(@Query('predictionModelId') predictionModelId?: string, @Query('predictionType') predictionType?: string, @Query('band') band?: string) { return this.predictions.results(predictionModelId, predictionType, band); }
  @Post('results') generateResult(@Body() dto: GeneratePredictionResultDto) { return this.predictions.generateResult(dto); }
  @Get('churn') churn() { return this.predictions.byType('churn'); }
  @Get('risks') risks() { return this.predictions.byType('risk'); }
  @Get('growth') growth() { return this.predictions.byType('growth'); }
  @Get('customer-lifetime-value') customerLifetimeValue() { return this.predictions.byType('customer_lifetime_value'); }
  @Get('opportunities') opportunities() { return this.predictions.byType('opportunity'); }
}