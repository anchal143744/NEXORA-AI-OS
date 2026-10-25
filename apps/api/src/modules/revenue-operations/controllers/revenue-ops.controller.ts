
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRevenueAccountDto, CreateRevenueEventDto } from '../dto/revenue-operations.dto';
import { RevenueAccountService } from '../revenue-account.service';
import { RevenueIntelligenceService } from '../revenue-intelligence.service';
import { RevenueOperationsService } from '../revenue-operations.service';

@ApiTags('Revenue Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'revenue-ops', version: '1' })
export class RevenueOpsController {
  constructor(private readonly revenueOps: RevenueOperationsService, private readonly accounts: RevenueAccountService, private readonly intelligence: RevenueIntelligenceService) {}
  @Get() overview() { return this.revenueOps.dashboard(); }
  @Get('dashboard') dashboard() { return this.revenueOps.dashboard(); }
  @Get('accounts') revenueAccounts(@Query('status') status?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('segment') segment?: string) { return this.accounts.accounts(status, lifecycleStage, segment); }
  @Post('accounts') createRevenueAccount(@Body() dto: CreateRevenueAccountDto) { return this.accounts.createAccount(dto); }
  @Get('events') revenueEvents(@Query('eventType') eventType?: string, @Query('severity') severity?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.intelligence.revenueEvents(eventType, severity, revenueAccountId); }
  @Post('events') createRevenueEvent(@Body() dto: CreateRevenueEventDto) { return this.intelligence.createRevenueEvent(dto); }
}
