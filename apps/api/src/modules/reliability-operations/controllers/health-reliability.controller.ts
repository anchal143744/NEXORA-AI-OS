import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReliabilityOperationsService } from '../reliability-operations.service';

@ApiTags('Health Reliability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'health', version: '1' })
export class HealthReliabilityController {
  constructor(private readonly reliability: ReliabilityOperationsService) {}

  @Get('reliability') reliabilityHealth() { return this.reliability.dashboard(); }
  @Get('global') globalHealth() { return this.reliability.globalHealth(); }
  @Get('sre') sreHealth() { return this.reliability.intelligence(); }
}