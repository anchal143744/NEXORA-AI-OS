import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from '../dto/global-finance.dto';
import { InvoiceIntelligenceService } from './invoice-intelligence.service';

@ApiTags('Global Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'invoices', version: '1' })
export class InvoicesController {
  constructor(private readonly invoices: InvoiceIntelligenceService) {}

  @Get() listInvoices(@Query('status') status?: string) { return this.invoices.listInvoices(status); }
  @Post() createDraft(@Body() dto: CreateInvoiceDto) { return this.invoices.createDraft(dto); }
  @Get(':id') getInvoice(@Param('id') id: string) { return this.invoices.getInvoice(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: UpdateInvoiceStatusDto) { return this.invoices.transitionInvoice(id, dto); }
  @Post(':id/issue') issue(@Param('id') id: string) { return this.invoices.issueInvoice(id); }
  @Post(':id/cancel') cancel(@Param('id') id: string) { return this.invoices.cancelInvoice(id); }
}