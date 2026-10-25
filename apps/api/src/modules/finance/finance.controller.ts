import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { CreateExpenseDto, CreateFinanceInvoiceDto, UpdateExpenseDto, UpdateInvoiceDto } from './dto/finance.dto';
import { FinanceService } from './finance.service';
import { PaymentsService } from '../retail/payments.service';
import { RecordPaymentDto, RefundPaymentDto, SettleInvoiceDto } from '../retail/retail.dto';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'finance', version: '1' })
export class FinanceController {
  constructor(private readonly finance: FinanceService, private readonly payments: PaymentsService) {}

  @Get('invoices/:id/payments')
  listPayments(@Param('id', ParseUUIDPipe) id: string) { return this.payments.list(id); }

  @Post('invoices/:id/payments')
  recordPayment(@Param('id', ParseUUIDPipe) id: string, @Body() dto: RecordPaymentDto) { return this.payments.record(id, dto); }

  @Post('invoices/:id/refunds')
  refundPayment(@Param('id', ParseUUIDPipe) id: string, @Body() dto: RefundPaymentDto) { return this.payments.refund(id, dto); }

  @RequirePermissions('read')
  @Get('workspace')
  workspace() {
    return this.finance.workspace();
  }

  @RequirePermissions('execute')
  @Post('ai-finance-copilot')
  runFinanceCommand(@Body() dto: { command: string }) {
    return this.finance.runFinanceCommand(dto);
  }

  @RequirePermissions('read')
  @Get('invoices')
  listInvoices() {
    return this.finance.listInvoices();
  }

  @RequirePermissions('create')
  @Post('invoices')
  createInvoice(@Body() dto: CreateFinanceInvoiceDto) {
    return this.finance.createInvoice(dto);
  }

  @RequirePermissions('update')
  @Patch('invoices/:id')
  updateInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.finance.updateInvoice(id, dto);
  }

  @RequirePermissions('update')
  @Post('invoices/:id/mark-paid')
  markInvoicePaid(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SettleInvoiceDto) {
    return this.finance.markInvoicePaid(id, dto.idempotencyKey);
  }

  @RequirePermissions('read')
  @Get('invoices/:id/status')
  invoiceStatus(@Param('id') id: string) {
    return this.finance.invoiceStatus(id);
  }

  @RequirePermissions('read')
  @Get('expenses')
  listExpenses() {
    return this.finance.listExpenses();
  }

  @RequirePermissions('create')
  @Post('expenses')
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.finance.createExpense(dto);
  }

  @RequirePermissions('update')
  @Patch('expenses/:id')
  updateExpense(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.finance.updateExpense(id, dto);
  }

  @RequirePermissions('approve')
  @Post('expenses/:id/approve')
  approveExpense(@Param('id') id: string) {
    return this.finance.approveExpense(id);
  }

  @RequirePermissions('read')
  @Get('revenue/summary')
  revenueSummary(@Query('currency') currency?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.finance.revenueSummary(currency, from, to);
  }
}
