import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRetentionPolicyDto } from '../dto/governance.dto';
import { RetentionService } from './retention.service';

@ApiTags('Retention')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'retention', version: '1' })
export class RetentionController {
  constructor(private readonly retention: RetentionService) {}

  @Get('policies') policies(@Query('recordType') recordType?: string, @Query('enabled') enabled?: string) { return this.retention.policies(recordType, enabled); }
  @Post('policies') createPolicy(@Body() dto: CreateRetentionPolicyDto) { return this.retention.createPolicy(dto); }
  @Get('schedules') schedule(@Query('recordType') recordType?: string) { return this.retention.schedule(recordType); }
  @Get('evaluate') evaluate(@Query('recordType') recordType: string, @Query('recordCreatedAt') recordCreatedAt?: string) { return this.retention.evaluate(recordType, recordCreatedAt); }
}