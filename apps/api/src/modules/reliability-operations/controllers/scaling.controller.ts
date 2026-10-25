import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateScalingEventDto, CreateScalingPolicyDto } from '../dto/reliability-operations.dto';
import { ScalingOperationsService } from '../scaling-operations.service';

@ApiTags('Scaling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'scaling', version: '1' })
export class ScalingController {
  constructor(private readonly scaling: ScalingOperationsService) {}

  @Get('operations') operations() { return this.scaling.operations(); }
  @Get('policies') policies(@Query('serviceName') serviceName?: string, @Query('status') status?: string, @Query('region') region?: string) { return this.scaling.policies(serviceName, status, region); }
  @Post('policies') createPolicy(@Body() dto: CreateScalingPolicyDto) { return this.scaling.createPolicy(dto); }
  @Get('events') events(@Query('serviceName') serviceName?: string, @Query('status') status?: string, @Query('region') region?: string) { return this.scaling.scalingEvents(serviceName, status, region); }
  @Post('events') createEvent(@Body() dto: CreateScalingEventDto) { return this.scaling.createScalingEvent(dto); }
}