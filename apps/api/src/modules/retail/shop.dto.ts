import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayUnique, IsArray, IsEmail, IsIn, IsInt, IsISO8601, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
import { retailModuleKeys, retailWidgetKeys } from './shop-preferences';

export class ShopQueryDto {
  @IsOptional() @IsString() @MaxLength(100) search = '';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(1000000) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 25;
}
export class ShopBusinessDetailsDto {
  @IsOptional() @IsString() @MaxLength(500) address?: string;
  @IsOptional() @IsString() @MaxLength(40) businessPhone?: string;
  @IsOptional() @IsString() @MaxLength(200) businessEmail?: string;
  @IsOptional() @IsString() @MaxLength(200) website?: string;
  @IsOptional() @IsString() @MaxLength(1000) sells?: string;
  @IsOptional() @IsString() @MaxLength(1000) buys?: string;
  @IsOptional() @IsString() @MaxLength(100) taxRegistration?: string;
  @IsOptional() @IsIn(['standard','compact','service']) invoiceStyle?: string;
  @IsOptional() @IsString() @MaxLength(1000) invoiceTerms?: string;
}
export class ShopSettingsDto extends ShopBusinessDetailsDto {
  @IsString() @MinLength(1) @MaxLength(100) name!: string;
  @IsIn(['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'KWD']) currency!: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) businessName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) category?: string;
  @IsOptional() @Matches(/^[A-Z]{2}$/) countryCode?: string;
  @IsOptional() @IsString() @MaxLength(100) timeZone?: string;
}
export class ShopBusinessSetupDto extends ShopBusinessDetailsDto {
  @IsString() @MinLength(1) @MaxLength(100) name!: string;
  @IsIn(['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'KWD']) currency!: string;
  @IsString() @MinLength(1) @MaxLength(100) businessName!: string;
  @IsString() @MinLength(1) @MaxLength(100) category!: string;
  @Matches(/^[A-Z]{2}$/) countryCode!: string;
  @IsString() @MaxLength(100) timeZone!: string;
  @IsInt() @Min(0) expectedVersion!: number;
  @IsArray() @ArrayMaxSize(6) @ArrayUnique() @IsIn(retailModuleKeys, { each: true }) modules!: string[];
  @IsArray() @ArrayMaxSize(6) @ArrayUnique() @IsIn(retailWidgetKeys, { each: true }) widgets!: string[];
}
export class ShopPreferencesDto {
  @IsInt() @Min(0) @Max(2147483646) expectedVersion!: number;
  @IsArray() @ArrayMaxSize(6) @ArrayUnique() @IsIn(retailModuleKeys, { each: true }) modules!: string[];
  @IsArray() @ArrayMaxSize(6) @ArrayUnique() @IsIn(retailWidgetKeys, { each: true }) widgets!: string[];
}
export class ShopCustomerQueryDto extends ShopQueryDto {
  @IsOptional() @IsIn(['lead', 'customer']) lifecycleStage?: 'lead' | 'customer';
}
export class ShopCustomerDto {
  @IsString() @MaxLength(120) customerKey!: string;
  @IsString() @MinLength(1) @MaxLength(120) name!: string;
  @IsOptional() @IsEmail() @MaxLength(200) email?: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(120) company?: string;
  @IsIn(['lead', 'customer']) lifecycleStage!: 'lead' | 'customer';
}
export class ShopCustomerUpdateDto {
  @IsString() @MinLength(1) @MaxLength(120) name!: string;
  @IsOptional() @IsEmail() @MaxLength(200) email?: string | null;
  @IsOptional() @IsString() @MaxLength(40) phone?: string | null;
  @IsOptional() @IsString() @MaxLength(120) company?: string | null;
  @IsIn(['lead', 'customer']) lifecycleStage!: 'lead' | 'customer';
}
export class ShopFollowUpDto {
  @IsOptional() @IsString() @MaxLength(2000) messageDraft?:string;
  @IsString() @MaxLength(120) followUpKey!: string;
  @IsUUID() customerId!: string;
  @IsString() @MinLength(1) @MaxLength(200) title!: string;
  @IsISO8601() dueAt!: string;
  @IsIn(['LOW', 'MEDIUM', 'HIGH']) priority!: 'LOW' | 'MEDIUM' | 'HIGH';
}
export class FollowUpDraftDto {
  @IsUUID() customerId!:string;
  @IsString() @MinLength(1) @MaxLength(500) goal!:string;
  @IsString() @MinLength(1) @MaxLength(40) language!:string;
}
export class ShopFollowUpUpdateDto {
  @IsIn(['TODO', 'DONE', 'CANCELED']) status!: 'TODO' | 'DONE' | 'CANCELED';
}
export class ShopProductDto {
  @IsString() @MaxLength(120) productKey!: string;
  @IsString() @MinLength(1) @MaxLength(120) name!: string;
  @IsString() @MinLength(1) @MaxLength(80) sku!: string;
  @IsString() @Matches(/^\d+(\.\d{1,4})?$/) unitPrice!: string;
  @IsString() @Matches(/^\d+(\.\d{1,4})?$/) unitCost!: string;
  @IsString() @Matches(/^\d+(\.\d{1,4})?$/) openingQuantity!: string;
  @IsString() @Matches(/^\d+(\.\d{1,4})?$/) reorderPoint!: string;
}
export class ShopExpenseDto {
  @IsString() @MaxLength(120) expenseKey!: string;
  @IsString() @MinLength(1) @MaxLength(100) category!: string;
  @IsString() @MinLength(1) @MaxLength(120) vendor!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsString() @Matches(/^\d+(\.\d{1,4})?$/) amount!: string;
  @IsISO8601() incurredAt!: string;
}
export class ShopProductUpdateDto {
  @IsString() @MinLength(1) @MaxLength(120) name!: string;
  @IsString() @Matches(/^\d+(\.\d{1,4})?$/) unitPrice!: string;
  @IsString() @Matches(/^\d+(\.\d{1,4})?$/) reorderPoint!: string;
}
