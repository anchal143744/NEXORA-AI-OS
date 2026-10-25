import {IsBase64,IsIn,IsOptional,IsString,IsUUID,MaxLength,MinLength} from 'class-validator';
export class InvoiceSourceDto {
  @IsUUID() uploadKey!:string;
  @IsString() @MinLength(1) @MaxLength(150) fileName!:string;
  @IsIn(['application/pdf','image/png','image/jpeg']) mimeType!:string;
  @IsBase64() @MaxLength(7000000) data!:string;
}
export class SignatureDto {
  @IsUUID() uploadKey!:string;
  @IsString() @MinLength(1) @MaxLength(100) label!:string;
  @IsBase64() @MaxLength(280000) data!:string;
}
