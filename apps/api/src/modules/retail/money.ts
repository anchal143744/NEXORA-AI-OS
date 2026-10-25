import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Wider intermediate precision than the persisted Decimal(18,4) columns.
export const Decimal = Prisma.Decimal.clone({ precision: 40, rounding: Prisma.Decimal.ROUND_HALF_UP });
export type Amount = Prisma.Decimal;
export function decimal(value: string | number | Prisma.Decimal): Amount {
  let result: Amount;
  try { result = new Decimal(value); } catch { throw new BadRequestException('A valid decimal value is required'); }
  if (!result.isFinite()) throw new BadRequestException('A finite decimal value is required');
  return result;
}
export function quantity(value: string | number | Prisma.Decimal, allowNegative = false): Amount {
  const result = decimal(value);
  if (result.isZero() || (!allowNegative && result.isNegative()) || result.decimalPlaces() > 4 || result.abs().gte('100000000000000')) {
    throw new BadRequestException('Quantity must be nonzero with at most four decimal places');
  }
  return result;
}
export function money(value: string | number | Prisma.Decimal, precision: number, positive = false): Amount {
  if (!Number.isInteger(precision) || precision < 0 || precision > 4) throw new BadRequestException('Unsupported currency precision');
  const result = decimal(value);
  if (result.isNegative() || (positive && result.isZero()) || result.decimalPlaces() > precision || result.gte('100000000000000')) {
    throw new BadRequestException(`Amount must be nonnegative with at most ${precision} decimal places`);
  }
  return result;
}
export function round(value: Amount, precision: number): Amount { return value.toDecimalPlaces(precision, Decimal.ROUND_HALF_UP); }
export function total(values: Array<string | number | Prisma.Decimal>): Amount { return values.reduce<Amount>((sum, value) => sum.plus(decimal(value)), decimal(0)); }
export function reconcile(totalAmount: Amount, paid: Amount, dueAt: Date | null, now: Date) {
  if (paid.lt(0) || paid.gt(totalAmount)) throw new BadRequestException('Payment balance is outside invoice total');
  const amountDue = totalAmount.minus(paid);
  const status = amountDue.isZero() ? 'PAID' : paid.gt(0) ? 'PARTIALLY_PAID' : dueAt && dueAt < now ? 'OVERDUE' : 'ISSUED';
  return { amountPaid: paid, amountDue, status };
}
