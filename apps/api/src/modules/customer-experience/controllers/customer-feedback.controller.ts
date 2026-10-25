import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CustomerExperienceService } from '../customer-experience.service';
import { CreateCustomerFeedbackDto } from '../dto/customer-experience.dto';

@ApiTags('Customer Feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-feedback', version: '1' })
export class CustomerFeedbackController {
  constructor(private readonly experience: CustomerExperienceService) {}

  @Get() feedback(@Query('customerIdentityId') customerIdentityId?: string, @Query('sentiment') sentiment?: string) { return this.experience.feedback(customerIdentityId, sentiment); }
  @Post() createFeedback(@Body() dto: CreateCustomerFeedbackDto) { return this.experience.createFeedback(dto); }
  @Get('satisfaction') satisfaction(@Query('customerIdentityId') customerIdentityId?: string) { return this.experience.satisfaction(customerIdentityId); }
  @Get('risks') risks(@Query('customerIdentityId') customerIdentityId?: string) { return this.experience.riskDetection(customerIdentityId); }
}
