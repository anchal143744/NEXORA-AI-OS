import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrencyEngineService } from './currency-engine.service';
import { UpsertCurrencyDto } from '../dto/global-finance.dto';

@ApiTags('Currencies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'currencies', version: '1' })
export class CurrenciesController {
  constructor(private readonly currencies: CurrencyEngineService) {}

  @Get() listCurrencies() { return this.currencies.listCurrencies(); }
  @Post() upsertCurrency(@Body() dto: UpsertCurrencyDto) { return this.currencies.upsertCurrency(dto); }
  @Post('bootstrap') bootstrapSupportedCurrencies() { return this.currencies.ensureSupportedCurrencies(); }
  @Get('format') formatAmount(@Query('currency') currency: string, @Query('amount') amount: string, @Query('locale') locale?: string) { return this.currencies.formatAmount(currency, Number(amount), locale); }
}