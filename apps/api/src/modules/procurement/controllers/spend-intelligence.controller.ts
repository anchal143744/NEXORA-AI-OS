
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSpendInsightDto, CreateSpendTransactionDto } from '../dto/procurement.dto';
import { SpendIntelligenceService } from '../spend-intelligence.service';

@ApiTags('Spend Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'spend-intelligence', version: '1' })
export class SpendIntelligenceController {
  constructor(private readonly spend: SpendIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.spend.spendDashboard(); }
  @Get('transactions') transactions(@Query('status') status?: string, @Query('spendType') spendType?: string, @Query('vendorId') vendorId?: string) { return this.spend.transactions(status, spendType, vendorId); }
  @Post('transactions') createTransaction(@Body() dto: CreateSpendTransactionDto) { return this.spend.createTransaction(dto); }
  @Get('insights') insights(@Query('severity') severity?: string, @Query('status') status?: string, @Query('insightType') insightType?: string) { return this.spend.insights(severity, status, insightType); }
  @Post('insights') createInsight(@Body() dto: CreateSpendInsightDto) { return this.spend.createInsight(dto); }
}
