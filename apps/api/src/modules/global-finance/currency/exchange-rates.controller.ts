import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ConvertCurrencyDto, CreateExchangeRateDto } from '../dto/global-finance.dto';
import { ExchangeRateService } from './exchange-rate.service';

@ApiTags('Exchange Rates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'exchange-rates', version: '1' })
export class ExchangeRatesController {
  constructor(private readonly rates: ExchangeRateService) {}

  @Get() listRates(@Query('baseCurrencyCode') base?: string, @Query('quoteCurrencyCode') quote?: string) { return this.rates.listRates(base, quote); }
  @Post() createRate(@Body() dto: CreateExchangeRateDto) { return this.rates.createRate(dto); }
  @Get('latest') latest(@Query('from') from: string, @Query('to') to: string) { return this.rates.latestRate(from, to); }
  @Post('convert') convert(@Body() dto: ConvertCurrencyDto) { return this.rates.convert(dto); }
}