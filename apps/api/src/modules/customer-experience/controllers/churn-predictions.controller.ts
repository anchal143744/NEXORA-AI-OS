import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiCustomerSuccessService } from '../ai-customer-success.service';
import { CustomerSuccessService } from '../customer-success.service';
import { CreateChurnPredictionDto } from '../dto/customer-experience.dto';

@ApiTags('Churn Predictions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'churn-predictions', version: '1' })
export class ChurnPredictionsController {
  constructor(private readonly success: CustomerSuccessService, private readonly ai: AiCustomerSuccessService) {}

  @Get() predictions(@Query('customerIdentityId') customerIdentityId?: string, @Query('riskBand') riskBand?: string) { return this.success.churnPredictions(customerIdentityId, riskBand); }
  @Post() createPrediction(@Body() dto: CreateChurnPredictionDto) { return this.success.createChurnPrediction(dto); }
  @Get('prevention') prevention(@Query('customerIdentityId') customerIdentityId?: string) { return this.success.churnPrevention(customerIdentityId); }
  @Get('copilot') copilot(@Query('customerIdentityId') customerIdentityId?: string) { return this.ai.churnPredictions(customerIdentityId); }
}
