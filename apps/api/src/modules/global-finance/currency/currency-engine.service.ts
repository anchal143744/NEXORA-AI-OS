import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { SUPPORTED_CURRENCIES, UpsertCurrencyDto } from '../dto/global-finance.dto';

const DEFAULT_CURRENCIES: Record<string, { name: string; symbol: string; precision: number; locale: string }> = {
  USD: { name: 'United States Dollar', symbol: '$', precision: 2, locale: 'en-US' },
  EUR: { name: 'Euro', symbol: '€', precision: 2, locale: 'de-DE' },
  GBP: { name: 'British Pound Sterling', symbol: '£', precision: 2, locale: 'en-GB' },
  INR: { name: 'Indian Rupee', symbol: '₹', precision: 2, locale: 'en-IN' },
  AED: { name: 'United Arab Emirates Dirham', symbol: 'د.إ', precision: 2, locale: 'ar-AE' },
  CAD: { name: 'Canadian Dollar', symbol: '$', precision: 2, locale: 'en-CA' },
  AUD: { name: 'Australian Dollar', symbol: '$', precision: 2, locale: 'en-AU' },
  JPY: { name: 'Japanese Yen', symbol: '¥', precision: 0, locale: 'ja-JP' },
  SGD: { name: 'Singapore Dollar', symbol: '$', precision: 2, locale: 'en-SG' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', precision: 2, locale: 'de-CH' },
};

@Injectable()
export class CurrencyEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async listCurrencies() {
    const rows = await this.prisma.currency.findMany({ where: { deletedAt: null, enabled: true }, orderBy: { code: 'asc' } });
    if (rows.length) return rows;
    return SUPPORTED_CURRENCIES.map((code) => ({ code, ...DEFAULT_CURRENCIES[code], enabled: true }));
  }

  async upsertCurrency(dto: UpsertCurrencyDto) {
    return this.prisma.currency.upsert({
      where: { code: dto.code },
      update: { name: dto.name, symbol: dto.symbol, precision: dto.precision ?? 2, roundingMode: dto.roundingMode ?? 'HALF_UP', symbolPosition: dto.symbolPosition ?? 'before', thousandsSeparator: dto.thousandsSeparator ?? ',', decimalSeparator: dto.decimalSeparator ?? '.', enabled: dto.enabled ?? true, metadata: dto.metadata ?? {} },
      create: { code: dto.code, name: dto.name, symbol: dto.symbol, precision: dto.precision ?? 2, roundingMode: dto.roundingMode ?? 'HALF_UP', symbolPosition: dto.symbolPosition ?? 'before', thousandsSeparator: dto.thousandsSeparator ?? ',', decimalSeparator: dto.decimalSeparator ?? '.', enabled: dto.enabled ?? true, metadata: dto.metadata ?? {} },
    });
  }

  async ensureSupportedCurrencies() {
    const results = [];
    for (const code of SUPPORTED_CURRENCIES) {
      const seed = DEFAULT_CURRENCIES[code];
      results.push(await this.upsertCurrency({ code, name: seed.name, symbol: seed.symbol, precision: seed.precision }));
    }
    return results;
  }

  async formatAmount(currencyCode: string, amount: number, locale?: string) {
    const currency = await this.prisma.currency.findUnique({ where: { code: currencyCode } });
    const fallback = DEFAULT_CURRENCIES[currencyCode] ?? DEFAULT_CURRENCIES.USD;
    const precision = currency?.precision ?? fallback.precision;
    return {
      currencyCode,
      amount,
      formatted: new Intl.NumberFormat(locale ?? fallback.locale, { style: 'currency', currency: currencyCode, minimumFractionDigits: precision, maximumFractionDigits: precision }).format(amount),
      precision,
      symbol: currency?.symbol ?? fallback.symbol,
      rules: currency ?? fallback,
    };
  }

  resolveCurrencyContext(input: { baseCurrency?: string; businessCurrency?: string; workspaceCurrency?: string; customerCurrency?: string; supplierCurrency?: string }) {
    return {
      baseCurrency: input.baseCurrency ?? input.businessCurrency ?? 'USD',
      businessCurrency: input.businessCurrency ?? input.baseCurrency ?? 'USD',
      workspaceCurrency: input.workspaceCurrency ?? input.businessCurrency ?? input.baseCurrency ?? 'USD',
      customerCurrency: input.customerCurrency ?? input.workspaceCurrency ?? input.businessCurrency ?? input.baseCurrency ?? 'USD',
      supplierCurrency: input.supplierCurrency ?? input.workspaceCurrency ?? input.businessCurrency ?? input.baseCurrency ?? 'USD',
    };
  }
}