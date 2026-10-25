import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { ConvertCurrencyDto, CreateExchangeRateDto } from '../dto/global-finance.dto';

@Injectable()
export class ExchangeRateService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private tenantId() { return this.context.currentTenantId(); }

  async listRates(baseCurrencyCode?: string, quoteCurrencyCode?: string) {
    const where: any = { deletedAt: null };
    if (baseCurrencyCode) where.baseCurrencyCode = baseCurrencyCode;
    if (quoteCurrencyCode) where.quoteCurrencyCode = quoteCurrencyCode;
    return this.prisma.exchangeRate.findMany({ where, orderBy: [{ rateDate: 'desc' }, { createdAt: 'desc' }], take: 200 });
  }

  async createRate(dto: CreateExchangeRateDto) {
    const tenantId = this.tenantId();
    const rateDate = dto.rateDate ? new Date(dto.rateDate) : new Date();
    await this.prisma.exchangeRate.updateMany({ where: { tenantId, baseCurrencyCode: dto.baseCurrencyCode, quoteCurrencyCode: dto.quoteCurrencyCode, isLatest: true }, data: { isLatest: false, validTo: rateDate } });
    return this.prisma.exchangeRate.create({ data: { tenantId, baseCurrencyCode: dto.baseCurrencyCode, quoteCurrencyCode: dto.quoteCurrencyCode, rate: dto.rate, inverseRate: dto.rate ? 1 / dto.rate : undefined, source: dto.source ?? 'manual', providerReference: dto.providerReference, rateDate, validFrom: rateDate, isLatest: true, metadata: dto.metadata ?? {} } });
  }

  async latestRate(fromCurrency: string, toCurrency: string) {
    if (fromCurrency === toCurrency) return { baseCurrencyCode: fromCurrency, quoteCurrencyCode: toCurrency, rate: 1, isIdentity: true };
    const tenantId = this.tenantId();
    const direct = await this.prisma.exchangeRate.findFirst({ where: { tenantId, baseCurrencyCode: fromCurrency, quoteCurrencyCode: toCurrency, deletedAt: null }, orderBy: [{ isLatest: 'desc' }, { rateDate: 'desc' }] });
    if (direct) return direct;
    const reverse = await this.prisma.exchangeRate.findFirst({ where: { tenantId, baseCurrencyCode: toCurrency, quoteCurrencyCode: fromCurrency, deletedAt: null }, orderBy: [{ isLatest: 'desc' }, { rateDate: 'desc' }] });
    if (reverse) return { ...reverse, baseCurrencyCode: fromCurrency, quoteCurrencyCode: toCurrency, rate: Number(reverse.inverseRate ?? 1 / Number(reverse.rate)), derivedFrom: reverse.id };
    throw new NotFoundException(`Exchange rate not found for ${fromCurrency}/${toCurrency}`);
  }

  async convert(dto: ConvertCurrencyDto) {
    const rate = await this.latestRate(dto.fromCurrency, dto.toCurrency);
    const value = Number(rate.rate);
    return { fromCurrency: dto.fromCurrency, toCurrency: dto.toCurrency, amount: dto.amount, rate: value, convertedAmount: Number((dto.amount * value).toFixed(6)), rateDate: rate.rateDate, source: rate.source ?? 'identity' };
  }
}