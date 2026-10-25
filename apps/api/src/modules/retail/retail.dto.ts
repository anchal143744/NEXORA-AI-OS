import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsOptional, IsString, IsUUID, Matches, MaxLength, ValidateNested } from 'class-validator';
const amountPattern = /^\d+(\.\d{1,4})?$/;
export class StockCommandDto {
  @IsUUID() stockId!: string;
  @IsString() @Matches(/^-?\d+(\.\d{1,4})?$/) quantity!: string;
  @IsString() @MaxLength(120) movementKey!: string;
  @IsIn(['RECEIPT', 'ADJUSTMENT']) movementType!: 'RECEIPT' | 'ADJUSTMENT';
  @IsString() @MaxLength(500) reason!: string;
  @IsString() @Matches(/^[A-Z]{3}$/) currency!: string;
  @IsOptional() @IsString() @Matches(amountPattern) unitCost?: string;
}
export class SaleLineDto {
  @IsUUID() stockId!: string;
  @IsString() @Matches(amountPattern) quantity!: string;
  @IsString() @Matches(amountPattern) unitPrice!: string;
}
export class CreateRetailSaleDto {
  @IsOptional() @IsUUID() sourceDocumentId?:string;
  @IsOptional() @IsUUID() customerId?: string;
  @IsString() @MaxLength(120) saleKey!: string;
  @IsString() @Matches(/^[A-Z]{3}$/) currency!: string;
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(100) @ValidateNested({ each: true }) @Type(() => SaleLineDto) lines!: SaleLineDto[];
}
export class ReturnLineDto {
  @IsUUID() lineId!: string;
  @IsString() @Matches(amountPattern) quantity!: string;
}
export class ReturnRetailSaleDto {
  @IsString() @MaxLength(120) returnKey!: string;
  @IsString() @MaxLength(500) reason!: string;
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(100) @ValidateNested({ each: true }) @Type(() => ReturnLineDto) lines!: ReturnLineDto[];
}
export class CancelRetailSaleDto { @IsString() @MaxLength(500) reason!: string; }
export class RecordPaymentDto {
  @IsString() @MaxLength(120) idempotencyKey!: string;
  @IsString() @Matches(amountPattern) amount!: string;
  @IsString() @Matches(/^[A-Z]{3}$/) currency!: string;
  @IsString() @MaxLength(80) paymentMethod!: string;
  @IsOptional() @IsString() @MaxLength(200) reference?: string;
}
export class RefundPaymentDto {
  @IsString() @MaxLength(120) idempotencyKey!: string;
  @IsUUID() paymentId!: string;
  @IsString() @Matches(amountPattern) amount!: string;
  @IsString() @MaxLength(500) reason!: string;
  @IsOptional() @IsIn(['REFUND', 'REVERSAL']) entryType?: 'REFUND' | 'REVERSAL';
}
export class SettleInvoiceDto { @IsString() @MaxLength(120) idempotencyKey!: string; }
