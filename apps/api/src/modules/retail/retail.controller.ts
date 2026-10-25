import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InventoryLedgerService } from './inventory-ledger.service';
import { RetailSalesService } from './retail-sales.service';
import { RetailReportService } from './retail-report.service';
import { CancelRetailSaleDto, CreateRetailSaleDto, ReturnRetailSaleDto, StockCommandDto } from './retail.dto';

@ApiTags('Retail')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'retail', version: '1' })
export class RetailController {
  constructor(private readonly inventory: InventoryLedgerService, private readonly sales: RetailSalesService, private readonly reports: RetailReportService) {}
  @Post('stock-movements') postStock(@Body() dto: StockCommandDto) { return this.inventory.post(dto); }
  @Get('sales') listSales() { return this.sales.list(); }
  @Post('sales') createSale(@Body() dto: CreateRetailSaleDto) { return this.sales.create(dto); }
  @Post('sales/:id/complete') completeSale(@Param('id', ParseUUIDPipe) id: string) { return this.sales.complete(id); }
  @Post('sales/:id/returns') returnSale(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ReturnRetailSaleDto) { return this.sales.returnItems(id, dto); }
  @Post('sales/:id/cancel') cancelSale(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CancelRetailSaleDto) { return this.sales.cancel(id, dto.reason); }
  @Get('reports/profit-loss') profitLoss(@Query('currency') code: string, @Query('from') from: string, @Query('to') to: string) { return this.reports.summary(code, from, to); }
}
