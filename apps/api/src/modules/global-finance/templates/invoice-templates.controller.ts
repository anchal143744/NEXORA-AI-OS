import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateInvoiceSeriesDto, CreateInvoiceTemplateDto } from '../dto/global-finance.dto';
import { InvoiceIntelligenceService } from '../invoices/invoice-intelligence.service';

@ApiTags('Invoice Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'invoice-templates', version: '1' })
export class InvoiceTemplatesController {
  constructor(private readonly invoices: InvoiceIntelligenceService) {}

  @Get() listTemplates(@Query('countryCode') countryCode?: string) { return this.invoices.listTemplates(countryCode); }
  @Post() createTemplate(@Body() dto: CreateInvoiceTemplateDto) { return this.invoices.createTemplate(dto); }
  @Get('series') listSeries(@Query('countryCode') countryCode?: string) { return this.invoices.listSeries(countryCode); }
  @Post('series') createSeries(@Body() dto: CreateInvoiceSeriesDto) { return this.invoices.createSeries(dto); }
}